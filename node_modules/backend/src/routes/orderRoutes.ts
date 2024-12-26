// src/routes/orderRoutes.ts
import express from "express";
import {
  placeOrder,
  userOrders,
  allOrders,
  getOrder,
  deleteOrder,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", placeOrder);
router.get("/user/:userId", userOrders);
router.get("/", allOrders);
router.get("/:orderId", getOrder);
router.delete("/:orderId", deleteOrder);

export default router;
