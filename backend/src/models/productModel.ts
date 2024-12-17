import mongoose, { Schema, Document, Model } from "mongoose";

interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: mongoose.Types.ObjectId;
  tags: string[];
  stock: number;
  views: number;
  salesCount: number;
  images: string[];
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: { type: [String] },
    stock: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
export { IProduct };
