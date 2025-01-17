import { RequestHandler } from "express";
import Order, { IOrderItem } from "../models/orderModel";
import Product from "../models/productModel";
import User from "../models/userModel";
import Stripe from "stripe";
import paypal from "@paypal/checkout-server-sdk";
import * as crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// 1. Get Order Summary
export const getOrderSummary: RequestHandler = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "No items provided for order." });
      return;
    }

    if (!shippingAddress) {
      res.status(400).json({ message: "Shipping address is required." });
      return;
    }

    let itemsPrice = 0;
    let shippingPrice = 0;
    const orderItems = await Promise.all(
      items.map(
        async ({
          productId,
          quantity,
        }: {
          productId: string;
          quantity: number;
        }) => {
          const product = await Product.findById(productId).lean();
          if (!product) throw new Error(`Product not found: ${productId}`);
          if (product.stock < quantity)
            throw new Error(`Insufficient stock for product: ${product.name}`);

          const itemTotalPrice = product.price * quantity;
          const itemShippingPrice = product.shippingPrice * quantity;
          itemsPrice += itemTotalPrice;
          shippingPrice += itemShippingPrice;

          return {
            product: product._id,
            quantity,
            price: product.price,
            shippingPrice: product.shippingPrice,
          };
        }
      )
    );

    const totalAmount = itemsPrice + shippingPrice;

    res.status(200).json({
      items: orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalAmount,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Place an Order
export const placeOrder: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "Order must contain items." });
      return;
    }

    if (!shippingAddress) {
      res.status(400).json({ message: "Shipping address is required." });
      return;
    }

    let itemsPrice = 0;
    let shippingPrice = 0;

    const orderItems: IOrderItem[] = await Promise.all(
      items.map(
        async ({ _id, quantity }: { _id: string; quantity: number }) => {
          const product = await Product.findById(_id).lean();
          if (!product) {
            throw new Error(`Product not found: ${_id}`);
          }
          if (product.stock < quantity) {
            throw new Error(`Insufficient stock for product: ${product.name}`);
          }

          const itemTotalPrice = product.price * quantity;
          const itemShippingPrice = product.shippingPrice * quantity;

          itemsPrice += itemTotalPrice;
          shippingPrice += itemShippingPrice;

          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            shippingPrice: product.shippingPrice,
            quantity,
            images: product.images,
          };
        }
      )
    );

    const totalAmount = itemsPrice + shippingPrice;

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalAmount,
      status: "Pending",
      paymentStatus: "Pending",
    });

    await order.save();

    // Update product stock
    for (const { _id, quantity } of orderItems) {
      await Product.findByIdAndUpdate(_id, {
        $inc: { stock: -quantity, sold: quantity },
      });
    }

    // Clear user's cart
    const user = await User.findById(userId);
    if (user && user.cart) {
      user.cart = user.cart.filter(
        (cartItem) =>
          !orderItems.some(
            (orderItem) => orderItem._id.toString() === cartItem._id.toString()
          )
      );
      await user.save();
    }

    res
      .status(201)
      .json({ message: "Order placed successfully.", orderId: order._id });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Orders for a Specific User
export const userOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user?._id,
      paymentStatus: { $in: ["Pending", "Failed"] },
    });
    res.status(200).json(orders);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Get Order by ID
export const getOrder: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "items.product"
    );
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get All Orders (Admin Only)
export const allOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Delete an Order
export const deleteOrder: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    res.status(200).json({ message: "Order deleted successfully.", order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

// PayPal configuration
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID as string,
  process.env.PAYPAL_CLIENT_SECRET as string
);
const client = new paypal.core.PayPalHttpClient(environment);

export const createPaymentSession: RequestHandler = async (req, res) => {
  const { orderIds, paymentMethod } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || !orderIds.length) {
    res.status(400).json({ message: "Invalid or missing order IDs." });
    return;
  }

  if (!["stripe", "paypal"].includes(paymentMethod)) {
    res.status(400).json({ message: "Invalid payment method" });
    return;
  }

  try {
    const orders = await Order.find({ _id: { $in: orderIds } });

    if (!orders.length) {
      res.status(404).json({ message: "Orders not found" });
      return;
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    if (paymentMethod === "stripe") {
      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: orders.flatMap((order) =>
          order.items.map((item) => ({
            price_data: {
              currency: "usd",
              product_data: { name: item.name },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          }))
        ),
        mode: "payment",
        success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/payment-cancelled`,
        metadata: {
          orderIds: orders.map((order) => order._id?.toString()).join(","), // Convert to a comma-separated string
        },
      });

      res.status(200).json({ paymentUrl: session.url });
      return;
    } else if (paymentMethod === "paypal") {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: orders.map((order) => ({
          reference_id: order._id?.toString(),
          amount: {
            currency_code: "USD",
            value: order.totalAmount.toFixed(2),
          },
        })),
        application_context: {
          return_url: `${clientUrl}/payment-success`,
          cancel_url: `${clientUrl}/payment-cancelled`,
        },
      });

      const response = await client.execute(request);

      if (response.result.status === "CREATED") {
        const approvalUrl = response.result.links.find(
          (link: { rel: string; href: string }) => link.rel === "approve"
        )?.href;

        if (approvalUrl) {
          res.status(200).json({ paymentUrl: approvalUrl });
        } else {
          res
            .status(500)
            .json({ message: "Failed to retrieve PayPal approval URL" });
        }
      } else {
        res.status(500).json({ message: "Failed to create PayPal order" });
      }
      return;
    } else {
      res.status(400).json({ message: "Invalid payment method" });
      return;
    }
  } catch (error) {
    console.error("Payment session error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//backend payment webhook  controller and handler for both PayPal and stripe
export const handlePaymentWebhook: RequestHandler = async (req, res) => {
  if (req.headers["stripe-signature"]) {
    const stripeSignature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    try {
      let stripeEvent;
      try {
        stripeEvent = stripe.webhooks.constructEvent(
          req.body,
          stripeSignature,
          endpointSecret
        );
      } catch (err) {
        res
          .status(400)
          .send(
            `Stripe webhook signature verification failed: ${
              (err as Error).message
            }`
          );
        return;
      }

      switch (stripeEvent.type) {
        case "checkout.session.completed":
          const session = stripeEvent.data.object;
          const orderIds = session.metadata?.orderIds;
          if (!orderIds) {
            res.status(400).send("Order IDs missing in metadata.");
            return;
          }

          const orderIdArray = orderIds.split(",");

          await Promise.all(
            orderIdArray.map(async (orderId) => {
              const order = await Order.findById(orderId);
              if (order) {
                order.paymentStatus = "Completed";
                order.status = "Processing";
                await order.save();
              }
            })
          );

          res.status(200).send("Payment completed successfully.");
          break;

        case "checkout.session.async_payment_failed":
          const failedSession = stripeEvent.data.object;
          const failedOrderIds = failedSession.metadata?.orderIds;
          if (!failedOrderIds) {
            res.status(400).send("Order IDs missing in metadata.");
            return;
          }

          // Split the comma-separated string into an array
          const failedOrderIdArray = failedOrderIds.split(",");

          for (const orderId of failedOrderIdArray) {
            const failedOrder = await Order.findById(orderId);
            if (failedOrder) {
              failedOrder.paymentStatus = "Failed";
              await failedOrder.save();
            }
          }

          res.status(200).send("Payment failed.");
          break;

        default:
          res.status(200).send("Event not handled.");
          break;
      }
      return;
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      res.status(500).send("Internal server error");
      return;
    }
  }

  // PayPal Webhook Handling
  if (req.headers["paypal-transmission-id"]) {
    try {
      let event;
      try {
        event = JSON.parse(req.body.toString());
      } catch (error) {
        res.status(400).send("Invalid JSON payload.");
        return;
      }
      const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
      const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
      const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;
      const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE;

      const authResponse = await axios.post(
        `${PAYPAL_API_BASE}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
          auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const accessToken = authResponse.data.access_token;

      const validatePayPalHeaders = (headers: any): boolean => {
        return (
          headers["paypal-transmission-id"] &&
          headers["paypal-transmission-sig"] &&
          headers["paypal-auth-algo"] &&
          headers["paypal-cert-url"]
        );
      };

      if (!validatePayPalHeaders(req.headers)) {
        res.status(400).send("Invalid PayPal headers.");
        return;
      }

      const verificationResponse = await axios.post(
        `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
        {
          auth_algo: req.headers["paypal-auth-algo"],
          cert_url: req.headers["paypal-cert-url"],
          transmission_id: req.headers["paypal-transmission-id"],
          transmission_sig: req.headers["paypal-transmission-sig"],
          transmission_time: req.headers["paypal-transmission-time"],
          webhook_id: PAYPAL_WEBHOOK_ID,
          webhook_event: event,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (verificationResponse.data.verification_status !== "SUCCESS") {
        res.status(400).send("Invalid PayPal webhook signature.");
        return;
      }

      const capturePayment = async (orderId: string) => {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        try {
          const captureResponse = await client.execute(request);
          return captureResponse.result;
        } catch (error: any) {
          if (
            error.response?.statusCode === 422 &&
            error.response?.body?.message === "PAYMENT_ALREADY_DONE"
          ) {
            return null;
          }
          throw new Error("Failed to capture payment");
        }
      };

      switch (event.event_type) {
        case "CHECKOUT.ORDER.APPROVED":
          const purchaseUnits = event.resource.purchase_units;

          if (!Array.isArray(purchaseUnits)) {
            res.status(400).send("Invalid webhook payload.");
            return;
          }

          try {
            const captureResponse = await capturePayment(event.resource.id);
            if (captureResponse && captureResponse.status !== "COMPLETED") {
              res.status(400).send("Payment capture failed.");
              return;
            }
          } catch (error) {
            res.status(500).send("Payment capture error.");
            return;
          }

          for (const unit of purchaseUnits) {
            const orderId: string = unit.reference_id;
            const order = await Order.findById(orderId);

            if (!order) {
              console.error(`Order with ID ${orderId} not found.`);
              continue;
            }

            if (order.paymentStatus === "Completed") {
              continue;
            }

            order.paymentStatus = "Completed";
            order.status = "Processing";
            order.orderPaymentId = `PayPal,${event.resource.id}`;
            await order.save();
          }

          res.status(200).send("Order approved and processed.");
          return;

        case "PAYMENT.CAPTURE.COMPLETED":
          const orderId =
            event.resource.supplementary_data?.related_ids.order_id;
          if (!orderId) {
            res.status(400).send("Order ID missing in supplementary data.");
            return;
          }

          const orderPaymentId = `PayPal,${orderId}`;
          const order = await Order.findOne({ orderPaymentId });
          if (!order) return;
          if (order?.paymentStatus === "Completed") {
            res.status(200).send("Payment already processed.");
            return;
          }
          order.status = "Processing";
          order.paymentStatus = "Completed";
          await order.save();
          res.status(200).send("Payment capture completed.");
          return;

        case "PAYMENT.CAPTURE.DENIED":
          const deniedOrderIdsMetadata =
            event.resource.supplementary_data.related_ids.order_id;

          if (!deniedOrderIdsMetadata) {
            res.status(400).send("Order IDs missing in metadata.");
            return;
          }

          const deniedOrderIdArray = deniedOrderIdsMetadata.split(",");

          for (const orderId of deniedOrderIdArray) {
            const deniedOrder = await Order.findById(orderId);

            if (!deniedOrder) {
              console.error(`Order with ID ${orderId} not found.`);
              continue;
            }

            deniedOrder.paymentStatus = "Failed";
            await deniedOrder.save();
          }

          res.status(200).send("Payment capture denied.");
          return;

        default:
          res.status(200).send("Unhandled event type.");
          return;
      }
    } catch (error) {
      res.status(500).send("Internal server error.");
      return;
    }
  }

  res.status(400).send("Invalid signature");
};

// Fetch processing orders for the logged-in user
export const getUserProcessingOrders: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized access." });
      return;
    }

    const orders = await Order.find({
      user: userId,
      status: { $in: ["Pending", "Processing", "Shipped"] },
    }).sort({ "timestamps.placedAt": -1 });

    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching processing orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Fetch processed orders for the logged-in user
export const getUserProcessedOrders: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized access." });
      return;
    }

    const orders = await Order.find({
      user: userId,
      status: { $in: ["Delivered", "Cancelled"] },
    }).sort({ "timestamps.deliveredAt": -1 });

    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching processed orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
