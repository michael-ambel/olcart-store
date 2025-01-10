import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface ICartItem {
  _id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  shippingPrice: number;
  checked: boolean;
}

interface IShippingAddress {
  _id?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  cart?: ICartItem[];
  shippingAddresses: IShippingAddress[];
  comparePassword(candidatePassword: string): Promise<boolean>;
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
        price: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        checked: { type: Boolean, default: true },
      },
    ],
    shippingAddresses: [
      {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
export { IUser, ICartItem, IShippingAddress };
