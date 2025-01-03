// src/routes/userRoutes.ts
import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  logoutUser,
  addToCart,
  updateCart,
  removeFromCart,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/cart", addToCart);
router.patch("/cart", updateCart);
router.patch("/cart/:id", removeFromCart);

export default router;
