import { RequestHandler } from "express";
import Order from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";
import mongoose from "mongoose";

// Place a new order
export const placeOrder: RequestHandler = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Fetch user and populate cart
    const user = await User.findById(req.user?._id).populate("cart.product");
    if (!user || !user.cart?.length) {
      res.status(400).json({ message: "No items in the cart" });
      return;
    }

    // Validate products in the cart
    const items = [];
    let itemsPrice = 0;
    let itemShippingPrice = 0;

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem._id);
      if (!product) {
        res.status(404).json({ message: `Product not found: ${cartItem._id}` });
        return;
      }

      const { price, shippingPrice } = product;

      items.push({
        product: product._id,
        quantity: cartItem.quantity,
        price,
        shippingPrice,
      });

      itemsPrice += cartItem.quantity * price;
      itemShippingPrice += cartItem.quantity * shippingPrice;
    }

    const totalAmount = itemsPrice + itemShippingPrice;

    const order = await Order.create({
      user: req.user?._id,
      items,
      itemsPrice,
      itemShippingPrice,
      totalAmount,
      shippingAddress,
      status: "Pending",
      paymentStatus: "Pending",
    });

    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get orders for a specific user
export const userOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user?._id }).populate(
      "items.product"
    );
    if (!orders.length) {
      res.status(404).json({ message: "No orders found" });
      return;
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get order by ID
export const getOrder: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "items.product"
    );
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get all orders (Admin only)
export const allOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete an order
export const deleteOrder: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Order deleted successfully", order });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update Carted Count
export const updateCartedCount: RequestHandler = async (req, res) => {
  try {
    const { productId, userId, quantity } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      res.status(400).json({ message: "Invalid productId or userId" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const existingCarted = product.carted.find(
      (c) => c._id.toString() === userId
    );

    if (existingCarted) {
      existingCarted.quantity += quantity;
    } else {
      product.carted.push({ _id: productId, quantity });
    }

    await product.save();

    res.status(200).json({ message: "Carted count updated", product });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
