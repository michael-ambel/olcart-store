// src/routes/categoryRoutes.ts
import express from "express";
import {
  addNewCategory,
  getAllCategory,
} from "../controllers/categoryController";

const router = express.Router();

router.post("/", addNewCategory);
router.get("/", getAllCategory);

export default router;
