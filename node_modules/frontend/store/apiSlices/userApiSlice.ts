import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser, ICartItem } from "../types/userTypes";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/users" }),
  tagTypes: ["Users", "Cart"],

  endpoints: (builder) => ({
    // Register user
    registerUser: builder.mutation<IUser, Partial<IUser>>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),

    // Login user
    loginUser: builder.mutation<IUser, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Logout user
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // Get user cart
    getUserCart: builder.query<ICartItem[], void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    // Add item to user cart
    updateCartItem: builder.mutation<
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

    // Add new cart item
    addCartItem: builder.mutation<void, Partial<ICartItem>>({
      query: (cartItem) => ({
        url: "/cart",
        method: "POST",
        body: cartItem,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserCartQuery,
  useUpdateCartItemMutation,
  useAddCartItemMutation,
} = userApiSlice;
