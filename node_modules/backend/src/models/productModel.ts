import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

interface ICarted {
  _id: mongoose.Types.ObjectId;
  quantity: number;
}

interface IReply {
  _id?: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  username?: string;
  message?: string;
  createdAt?: Date;
}

interface IQuestionAndFeedback {
  _id?: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  username?: string;
  message?: string;
  type?: "question" | "feedback" | "reply";
  createdAt?: Date;
  repliedAt?: Date;
  replies?: IReply[];
}

interface IReview {
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  isReviewed: boolean;
}

interface IBuyer {
  _id: mongoose.Types.ObjectId;
  username: string;
  quantity: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  reviews?: IReview;
}

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  shippingPrice: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId[];
  tags: string[];
  stock: number;
  carted: ICarted[];
  buyers: IBuyer[];
  views: number;
  salesCount: number;
  averageRating: number;
  reviewCount: number;
  questionsAndFeedback: IQuestionAndFeedback[];
  images: string[];
  slug: string;
  brand?: string;
  specifications: string[];
  storeDetails: string;
  otherInfo?: string;
  isFeatured: boolean;
  isActive: boolean;
}

const ReplySchema: Schema<IReply> = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const QuestionAndFeedbackSchema: Schema<IQuestionAndFeedback> = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String },
  message: { type: String },
  type: { type: String, enum: ["question", "feedback", "reply"] },
  createdAt: { type: Date, default: Date.now },
  repliedAt: { type: Date },
  replies: [ReplySchema],
});

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    shippingPrice: { type: Number, required: true },
    discountPrice: { type: Number },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
          validator: (v: string) =>
            /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v) ||
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
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        quantity: { type: Number, default: 0 },
      },
    ],
    buyers: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

ProductSchema.index(
  { name: "text", tags: "text", description: "text" },
  { weights: { name: 10, tags: 5, description: 1 } }
);

ProductSchema.index({ category: 1 });

ProductSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
export { IProduct, IReview, IQuestionAndFeedback, IBuyer, IReply };
