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

    // adding, updating, and removing cart items
    updateCart: builder.mutation<ICartItem[], Partial<ICartItem>>({
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
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserCartQuery,
  useUpdateCartMutation,
} = userApiSlice;
