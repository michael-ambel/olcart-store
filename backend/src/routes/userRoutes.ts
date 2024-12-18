// src/routes/userRoutes.ts
import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);

export default router;
