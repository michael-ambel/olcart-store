import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, GetProductsResponse, IPCart } from "../types/productTypes";

export const productApiSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/products",
    credentials: "include",
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
} = productApiSlice;
