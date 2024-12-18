// src/routes/orderRoutes.ts
import express from "express";
import {
  placeOrder,
  userOrders,
  allOrders,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", placeOrder);
router.get("/user/:userId", userOrders);
router.get("/", allOrders);

export default router;
