// src/types/orderTypes.ts
export interface IOrderItem {
  _id: string; // Product ID
  quantity: number;
}

export interface Item {
  _id: string;
  name: string;
  price: number;
  shippingPrice: number;
  quantity: number;
  images: string[];
}
export interface IOrder {
  _id?: string;
  user: string; // User ID
  items: Item[];
  totalAmount: number;
  status?: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt?: string;
  updatedAt?: string;
}
