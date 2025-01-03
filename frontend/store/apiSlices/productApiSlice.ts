import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, GetProductsResponse, IPCart } from "../types/productTypes";

export const productApiSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/products",
    credentials: "include",
  }),
  tagTypes: ["Product", "Cart"],

  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<Product[], void>({
      query: () => "/",
      providesTags: ["Product"],
    }),

    // Get single product
    getProduct: builder.query<Product, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
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
    updateProduct: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    //delete
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Add carted item
    addCartedItem: builder.mutation<void, IPCart>({
      query: (cartedItem) => ({
        url: "/cart",
        method: "POST",
        body: cartedItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Update or remove carted item
    updateCartedItem: builder.mutation<
      void,
      { productId: string; quantity: number }
    >({
      query: (cartData) => ({
        url: "/cart",
        method: "PATCH",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
