import { RequestHandler } from "express";
import Order from "../models/orderModel";

// Place a new order
export const placeOrder: RequestHandler = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get orders for a specific user
export const userOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get all orders
export const allOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
