import express, { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateCartedItem,
  getProductsByIds,
  searchProducts,
  getUserFeed,
} from "../controllers/productController";
import { protectAdmin, protectCustomer } from "../utils/ProtectMiddleware";

const router = express.Router();

router.post("/", protectAdmin, createProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/userfeed", protectCustomer, getUserFeed);

router.patch("/carted", protectCustomer, updateCartedItem);
router.post("/cart", protectCustomer, getProductsByIds);
router.get("/:id", getProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
