// store/productTypes.ts

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string[];
  stock: number;
  shippingPrice: number;
  carted: IPCart[];
  averageRating?: number;
  tags: string[];
  images: File[] | string[]; // Include both File and string (for URLs)
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
}

export interface IPCart {
  _id: string;
  quantity: number;
}
