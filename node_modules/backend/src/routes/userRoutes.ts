// src/routes/userRoutes.ts
import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  logoutUser,
  updateCart,
  getShippingAddresses,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../controllers/userController";
import { protectCustomer } from "../utils/ProtectMiddleware";
import { getCartItems } from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/cart", protectCustomer, getCartItems);
router.get("/", getUsers);
router.patch("/cart", protectCustomer, updateCart);
router.get("/shipping-address", protectCustomer, getShippingAddresses);
router.post("/shipping-address", protectCustomer, addShippingAddress);
router.patch("/shipping-address", protectCustomer, updateShippingAddress);
router.delete("/shipping-address", protectCustomer, deleteShippingAddress);
router.get("/:id", getUser);

export default router;
