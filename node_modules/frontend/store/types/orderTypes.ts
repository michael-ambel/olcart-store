// src/types/orderTypes.ts
export interface IOrderItem {
  product: string; // Product ID
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  user: string; // User ID
  items: IOrderItem[];
  totalAmount: number;
  status?: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt?: string;
  updatedAt?: string;
}
