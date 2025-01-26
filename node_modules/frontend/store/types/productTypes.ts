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
  buyers?: IBuyer[];
  tags?: string[];
  images: File[] | string[];
  specifications?: string[];
  storeDetails?: string;
  otherInfo?: string;
  brand?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  questionsAndFeedback?: IQuestionAndFeedback[];
}

export interface IQuestionAndFeedback {
  _id?: string;
  user?: string;
  username: string;
  message: string;
  type: "question" | "feedback" | "replay";
  createdAt?: string;
  repliedAt?: string;
  replies?: IReply[];
}

export interface IReply {
  _id?: string;
  user: string;
  username: string;
  message: string;
  createdAt: string;
}

export interface Review {
  _id?: string;
  user: string;
  username: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  isReviewed: boolean;
}

export interface IBuyer {
  _id: string;
  username: string;
  quantity: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"; // Purchase status
  reviews?: Review;
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
  | "qandf";
