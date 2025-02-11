import { Request, Response, NextFunction, RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Use Memory Storage for Initial Parsing
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5);

// 2. Validation Middleware (Unchanged)
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .isArray({ min: 1 })
    .withMessage("At least one category required")
    .custom((ids) => {
      if (!ids.every((id: string) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid category ID format");
      }
      return true;
    }),
];

// 3. Revised Middleware Flow
export const validateAndUploadProduct: RequestHandler[] = [
  // Parse form data (fields + files) into memory
  (req: Request, res: Response, next: NextFunction) => {
    memoryUpload(req, res, (err) => {
      if (err)
        return res
          .status(400)
          .json({ error: err.message || "File upload failed" });
      next();
    });
  },

  // Run validations
  ...validateProduct,

  // Check validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    if (!req.files?.length)
      return res.status(400).json({ error: "At least one image required" });
    next();
  },

  // Upload to Cloudinary only if validation passed
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];

      // Upload files to Cloudinary
      const uploadResults = await Promise.all(
        files.map(
          (file) =>
            new Promise<{ secure_url: string; public_id: string }>(
              (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  {
                    folder: "olcart",
                    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
                    transformation: [
                      { width: 800, height: 800, crop: "limit" },
                    ],
                    public_id: `${Date.now()}-${file.originalname}`,
                    resource_type: "image",
                  },
                  (error, result) => {
                    if (error) return reject(error);
                    if (!result?.secure_url || !result?.public_id) {
                      return reject(new Error("Cloudinary upload failed"));
                    }
                    resolve({
                      secure_url: result.secure_url,
                      public_id: result.public_id,
                    });
                  }
                );
                uploadStream.end(file.buffer);
              }
            )
        )
      );

      // Attach formatted results to request
      req.cloudinaryUrls = uploadResults.map((res) => ({
        url: res.secure_url,
        publicId: res.public_id,
      }));

      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Image upload failed",
      });
    }
  },
];

// Update-specific validation middleware
export const validateAndUploadProductUpdate: RequestHandler[] = [
  // Parse form data (fields + files) into memory
  (req: Request, res: Response, next: NextFunction) => {
    memoryUpload(req, res, (err) => {
      if (err)
        return res
          .status(400)
          .json({ error: err.message || "File upload failed" });
      next();
    });
  },

  // Allow fields to be optional during an update
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one category required")
    .custom((ids) => {
      if (
        ids &&
        !ids.every((id: string) => mongoose.Types.ObjectId.isValid(id))
      ) {
        throw new Error("Invalid category ID format");
      }
      return true;
    }),

  // Check validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Check if images are provided, or allow update without images
    if (!req.files?.length && !req.body.images) {
      next();
    } else if (!req.files?.length) {
      return res.status(400).json({ error: "At least one image required" });
    } else {
      next();
    }
  },

  // Upload to Cloudinary only if validation passed
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.files?.length) {
        const files = req.files as Express.Multer.File[];

        // Upload files to Cloudinary
        const uploadResults = await Promise.all(
          files.map(
            (file) =>
              new Promise<{ secure_url: string; public_id: string }>(
                (resolve, reject) => {
                  const uploadStream = cloudinary.uploader.upload_stream(
                    {
                      folder: "olcart",
                      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
                      transformation: [
                        { width: 800, height: 800, crop: "limit" },
                      ],
                      public_id: `${Date.now()}-${file.originalname}`,
                      resource_type: "image",
                    },
                    (error, result) => {
                      if (error) return reject(error);
                      if (!result?.secure_url || !result?.public_id) {
                        return reject(new Error("Cloudinary upload failed"));
                      }
                      resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                      });
                    }
                  );
                  uploadStream.end(file.buffer);
                }
              )
          )
        );

        // Attach formatted results to request
        req.cloudinaryUrls = uploadResults.map((res) => ({
          url: res.secure_url,
          publicId: res.public_id,
        }));
      }

      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Image upload failed",
      });
    }
  },
];
