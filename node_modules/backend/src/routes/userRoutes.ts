// src/routes/userRoutes.ts
import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
  getUsers,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
