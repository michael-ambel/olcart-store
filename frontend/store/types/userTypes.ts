export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "customer" | "admin";
  cart?: ICartItem[];
}

export interface ICartItem {
  _id: string;
  quantity: number;
  price: number;
  shippingPrice: number;
}
