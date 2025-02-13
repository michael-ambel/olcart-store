import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, IPCart, Review } from "../types/productTypes";

const url = `${process.env["NEXT_PUBLIC_API_URL"]}/api/products`;

export const productApiSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
    mode: "cors",
    prepareHeaders: (headers) => {
      headers.set("Cache-Control", "no-cache");
      return headers;
    },
  }),
  tagTypes: ["Product", "Carted"],

  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<{ products: Product[]; total: number }, void>({
      query: () => "/",
      providesTags: ["Product"],
    }),

    // Get single product
    getProduct: builder.query<Product, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "Product", id }],
    }),

    //create
    createProduct: builder.mutation<Product, FormData>({
      query: (newProduct) => ({
        url: "/",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    //update
    updateProduct: builder.mutation<Product, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Product", id }],
    }),

    //delete
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Product", id }],
    }),

    updateCartedItem: builder.mutation<IPCart[], Partial<IPCart>>({
      query: (cartData) => ({
        url: "/carted",
        method: "PATCH",
        body: cartData,
      }),
      invalidatesTags: ["Carted"],
    }),

    // Get product details by IDs
    getProductsByIds: builder.query<Product[], string[]>({
      query: (productIds) => ({
        url: "/cart",
        method: "POST",
        body: { productIds },
      }),
      providesTags: ["Product"],
    }),
    // Search products
    searchProducts: builder.query<
      {
        products: Product[];
        success: boolean;
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      },
      {
        query?: string;
        category?: string;
        priceMin?: number;
        priceMax?: number;
        tags?: string[];
        sort?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({
        query,
        category,
        priceMin,
        priceMax,
        tags,
        sort = "popularity",
        page = 1,
        limit = 10,
      }) =>
        `/search?query=${query || ""}&category=${category || ""}&priceMin=${
          priceMin || ""
        }&priceMax=${priceMax || ""}&tags=${tags ? tags.join(",") : ""}&sort=${
          sort || ""
        }&page=${page}&limit=${limit}&timestamp=${Date.now()}`,
      providesTags: ["Product"],
    }),

    // Fetch top selling and rated products
    getTopSellingAndRatedProducts: builder.query<Partial<Product>[], void>({
      query: () => "/topselling-rated",
      providesTags: ["Product"],
    }),

    // Fetch user feed (based on preferences or interactions)
    getUserFeed: builder.query<
      {
        products: Product[];
        success: boolean;
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      },
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) =>
        `/userfeed?page=${page}&limit=${limit}&timestamp=${Date.now()}`,
      providesTags: ["Product"],
    }),

    // Create or Update Review
    createOrUpdateReview: builder.mutation<
      { message: string; review: Review },
      { productId: string; username: string; rating: number; comment?: string }
    >({
      query: ({ productId, username, rating, comment }) => ({
        url: `/reviews`,
        method: "POST", // POST used for create or update
        body: { productId, username, rating, comment },
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "Product", _id: productId },
      ],
    }),

    // Create or Update Question/Feedback
    createOrUpdateQuestionAndFeedback: builder.mutation<
      { message: string },
      {
        productId: string;
        username: string;
        message: string;
        type: "question" | "feedback" | "replay";
        replyTo?: string; // Optional for handling replies
      }
    >({
      query: ({ productId, username, message, type, replyTo }) => ({
        url: `/questions-and-feedback`,
        method: "POST", // POST used for create or update
        body: { productId, username, message, type, replyTo }, // Adjusted to match backend logic
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateCartedItemMutation,
  useGetProductsByIdsQuery,
  useSearchProductsQuery,
  useGetUserFeedQuery,
  useCreateOrUpdateReviewMutation,
  useCreateOrUpdateQuestionAndFeedbackMutation,
  useGetTopSellingAndRatedProductsQuery,
} = productApiSlice;
