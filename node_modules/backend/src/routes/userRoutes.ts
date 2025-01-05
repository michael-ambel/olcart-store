// src/routes/userRoutes.ts
import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  logoutUser,
  updateCart,
} from "../controllers/userController";
import { protectCustomer } from "../utils/ProtectMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/cart", protectCustomer, updateCart);

export default router;
