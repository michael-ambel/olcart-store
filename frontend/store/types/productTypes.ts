export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string[];
  stock: number;
  salesCount?: number;
  shippingPrice: number;
  carted?: IPCart[];
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
  tags?: string[];
  images: File[] | string[];
  specifications?: string[];
  storeDetails?: string;
  otherInfo?: string;
  brand?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface Review {
  user: string;
  rating: number;
  comment?: string;
  createdAt: string;
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

export type TabKey =
  | "description"
  | "specifications"
  | "reviews"
  | "store"
  | "otherInfo";
