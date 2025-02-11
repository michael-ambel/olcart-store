// app/admin/products/category/page.tsx
"use client";

import React, { useState } from "react";

interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

const CategoryCreate = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(null);

  const addCategory = (parentId: string | null) => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCategoryName,
      subCategories: [],
    };

    if (parentId) {
      const addToParent = (categories: Category[]): Category[] => {
        return categories.map((cat) =>
          cat.id === parentId
            ? {
                ...cat,
                subCategories: [...(cat.subCategories || []), newCategory],
              }
            : { ...cat, subCategories: addToParent(cat.subCategories || []) },
        );
      };
      setCategories(addToParent(categories));
    } else {
      setCategories([...categories, newCategory]);
    }

    setNewCategoryName("");
    setParentCategoryId(null);
  };

  const renderCategories = (categories: Category[], level = 0) => {
    return (
      <ul className={`pl-${level * 4}`}>
        {categories.map((cat) => (
          <li key={cat.id} className="mb-2">
            <div className="flex items-center gap-2">
              <span>{cat.name}</span>
              <button
                onClick={() => setParentCategoryId(cat.id)}
                className="text-blue-600 hover:text-blue-900"
              >
                Add Child
              </button>
            </div>
            {cat.subCategories &&
              renderCategories(cat.subCategories, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={() => addCategory(parentCategoryId)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {parentCategoryId ? "Add Child Category" : "Add Parent Category"}
        </button>
        <div className="mt-6">{renderCategories(categories)}</div>
      </div>
    </div>
  );
};

export default CategoryCreate;
