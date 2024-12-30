"use client";

import React, { useState } from "react";
import { useAddCategoryMutation } from "@/store/apiSlices/categoryApiSlice";
import { CreateCategoryRequest } from "@/store/types/categoryTypes";

const CategoryForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [parentCategory, setParentCategory] = useState<string | undefined>(""); // Allow manual ID input
  const [addCategory, { isLoading, error }] = useAddCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to send to the API
    const newCategory: CreateCategoryRequest = {
      name,
      slug,
      parentCategory,
    };

    // Call the API to add the category
    try {
      await addCategory(newCategory).unwrap();
      //   setName(""); // Reset form fields after successful submission
      //   setSlug("");
      //   setParentCategory(""); // Reset parent category
    } catch (err) {
      console.error("Failed to create category", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[600px]">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700"
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="parentCategory"
          className="block text-sm font-medium text-gray-700"
        >
          Parent Category ID (for testing)
        </label>
        <input
          type="text"
          id="parentCategory"
          name="parentCategory"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <p className="text-sm text-gray-500">
          Enter the parent category ID here. Leave blank if there is no parent.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-[400px] bg-mb text-white py-2 px-4 my-[20px] rounded-md hover:bg-mo disabled:bg-gray-400"
      >
        {isLoading ? "Creating..." : "Create Category"}
      </button>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {(error as any).message}
        </div>
      )}
    </form>
  );
};

export default CategoryForm;
