// Product Model
import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

interface ICarted {
  _id: mongoose.Types.ObjectId;
  quantity: number;
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
  views: number;
  salesCount: number;
  averageRating: number;
  reviewCount: number;
  images: string[];
  slug: string;
  brand?: string;
  isFeatured: boolean;
  isActive: boolean;
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
    carted: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        quantity: { type: Number, default: 0 },
      },
    ],
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
export { IProduct };
