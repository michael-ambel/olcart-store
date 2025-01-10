import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrder, IOrderItem } from "../types/orderTypes";
import { ICartItem, IShippingAddress } from "../types/userTypes";

export const orderApiSlice = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/orders" }),
  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // Place an order
    placeOrder: builder.mutation<
      IOrder,
      { items: IOrderItem[]; shippingAddress: IShippingAddress }
    >({
      query: (orderData) => ({
        url: "/",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Get orders for the logged-in user
    getUserOrders: builder.query<IOrder[], void>({
      query: () => "/user",
      providesTags: ["Orders"],
    }),

    // Get a specific order by ID
    getOrder: builder.query<IOrder, string>({
      query: (orderId) => `/${orderId}`,
      providesTags: ["Orders"],
    }),

    // Get all orders (Admin only)
    getOrders: builder.query<IOrder[], void>({
      query: () => "/",
      providesTags: ["Orders"],
    }),

    // Update order status (Admin only)
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

    // Delete an order (Admin only)
    deleteOrder: builder.mutation<void, string>({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApiSlice;
