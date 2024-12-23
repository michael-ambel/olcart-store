import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser, UserLoginRequest, UserLoginResponse } from "../types/userTypes";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/users" }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    //.. regi user
    registerUser: builder.mutation<IUser, Partial<IUser>>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),

    //..login user
    loginUser: builder.mutation<UserLoginResponse, UserLoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    //..logout user
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    //..get all user
    getUsers: builder.query<IUser[], void>({
      query: () => "/",
      providesTags: ["Users"],
    }),

    //...get user by id
    getUser: builder.query<IUser, string>({
      query: (id) => `/${id}`,
    }),

    //...update user
    updateUser: builder.mutation<IUser, { id: string; user: Partial<IUser> }>({
      query: ({ id, user }) => ({
        url: `/${id}`,
        method: "PUT",
        body: user,
      }),
    }),

    //..delete user
    deleteUser: builder.mutation<IUser, string>({
      query: (id) => ({
        url: "/",
        method: "DELETE",
      }),
    }),

    //......
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
