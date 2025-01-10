import { Request, Response, RequestHandler } from "express";
import Order, { IOrderItem } from "../models/orderModel";
import Product from "../models/productModel";
import User from "../models/userModel";

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
          console.log(product);
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
    const orders = await Order.find({ user: req.user?._id }).populate(
      "items.product"
    );
    if (!orders.length) {
      res.status(404).json({ message: "No orders found." });
      return;
    }
    res.status(200).json(orders);
  } catch (error: any) {
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
