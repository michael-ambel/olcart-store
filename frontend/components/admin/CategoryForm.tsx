"use client";

import React, { useEffect, useState } from "react";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
} from "@/store/apiSlices/categoryApiSlice";
import { CategoryTree } from "@/store/types/categoryTypes";
import { showToast } from "../ToastNotifications";

const CategoryCreate: React.FC = () => {
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createCategory, { isLoading }] = useAddCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isParent, setIsParent] = useState(false);
  const [isChild, setIsChild] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);

  useEffect(() => {
    if (categoriesData) {
      setCategoryTree(categoriesData);
    }
  }, [categoriesData]);

  const handleSelectionChange = (level: number, id: string) => {
    const updatedPath = selectedPath.slice(0, level);
    if (id) {
      updatedPath.push(id);
    }
    setSelectedPath(updatedPath);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast("error", "Category name cannot be empty");
      return;
    }

    const parentCategory = isParent
      ? undefined
      : selectedPath[selectedPath.length - 1];

    try {
      await createCategory({
        name: newCategoryName,
        slug: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
        parentCategory,
      }).unwrap();
      showToast("success", "Category created successfully");
      setNewCategoryName("");
      setSelectedPath([]);
      setIsParent(false);
      setIsChild(false);
    } catch {
      showToast("error", "Failed to create category");
    }
  };

  const renderSelectors = () => {
    if (isParent) return null;

    const allSelectors = [];
    let currentCategories = categoryTree;

    for (let level = 0; level <= selectedPath.length; level++) {
      if (!currentCategories || currentCategories.length === 0) break;

      allSelectors.push(
        <select
          key={level}
          value={selectedPath[level] || ""}
          onChange={(e) => handleSelectionChange(level, e.target.value)}
          className="w-auto p-2 autline-1 rounded-lg m-1 focus:outline-none focus:ring-2 ring-1 ring-mg"
        >
          <option value="">Select Category</option>
          {currentCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      );

      currentCategories =
        (selectedPath[level] &&
          currentCategories.find((cat) => cat._id === selectedPath[level])
            ?.subCategories) ||
        [];
    }

    return allSelectors;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-6 text-gray-800">Create category</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg  mx-auto">
        <div className="flex gap-9 mb-6">
          <label className="block  text- font-semibold">Category Type:</label>
          <div className="flex items-center font-bold space-x-6">
            {/* Parent Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isParent}
                onChange={(e) => {
                  setIsParent(e.target.checked);
                  setIsChild(false); // Uncheck Child if Parent is checked
                }}
                className="form-checkbox appearance-none h-5 w-5 border-2 border-bl rounded-md checked:bg-mo checked:border-mo  focus:outline-none "
              />
              <span className="ml-2 text-gray-700">Parent</span>
            </div>

            {/* Child Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isChild}
                onChange={(e) => {
                  setIsChild(e.target.checked);
                  setIsParent(false); // Uncheck Parent if Child is checked
                }}
                className="form-checkbox appearance-none h-5 w-5 border-2 border-bl rounded-md checked:bg-mo checked:border-mo focus:outline-none   "
              />
              <span className="ml-2 text-gray-700">Child</span>
            </div>
          </div>
        </div>

        {(isParent || isChild) && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ring-1 ring-bl"
            />
          </div>
        )}

        {isChild && <div className="mb-6">{renderSelectors()}</div>}

        {(isParent || isChild) && (
          <button
            onClick={handleCreateCategory}
            disabled={isLoading}
            className="w-full bg-bl text-white px-6 py-3 rounded-lg hover:bg-bl/80 transition duration-300 flex items-center justify-center"
          >
            {isLoading ? "Creating..." : "Create Category"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCreate;
