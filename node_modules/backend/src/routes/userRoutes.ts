// src/routes/userRoutes.ts
import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  logoutUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
