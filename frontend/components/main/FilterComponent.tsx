"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/slices/productSlice";
import { Filters } from "@/store/types/productTypes";
import { RootState } from "@/store/store";
import { useGetCategoriesQuery } from "@/store/apiSlices/categoryApiSlice";

interface CategoryTree {
  _id: string;
  name: string;
  subCategories?: CategoryTree[];
}

const FilterComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.product);

  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [categoriesData, setCategoriesData] = useState<CategoryTree[]>([]);
  const [selectedPath, setSelectedPath] = useState<CategoryTree[]>([]);

  const { data, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  useEffect(() => {
    if (data) {
      setCategoriesData(data);
    }
  }, [data]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "priceMin" || name === "priceMax" || name === "tags") {
      setLocalFilters((prevFilters) => ({
        ...prevFilters,
        [name]:
          name === "tags" ? value.split(", ").map((tag) => tag.trim()) : value,
      }));
    } else {
      const updatedFilters = { ...localFilters, [name]: value, page: 1 };
      setLocalFilters(updatedFilters);
      dispatch(setFilters(updatedFilters));
    }
  };

  const handlePriceRangeConfirm = () => {
    dispatch(setFilters(localFilters));
  };

  const handleTagsSubmit = () => {
    dispatch(setFilters(localFilters));
  };

  const handleLimitChange = (limit: number) => {
    const updatedFilters = { ...localFilters, limit, page: 1 };
    setLocalFilters(updatedFilters);
    dispatch(setFilters(updatedFilters));
  };

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
      const updatedFilters = {
        ...localFilters,
        category: categoryIdString,
        page: 1,
      };
      setLocalFilters(updatedFilters);
      dispatch(setFilters(updatedFilters));
    } else {
      setSelectedPath(updatedPath);

      const updatedFilters = { ...localFilters, category: "", page: 1 };
      setLocalFilters(updatedFilters);
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
      <div className="mb-4">
        <label className="block text-sm font-medium">Price Range</label>
        <div className="flex space-x-1">
          <input
            type="number"
            name="priceMin"
            value={localFilters.priceMin}
            onChange={handleInputChange}
            placeholder="Min"
            className="mt-1 block w-full px-3 py-[8px] border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="priceMax"
            value={localFilters.priceMax}
            onChange={handleInputChange}
            placeholder="Max"
            className="mt-1 block w-full px-3 py-[8px] border border-gray-300 rounded-md"
          />
          <button
            onClick={handlePriceRangeConfirm}
            className="mt-2 px-2 py-1 bg-fade text-white rounded-md"
          >
            OK
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Tags</label>
        <input
          type="text"
          name="tags"
          value={localFilters.tags?.join(", ")}
          onChange={handleInputChange}
          placeholder="Comma-separated tags"
          className="mt-1 block w-full px-3 py-[8px] border border-gray-300 rounded-md"
        />
        <button
          onClick={handleTagsSubmit}
          className="mt-2 px-4 py-[7px] bg-fade text-white rounded-md"
        >
          Submit
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Sort By</label>
        <select
          name="sort"
          value={localFilters.sort}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-[8px] border border-gray-300 rounded-md"
        >
          <option value="">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Results Limit</label>
        <div className="flex space-x-2">
          {[10, 20, 35, 50].map((limit) => (
            <button
              key={limit}
              onClick={() => handleLimitChange(limit)}
              className={`px-3 py-1 rounded-md ${
                localFilters.limit === limit
                  ? "bg-fade text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {limit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
