import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  cart?: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
  }>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
export { IUser };
