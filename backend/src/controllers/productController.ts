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
        shippingPrice: 0,
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
      const { page = 1, limit = 100, category } = req.query;
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

// Search for products
export const searchProducts: RequestHandler = async (req, res) => {
  try {
    const { query, category, priceMin, priceMax, tags, sort, page, limit } =
      req.query;

    const filters: any = {};

    if (query) {
      filters.$or = [
        { name: { $regex: query as string, $options: "i" } },
        { description: { $regex: query as string, $options: "i" } },
        { tags: { $regex: query as string, $options: "i" } },
      ];
    }

    if (tags) {
      filters.tags = { $regex: tags as string, $options: "i" };
    }

    if (category) {
      const categoryIds = (category as string)
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id.trim()));
      filters.category = { $all: categoryIds };
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = parseFloat(priceMin as string);
      if (priceMax) filters.price.$lte = parseFloat(priceMax as string);
    }

    let sortOptions: any = {};
    switch (sort) {
      case "price_asc":
        sortOptions = { price: 1, _id: 1 }; // Secondary sort by _id important for products that have same balue for sorting
        break;
      case "price_desc":
        sortOptions = { price: -1, _id: 1 };
        break;
      case "popularity":
        sortOptions = { salesCount: -1, _id: 1 };
        break;
      case "rating":
        sortOptions = { averageRating: -1, _id: 1 };
        break;
      default:
        sortOptions = { _id: 1 }; // Default sort by _id
    }

    // Pagination calculation
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    console.log(page, limit, skip);
    const products = await Product.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Product.countDocuments(filters);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Fetch user feed considering preferences
export const getUserFeed: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Fetch user preferences
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const { preferences } = user;

    // Convert preferences to ObjectId where applicable
    const preferenceObjectIds = preferences.map((p) =>
      mongoose.Types.ObjectId.isValid(p) ? new mongoose.Types.ObjectId(p) : p
    );

    // Define filters for preference-based products
    const preferenceFilters =
      preferences.length > 0
        ? {
            $or: [
              { tags: { $in: preferences } },
              { category: { $in: preferenceObjectIds } },
            ],
          }
        : {};

    // Total preference-based product count
    const totalPreferenceProducts = await Product.countDocuments(
      preferenceFilters
    );

    // Pagination logic
    const skip = (page - 1) * limit; // Global skip value
    const preferenceSkip = Math.min(skip, totalPreferenceProducts); // Skip within preference products
    const preferenceLimit = Math.min(
      limit,
      totalPreferenceProducts - preferenceSkip
    ); // Limit for preference products

    // Fetch preference-based products
    const preferenceProducts =
      preferenceLimit > 0
        ? await Product.find(preferenceFilters)
            .sort({
              averageRating: -1,
              salesCount: -1,
              reviewCount: -1,
              _id: 1, // Secondary sort for consistent ordering
            })
            .skip(preferenceSkip)
            .limit(preferenceLimit)
        : [];

    // Total product count (only preference products)
    const total = totalPreferenceProducts;

    res.status(200).json({
      success: true,
      products: preferenceProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getUserFeed:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Get Top-Selling Products
export const getTopSellingAndTopRatedProducts: RequestHandler = async (
  req,
  res
) => {
  try {
    const products = await Product.find()
      .sort({ salesCount: -1, averageRating: -1 })
      .limit(10)
      .select("_id name price salesCount images averageRating reviewCount");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getTopSellingAndTopRatedProducts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createOrUpdateReview: RequestHandler = async (req, res) => {
  try {
    const { productId, rating, username, comment } = req.body;
    const userId = req.user?._id; // Assuming `req.user` contains the authenticated user

    if (!productId || !rating || !userId) {
      res.status(400).json({ message: "Invalid request data" });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (!product.buyers || product.buyers.length === 0) {
      res.status(400).json({
        message:
          "You haven't purchased this product, so you cannot leave a review",
      });
      return;
    }

    const buyer = product.buyers.find(
      (buyer) => buyer._id.toString() === userId.toString()
    );

    if (!buyer) {
      res.status(400).json({ message: "Only buyers can leave a review" });
      return;
    }

    if (buyer.status !== "Delivered") {
      res.status(400).json({
        message: "You can only review a product after it has been delivered",
      });
      return;
    }

    const now = new Date();
    let oldRating = 0;

    buyer.username = username;
    if (buyer.reviews?.isReviewed) {
      oldRating = buyer.reviews.rating;

      buyer.reviews.rating = rating;
      buyer.reviews.comment = comment;
      buyer.reviews.updatedAt = now;

      product.averageRating = parseFloat(
        (
          ((product.averageRating || 0) * product.reviewCount -
            oldRating +
            rating) /
          product.reviewCount
        ).toFixed(2)
      );
    } else {
      buyer.reviews = {
        rating,
        comment,
        createdAt: now,
        updatedAt: now,
        isReviewed: true,
      };

      // Recalculate averageRating and increment reviewCount
      product.averageRating = parseFloat(
        (
          ((product.averageRating || 0) * product.reviewCount + rating) /
          (product.reviewCount + 1)
        ).toFixed(2)
      );
      product.reviewCount += 1;
    }

    product.averageRating = Math.min(Math.max(product.averageRating, 0), 5);

    await product.save();

    res.status(200).json({
      message: buyer.reviews.isReviewed
        ? "Review updated successfully"
        : "Review added successfully",
      buyer,
    });
  } catch (error) {
    console.error("Error in createOrUpdateReview:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Create a Question, Feedback, or Reply
export const handleQuestionAndFeedback: RequestHandler = async (req, res) => {
  try {
    const { productId, message, type, username, replyTo } = req.body;
    const userId = req.user?._id;

    if (!productId || !message || !type || !username || !userId) {
      res.status(400).json({ message: "Invalid request data" });
      return;
    }

    if (!["question", "feedback", "replay"].includes(type)) {
      res.status(400).json({
        message: "Invalid type. Must be 'question', 'feedback', or 'reply'.",
      });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (type === "replay") {
      // Handle replies by adding them to an existing question/feedback
      const parentEntry = product.questionsAndFeedback.find(
        (entry) => entry?._id?.toString() === replyTo?.toString()
      );

      if (!parentEntry) {
        res.status(404).json({ message: "Parent question/feedback not found" });
        return;
      }
      console.log(productId, message, type, username, replyTo);
      // Add the reply to the replies array
      const newReply = {
        _id: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(userId),
        username,
        message,
        createdAt: new Date(),
      };

      if (!parentEntry.replies) {
        parentEntry.replies = [];
      }

      parentEntry.replies.push(newReply);
      parentEntry.repliedAt = new Date();
      await product.save();

      res
        .status(201)
        .json({ message: "Reply added successfully", reply: newReply });
      return;
    }

    // Handle new question/feedback creation
    const newEntry = {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(userId),
      username,
      message,
      type,
      createdAt: new Date(),
      replies: [],
    };

    product.questionsAndFeedback.push(newEntry);
    await product.save();

    res.status(201).json({
      message: "Question/Feedback added successfully",
      entry: newEntry,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
