// src/routes/orderRoutes.ts
import express from "express";
import {
  placeOrder,
  userOrders,
  allOrders,
  getOrder,
  deleteOrder,
  getOrderSummary,
} from "../controllers/orderController";
import { protectCustomer } from "../utils/ProtectMiddleware";

const router = express.Router();

router.post("/", protectCustomer, placeOrder);
router.post("/summary", getOrderSummary);
router.get("/user", userOrders);
router.get("/", allOrders);
router.get("/:orderId", getOrder);
router.delete("/:orderId", deleteOrder);

export default router;
