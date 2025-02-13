import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IUser,
  ICartItem,
  IShippingAddress,
  CartResp,
} from "../types/userTypes";

const url = `${process.env["NEXT_PUBLIC_API_URL"]}/api/users`;

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
    mode: "cors",
    prepareHeaders: (headers) => {
      headers.set("Cache-Control", "no-cache");
      return headers;
    },
  }),
  tagTypes: ["Users", "Cart"],

  endpoints: (builder) => ({
    // Register user
    registerUser: builder.mutation<{ user: IUser }, Partial<IUser>>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),

    // Login user
    loginUser: builder.mutation<
      { user: IUser },
      { email: string; password: string }
    >({
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

    // Update cart
    updateCart: builder.mutation<CartResp, Partial<ICartItem>>({
      query: (cartData) => ({
        url: "/cart",
        method: "PATCH",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Shipping address endpoints
    addShippingAddress: builder.mutation<IShippingAddress[], IShippingAddress>({
      query: (address) => ({
        url: "/shipping-address",
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Users"],
    }),

    getShippingAddresses: builder.query<IShippingAddress[], void>({
      query: () => "/shipping-address",
      providesTags: ["Users"],
    }),

    updateShippingAddress: builder.mutation<
      IShippingAddress[],
      IShippingAddress
    >({
      query: (address) => ({
        url: "/shipping-address",
        method: "PATCH",
        body: address,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteShippingAddress: builder.mutation<void, { _id: string }>({
      query: ({ _id }) => ({
        url: "/shipping-address",
        method: "DELETE",
        body: { _id },
      }),
      invalidatesTags: ["Users"],
    }),

    // New endpoints for user management
    getUsers: builder.query<IUser[], void>({
      query: () => "/",
      providesTags: ["Users"],
    }),

    updateUser: builder.mutation<IUser, Partial<IUser>>({
      query: (user) => ({
        url: `/${user._id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserCartQuery,
  useUpdateCartMutation,
  useAddShippingAddressMutation,
  useGetShippingAddressesQuery,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
