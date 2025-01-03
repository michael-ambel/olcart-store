// Updated Product Model
import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

interface ICartedCount {
  userId: mongoose.Types.ObjectId;
  count: number;
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
  views: number;
  salesCount: number;
  averageRating: number;
  reviewCount: number;
  images: string[];
  slug: string;
  brand?: string;
  isFeatured: boolean;
  isActive: boolean;
  cartedCount: ICartedCount[];
}

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
    cartedCount: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

ProductSchema.index({ name: 1, price: 1, category: 1 });
ProductSchema.index({ name: "text", tags: "text" });

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
export { IProduct };
