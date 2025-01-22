// store/productTypes.ts

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string[];
  stock: number;
  salesCount: number;
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

export interface ICartDetail {
  _id: string;
  name: string;
  quantity: number;
  stock: number;
  price: number;
  shippingPrice: number;
  image: string;
  checked: boolean;
}

export interface ISearchProduct {
  query?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export interface Filters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}
