// src/types/orderTypes.ts
export interface IOrderItem {
  _id: string; // Product ID
  quantity: number;
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
