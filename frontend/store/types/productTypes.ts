// store/productTypes.ts

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string[];
  stock: number;
  averageRating?: number;
  tags: string[];
  images: File[] | string[]; // Include both File and string (for URLs)
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
}

export interface IPCart {
  productId: string;
  quantity: number;
  userId: string;
}
