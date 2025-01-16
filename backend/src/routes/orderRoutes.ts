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
  handlePaymentWebhook,
} from "../controllers/orderController";
import { protectCustomer } from "../utils/ProtectMiddleware";

const router = express.Router();

router.post("/", protectCustomer, placeOrder);
router.post("/summary", getOrderSummary);
router.get("/user", protectCustomer, userOrders);
router.get("/", allOrders);
router.post("/payment-session", createPaymentSession);
// router.post("/payment-webhook", handlePaymentWebhook);
router.get("/:orderId", getOrder);
router.delete("/:orderId", deleteOrder);

export default router;
