import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  shippingPrice: number;
  quantity: number;
  images: string[];
}

interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress: {
    _id?: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  };
  paymentStatus: "Pending" | "Completed" | "Failed";
  timestamps: {
    placedAt: Date;
    processedAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  trackingNumber?: string;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        images: [{ type: String, required: true }],
      },
    ],
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
      _id: { type: String },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      isDefault: { type: Boolean },
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    timestamps: {
      placedAt: { type: Date, default: Date.now },
      processedAt: Date,
      shippedAt: Date,
      deliveredAt: Date,
    },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
