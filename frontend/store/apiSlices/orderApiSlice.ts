import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrder } from "../types/orderTypes";
import { ICartItem } from "../types/userTypes";

export const orderApiSlice = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // Place order
    placeOrder: builder.mutation<IOrder, Partial<IOrder>>({
      query: (newOrder) => ({
        url: "/orders",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Get all orders
    getOrders: builder.query<IOrder[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),

    // Get specific order
    getOrder: builder.query<IOrder, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ["Orders"],
    }),

    // Get user orders
    getUserOrders: builder.query<IOrder[], string>({
      query: (userId) => `/orders/user/${userId}`,
      providesTags: ["Orders"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<IOrder, { id: string; status: string }>(
      {
        query: ({ id, status }) => ({
          url: `/orders/${id}`,
          method: "PUT",
          body: { status },
        }),
        invalidatesTags: ["Orders"],
      }
    ),

    // Delete order
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetUserOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApiSlice;
