// src/routes/orderRoutes.ts
import express from "express";
import {
  placeOrder,
  userOrders,
  allOrders,
  getOrder,
  deleteOrder,
  getOrderSummary,
  createPaymentSession,
  getUserProcessedOrders,
  getUserProcessingOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import { protectAdmin, protectCustomer } from "../utils/ProtectMiddleware";

const router = express.Router();

router.post("/", protectCustomer, placeOrder);
router.post("/summary", getOrderSummary);
router.get("/user", protectCustomer, userOrders);
router.get("/", allOrders);
router.post("/payment-session", protectCustomer, createPaymentSession);
router.get("/user/processing", protectCustomer, getUserProcessingOrders);
router.get("/user/processed", protectCustomer, getUserProcessedOrders);
router.get("/:orderId", protectCustomer, getOrder);
router.put("/:orderId", protectAdmin, updateOrderStatus);
router.delete("/:orderId", protectAdmin, deleteOrder);

export default router;
