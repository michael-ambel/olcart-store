import express from "express";
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
  createOrUpdateReview,
  handleQuestionAndFeedback,
  getTopSellingAndTopRatedProducts,
} from "../controllers/productController";
import { protectAdmin, protectCustomer } from "../utils/ProtectMiddleware";
import {
  validateAndUploadProduct,
  validateAndUploadProductUpdate,
} from "../controllers/helper/CreateProductMiddleware";

const router = express.Router();

router.post("/", protectAdmin, validateAndUploadProduct, createProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.post("/reviews", protectCustomer, createOrUpdateReview);
router.post(
  "/questions-and-feedback",
  protectCustomer,
  handleQuestionAndFeedback
);
router.get("/topselling-rated", getTopSellingAndTopRatedProducts);
router.get("/userfeed", getUserFeed);
router.patch("/carted", protectCustomer, updateCartedItem);
router.post("/cart", getProductsByIds);
router.get("/:id", getProduct);
router.put("/:id", protectAdmin, validateAndUploadProductUpdate, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
