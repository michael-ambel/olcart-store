"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const ReplySchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: () => new mongoose_1.default.Types.ObjectId(),
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});
const QuestionAndFeedbackSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: () => new mongoose_1.default.Types.ObjectId(),
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
    message: { type: String },
    type: { type: String, enum: ["question", "feedback", "reply"] },
    createdAt: { type: Date, default: Date.now },
    repliedAt: { type: Date },
    replies: [ReplySchema],
});
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    shippingPrice: { type: Number, required: true },
    discountPrice: { type: Number },
    category: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    ],
    tags: { type: [String] },
    stock: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    specifications: { type: [String], default: [] },
    storeDetails: { type: String },
    otherInfo: { type: String },
    images: [
        {
            type: String,
            validate: {
                validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v) ||
                    v.startsWith("uploads/"),
                message: "Invalid image URL or path",
            },
        },
    ],
    brand: { type: String },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    carted: [
        {
            _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            quantity: { type: Number, default: 0 },
        },
    ],
    buyers: [
        {
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            username: { type: String },
            quantity: { type: Number },
            status: {
                type: String,
                enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            },
            reviews: {
                rating: { type: Number, default: 0, min: 0, max: 5 },
                comment: { type: String },
                createdAt: { type: Date },
                updatedAt: { type: Date },
                isReviewed: { type: Boolean, default: false },
            },
        },
    ],
    questionsAndFeedback: [QuestionAndFeedbackSchema],
}, { timestamps: true });
ProductSchema.index({ name: "text", tags: "text", description: "text" }, { weights: { name: 10, tags: 5, description: 1 } });
ProductSchema.index({ category: 1 });
ProductSchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
    }
    next();
});
const Product = mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
