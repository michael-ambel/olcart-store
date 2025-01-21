"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/slices/productSlice";
import { RootState } from "@/store/store";
import { useGetCategoriesQuery } from "@/store/apiSlices/categoryApiSlice";

interface CategoryTree {
  _id: string;
  name: string;
  subCategories?: CategoryTree[];
}

const CategroSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.product);

  const [categoriesData, setCategoriesData] = useState<CategoryTree[]>([]);
  const [selectedPath, setSelectedPath] = useState<CategoryTree[]>([]);

  const { data, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  useEffect(() => {
    if (data) {
      setCategoriesData(data);
      console.log(data);
    }
  }, [data]);

  const handleSelectionChange = (level: number, id: string) => {
    const updatedPath = selectedPath.slice(0, level);
    const category = findCategoryById(
      level === 0 ? categoriesData : selectedPath[level - 1]?.subCategories,
      id
    );

    if (category) {
      const newPath = [...updatedPath, category];
      setSelectedPath(newPath);

      const categoryIdString = newPath.map((cat) => cat._id).join(",");
      const updatedFilters = { ...filters, category: categoryIdString };
      dispatch(setFilters(updatedFilters));
    } else {
      setSelectedPath(updatedPath);

      const updatedFilters = { ...filters, category: "" };
      dispatch(setFilters(updatedFilters));
    }
  };

  const findCategoryById = (
    categories: CategoryTree[] | undefined,
    id: string
  ): CategoryTree | undefined => {
    if (!categories) return undefined;
    for (const category of categories) {
      if (category._id === id) return category;
      if (category.subCategories) {
        const found = findCategoryById(category.subCategories, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const renderSelectors = () => {
    const allSelectors = [];

    for (let level = 0; level <= selectedPath.length; level++) {
      const categories =
        level === 0
          ? categoriesData
          : selectedPath[level - 1]?.subCategories || [];

      if (!categories || categories.length === 0) break;

      allSelectors.push(
        <select
          key={level}
          value={selectedPath[level]?._id || ""}
          onChange={(e) => handleSelectionChange(level, e.target.value)}
          className="w-auto border rounded p-2 mb-2"
        >
          <option value="">Select</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      );
    }

    return allSelectors;
  };

  return (
    <div className="fixed top-[170px] left-[20px] py-[24px] px-[14px] bg-gray-100 w-[260px] rounded-[12px]">
      <div className="fixed flex gap-[8px] items-center top-[112px] mb-4">
        <label className="block text-sm font-medium">Category</label>
        {isCategoriesLoading ? <p>Loading categories...</p> : renderSelectors()}
      </div>
    </div>
  );
};

export default CategroSelector;
