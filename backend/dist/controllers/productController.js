"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQuestionAndFeedback = exports.createOrUpdateReview = exports.getTopSellingAndTopRatedProducts = exports.getUserFeed = exports.searchProducts = exports.getProductsByIds = exports.updateCartedItem = exports.getCartItems = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = exports.validateProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const slugify_1 = __importDefault(require("slugify"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Setup Multer for image upload - defines how Multer should store uploaded files
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/images"); // Folder for uploaded images
    },
    filename: (req, file, cb) => {
        // Unique filename with timestamp
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|avif/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true); // Allow the file
        }
        cb(new Error("Images only!"));
    },
}).array("images", 5); // Allow up to 5 images
// Validation middleware for product creation
exports.validateProduct = [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be a positive number"),
    (0, express_validator_1.body)("category")
        .isArray()
        .withMessage("Category must be an array of IDs")
        .custom((value) => {
        if (value.some((id) => !mongoose_1.default.Types.ObjectId.isValid(id))) {
            throw new Error("Each category must be a valid ObjectId");
        }
        return true;
    }),
    (0, express_validator_1.body)("images")
        .isArray()
        .withMessage("Images must be an array of image URLs")
        .custom((value) => {
        if (value &&
            !value.every((image) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(image))) {
            throw new Error("Each image URL must be valid");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
// Utility function for handling image upload
const handleImageUpload = (req, res, callback) => {
    upload(req, res, (err) => {
        if (err) {
            console.log("Error during file upload:", err);
            return res.status(400).json({ error: err.message });
        }
        callback();
    });
};
// Create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleImageUpload(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, description, price, category, stock, slug, tags } = req.body;
            const files = req.files;
            const images = files
                ? files.map((file) => `http://localhost:5000/uploads/images/${file.filename}`)
                : [];
            const product = yield productModel_1.default.create({
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
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    }));
});
exports.createProduct = createProduct;
// Get all products with pagination and filters
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin" || "customer") {
            const { page = 1, limit = 100, category } = req.query;
            const filter = {};
            if (category)
                filter.category = category;
            const products = yield productModel_1.default.find(filter)
                .skip((+page - 1) * +limit)
                .limit(+limit);
            const total = yield productModel_1.default.countDocuments(filter);
            res.status(200).json({ products, total });
            return;
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getProducts = getProducts;
// Get a single product by ID
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findById(req.params.id).populate("category", "name");
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getProduct = getProduct;
// Update a product by ID
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleImageUpload(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, description, price, category, stock, tags } = req.body;
            const files = req.files;
            const images = files
                ? files.map((file) => `/uploads/images/${file.filename}`)
                : undefined;
            const categoryIds = category.map((id) => new mongoose_1.default.Types.ObjectId(id));
            const updateData = Object.assign({ description,
                price, category: categoryIds, stock,
                tags }, (name && {
                name,
                slug: (0, slugify_1.default)(name, { lower: true, strict: true }),
            }));
            if (images)
                updateData.images = images;
            const product = yield productModel_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(product);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }));
});
exports.updateProduct = updateProduct;
// Delete a product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteProduct = deleteProduct;
// Get Cart Items
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).populate("cart.product", "name price");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!user.cart || user.cart.length === 0) {
            res.status(200).json({ cart: [] });
            return;
        }
        res.status(200).json(user.cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getCartItems = getCartItems;
// Add or Update Carted Item
const updateCartedItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { _id: productId, quantity } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!productId || !userId) {
            res.status(400).json({ message: "Invalid request data" });
            return;
        }
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const cartedIndex = product.carted.findIndex((item) => item._id.toString() === userId.toString());
        if (cartedIndex === -1) {
            product.carted.push({ _id: userId, quantity });
        }
        else {
            if (quantity > 0) {
                product.carted[cartedIndex].quantity = quantity;
            }
            else {
                product.carted.splice(cartedIndex, 1);
            }
        }
        yield product.save();
        res.status(200).json(product.carted);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateCartedItem = updateCartedItem;
// Get product details by an array of product IDs
const getProductsByIds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productIds } = req.body; // Expect an array of product IDs in the request body
        if (!Array.isArray(productIds) || productIds.length === 0) {
            res.status(400).json({ message: "Invalid or empty product IDs array" });
            return;
        }
        // Find products matching the provided IDs and select only necessary fields
        const products = yield productModel_1.default.find({ _id: { $in: productIds } }).select("name price stock shippingPrice images");
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByIds = getProductsByIds;
// Search for products
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, category, priceMin, priceMax, tags, sort, page, limit } = req.query;
        const filters = {};
        if (query) {
            filters.$or = [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $regex: query, $options: "i" } },
            ];
        }
        if (tags) {
            filters.tags = { $regex: tags, $options: "i" };
        }
        if (category) {
            const categoryIds = category
                .split(",")
                .map((id) => new mongoose_1.default.Types.ObjectId(id.trim()));
            filters.category = { $all: categoryIds };
        }
        if (priceMin || priceMax) {
            filters.price = {};
            if (priceMin)
                filters.price.$gte = parseFloat(priceMin);
            if (priceMax)
                filters.price.$lte = parseFloat(priceMax);
        }
        let sortOptions = {};
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
        const skip = (parseInt(page) - 1) * parseInt(limit);
        console.log(page, limit, skip);
        const products = yield productModel_1.default.find(filters)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));
        const total = yield productModel_1.default.countDocuments(filters);
        res.status(200).json({
            success: true,
            products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error in searchProducts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.searchProducts = searchProducts;
//Fetch user feed considering preferences
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Fetch user preferences
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const { preferences } = user;
        // Convert preferences to ObjectId where applicable
        const preferenceObjectIds = preferences.map((p) => mongoose_1.default.Types.ObjectId.isValid(p) ? new mongoose_1.default.Types.ObjectId(p) : p);
        // Define filters for preference-based products
        const preferenceFilters = preferences.length > 0
            ? {
                $or: [
                    { tags: { $in: preferences } },
                    { category: { $in: preferenceObjectIds } },
                ],
            }
            : {};
        // Total preference-based product count
        const totalPreferenceProducts = yield productModel_1.default.countDocuments(preferenceFilters);
        // Pagination logic
        const skip = (page - 1) * limit; // Global skip value
        const preferenceSkip = Math.min(skip, totalPreferenceProducts); // Skip within preference products
        const preferenceLimit = Math.min(limit, totalPreferenceProducts - preferenceSkip); // Limit for preference products
        // Fetch preference-based products
        const preferenceProducts = preferenceLimit > 0
            ? yield productModel_1.default.find(preferenceFilters)
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
    }
    catch (error) {
        console.error("Error in getUserFeed:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getUserFeed = getUserFeed;
//Get Top-Selling Products
const getTopSellingAndTopRatedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find()
            .sort({ salesCount: -1, averageRating: -1 })
            .limit(10)
            .select("_id name price salesCount images averageRating reviewCount");
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error in getTopSellingAndTopRatedProducts:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getTopSellingAndTopRatedProducts = getTopSellingAndTopRatedProducts;
const createOrUpdateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productId, rating, username, comment } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Assuming `req.user` contains the authenticated user
        if (!productId || !rating || !userId) {
            res.status(400).json({ message: "Invalid request data" });
            return;
        }
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if (!product.buyers || product.buyers.length === 0) {
            res.status(400).json({
                message: "You haven't purchased this product, so you cannot leave a review",
            });
            return;
        }
        const buyer = product.buyers.find((buyer) => buyer._id.toString() === userId.toString());
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
        if ((_b = buyer.reviews) === null || _b === void 0 ? void 0 : _b.isReviewed) {
            oldRating = buyer.reviews.rating;
            buyer.reviews.rating = rating;
            buyer.reviews.comment = comment;
            buyer.reviews.updatedAt = now;
            product.averageRating = parseFloat((((product.averageRating || 0) * product.reviewCount -
                oldRating +
                rating) /
                product.reviewCount).toFixed(2));
        }
        else {
            buyer.reviews = {
                rating,
                comment,
                createdAt: now,
                updatedAt: now,
                isReviewed: true,
            };
            // Recalculate averageRating and increment reviewCount
            product.averageRating = parseFloat((((product.averageRating || 0) * product.reviewCount + rating) /
                (product.reviewCount + 1)).toFixed(2));
            product.reviewCount += 1;
        }
        product.averageRating = Math.min(Math.max(product.averageRating, 0), 5);
        yield product.save();
        res.status(200).json({
            message: buyer.reviews.isReviewed
                ? "Review updated successfully"
                : "Review added successfully",
            buyer,
        });
    }
    catch (error) {
        console.error("Error in createOrUpdateReview:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.createOrUpdateReview = createOrUpdateReview;
// Create a Question, Feedback, or Reply
const handleQuestionAndFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, message, type, username, replyTo } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
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
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if (type === "replay") {
            // Handle replies by adding them to an existing question/feedback
            const parentEntry = product.questionsAndFeedback.find((entry) => { var _a; return ((_a = entry === null || entry === void 0 ? void 0 : entry._id) === null || _a === void 0 ? void 0 : _a.toString()) === (replyTo === null || replyTo === void 0 ? void 0 : replyTo.toString()); });
            if (!parentEntry) {
                res.status(404).json({ message: "Parent question/feedback not found" });
                return;
            }
            console.log(productId, message, type, username, replyTo);
            // Add the reply to the replies array
            const newReply = {
                _id: new mongoose_1.default.Types.ObjectId(),
                user: new mongoose_1.default.Types.ObjectId(userId),
                username,
                message,
                createdAt: new Date(),
            };
            if (!parentEntry.replies) {
                parentEntry.replies = [];
            }
            parentEntry.replies.push(newReply);
            parentEntry.repliedAt = new Date();
            yield product.save();
            res
                .status(201)
                .json({ message: "Reply added successfully", reply: newReply });
            return;
        }
        // Handle new question/feedback creation
        const newEntry = {
            _id: new mongoose_1.default.Types.ObjectId(),
            user: new mongoose_1.default.Types.ObjectId(userId),
            username,
            message,
            type,
            createdAt: new Date(),
            replies: [],
        };
        product.questionsAndFeedback.push(newEntry);
        yield product.save();
        res.status(201).json({
            message: "Question/Feedback added successfully",
            entry: newEntry,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.handleQuestionAndFeedback = handleQuestionAndFeedback;
