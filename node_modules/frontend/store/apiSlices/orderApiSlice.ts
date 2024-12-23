import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrder } from "../types/orderTypes";

export const orderApiSlice = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/orders" }),
  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    //..place order
    placeOrder: builder.mutation<IOrder, Partial<IOrder>>({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),

    //...get orders
    getOrders: builder.query<IOrder[], void>({
      query: () => "/",
      providesTags: ["Orders"],
    }),

    //..get order
    getOrder: builder.query<IOrder, string>({
      query: (id) => `/${id}`,
      providesTags: ["Orders"],
    }),

    //..get user order
    getUserOrder: builder.query<IOrder, string>({
      query: (id) => `user/${id}`,
      providesTags: ["Orders"],
    }),

    //..update order status
    updateOrderStatus: builder.mutation<IOrder, { id: string; status: string }>(
      {
        query: ({ id, status }) => ({
          url: `/${id}`,
          method: "PUT",
          body: { status },
        }),
        invalidatesTags: ["Orders"],
      }
    ),

    //..delete order
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    //...//
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetUserOrderQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApiSlice;
