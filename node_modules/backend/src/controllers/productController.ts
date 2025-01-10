import { RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import slugify from "slugify";
import mongoose from "mongoose";
import User from "../models/userModel";

// Setup Multer for image upload - defines how Multer should store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Folder for uploaded images
  },
  filename: (req, file, cb) => {
    // Unique filename with timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|avif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Allow the file
    }
    cb(new Error("Images only!"));
  },
}).array("images", 5); // Allow up to 5 images

// Validation middleware for product creation
export const validateProduct = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .isArray()
    .withMessage("Category must be an array of IDs")
    .custom((value) => {
      if (value.some((id: string) => !mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Each category must be a valid ObjectId");
      }
      return true;
    }),
  body("images")
    .isArray()
    .withMessage("Images must be an array of image URLs")
    .custom((value) => {
      if (
        value &&
        !value.every((image: string) =>
          /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(image)
        )
      ) {
        throw new Error("Each image URL must be valid");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Utility function for handling image upload
const handleImageUpload = (req: Request, res: Response, callback: Function) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("Error during file upload:", err);
      return res.status(400).json({ error: err.message });
    }
    callback();
  });
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  handleImageUpload(req, res, async () => {
    try {
      const { name, description, price, category, stock, slug, tags } =
        req.body;

      const files = req.files as Express.Multer.File[];
      const images = files
        ? files.map(
            (file) => `http://localhost:5000/uploads/images/${file.filename}`
          )
        : [];

      const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        tags: JSON.parse(tags || "[]"),
        images,
        slug,
      });

      res.status(201).json(product);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: (error as Error).message });
    }
  });
};

// Get all products with pagination and filters
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role === "admin" || "customer") {
      const { page = 1, limit = 10, category } = req.query;
      const filter: any = {};
      if (category) filter.category = category;

      const products = await Product.find(filter)
        .skip((+page - 1) * +limit)
        .limit(+limit);
      const total = await Product.countDocuments(filter);

      res.status(200).json({ products, total });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a single product by ID
export const getProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a product by ID
export const updateProduct: RequestHandler = async (req, res) => {
  handleImageUpload(req, res, async () => {
    try {
      const { name, description, price, category, stock, tags } = req.body;
      const files = req.files as Express.Multer.File[];
      const images = files
        ? files.map((file) => `/uploads/images/${file.filename}`)
        : undefined;

      const categoryIds = category.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );

      const updateData: any = {
        description,
        price,
        category: categoryIds,
        stock,
        tags,
        ...(name && {
          name,
          slug: slugify(name, { lower: true, strict: true }),
        }),
      };

      if (images) updateData.images = images;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
};

// Delete a product
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get Cart Items
export const getCartItems: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).populate(
      "cart.product",
      "name price"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.cart || user.cart.length === 0) {
      res.status(200).json({ cart: [] });
      return;
    }

    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Add or Update Carted Item
export const updateCartedItem: RequestHandler = async (req, res) => {
  try {
    const { _id: productId, quantity } = req.body;
    const userId = req.user?._id;

    if (!productId || !userId) {
      res.status(400).json({ message: "Invalid request data" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const cartedIndex = product.carted.findIndex(
      (item) => item._id.toString() === userId.toString()
    );

    if (cartedIndex === -1) {
      product.carted.push({ _id: userId, quantity });
    } else {
      if (quantity > 0) {
        product.carted[cartedIndex].quantity = quantity;
      } else {
        product.carted.splice(cartedIndex, 1);
      }
    }

    await product.save();
    res.status(200).json(product.carted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get product details by an array of product IDs
export const getProductsByIds: RequestHandler = async (req, res) => {
  try {
    const { productIds } = req.body; // Expect an array of product IDs in the request body

    if (!Array.isArray(productIds) || productIds.length === 0) {
      res.status(400).json({ message: "Invalid or empty product IDs array" });
      return;
    }

    // Find products matching the provided IDs and select only necessary fields
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "name price stock shippingPrice images"
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
