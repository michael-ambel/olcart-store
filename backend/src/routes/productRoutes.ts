import express, { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { protectAdmin, protectCustomer } from "../utils/ProtectMiddleware";

const router = express.Router();

router.post("/", protectAdmin, createProduct);
router.get("/", protectCustomer, getProducts);
router.get("/:id", getProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
