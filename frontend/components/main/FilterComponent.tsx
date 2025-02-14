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
  const [showMobileFilters, setShowMobileFilters] = useState(false); // Mobile filter state

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
          className="w-full md:w-auto border rounded p-2 mb-2"
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
    <>
      {/* Mobile Filter Button */}
      <button
        className="fixed md:hidden bottom-4 right-4 z-40 px-6 py-3 bg-mo text-white rounded-full shadow-lg"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        {showMobileFilters ? "Close Filters" : "Show Filters"}
      </button>

      {/* Filter Content */}
      <div
        className={`fixed  top-[110px] z-50 left-0 md:top-[140px] md:left-[20px] h-screen md:h-[75%]  md:w-[260px] p-4 md:py-[24px] md:px-[14px] bg-white md:bg-gray-100  md:rounded-[12px] overflow-y-auto transition-transform duration-300 ${
          showMobileFilters
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="md:fixed flex flex-col gap-1">
          {/* Category Selectors */}
          <div className="md:mb-4">
            <label className="block text-sm font-medium">Category</label>
            {isCategoriesLoading ? <p>Loading...</p> : renderSelectors()}
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="priceMin"
                value={localFilters.priceMin}
                onChange={handleInputChange}
                placeholder="Min"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                name="priceMax"
                value={localFilters.priceMax}
                onChange={handleInputChange}
                placeholder="Max"
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                onClick={handlePriceRangeConfirm}
                className="px-3 py-2 bg-mo text-white rounded-md"
              >
                OK
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Tags</label>
            <input
              type="text"
              name="tags"
              value={localFilters.tags?.join(", ")}
              onChange={handleInputChange}
              placeholder="Comma-separated tags"
              className="w-full px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleTagsSubmit}
              className="mt-2 px-4 py-2 bg-mo text-white rounded-md"
            >
              Submit
            </button>
          </div>

          {/* Sort By */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Sort By</label>
            <select
              name="sort"
              value={localFilters.sort}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Results Limit */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Results Limit</label>
            <div className="flex gap-2">
              {[10, 20, 35, 50].map((limit) => (
                <button
                  key={limit}
                  onClick={() => handleLimitChange(limit)}
                  className={`px-3 py-1 rounded-md ${
                    localFilters.limit === limit
                      ? "bg-mo text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {limit}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            className="md:hidden mt-4 px-6 py-2 bg-mo text-white rounded-md"
            onClick={() => setShowMobileFilters(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterComponent;
