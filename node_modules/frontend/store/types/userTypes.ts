export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "customer" | "admin";
  cart?: Array<{
    product: string;
    quantity: number;
  }>;
}

export interface ICartItem {
  product: string;
  quantity: number;
  price: number;
  shippingPrice: number;
}
