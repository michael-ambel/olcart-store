// store/categoryApiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/categoryTypes";

export const categoryApiSlice = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/categories",
  }),
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    //..get categories
    getCategories: builder.query<Category[], void>({
      query: () => "/",
      providesTags: ["Category"],
    }),

    //..add category
    addCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (newCategory) => ({
        url: "/",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),

    //..update category
    updateCategory: builder.mutation<Category, UpdateCategoryRequest>({
      query: ({ _id, ...updateData }) => ({
        url: `/${_id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Category"],
    }),

    //..delete category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
