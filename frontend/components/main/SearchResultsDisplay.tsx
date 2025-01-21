"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchProductsQuery } from "@/store/apiSlices/productApiSlice";
import Card from "./Card";
import { RootState } from "@/store/store";
import { setFilters } from "@/store/slices/productSlice";

const SearchResultsDisplay: React.FC = () => {
  const { searchQuery, filters } = useSelector(
    (state: RootState) => state.product
  );
  const dispatch = useDispatch();

  const { category, priceMin, priceMax, tags, sort, limit, page = 1 } = filters;

  const { data, error, isLoading } = useSearchProductsQuery({
    query: searchQuery,
    category,
    priceMin,
    priceMax,
    tags,
    sort,
    page,
    limit,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (data?.pagination.totalPages || 1)) return;

    dispatch(setFilters({ ...filters, page: newPage }));
  };

  if (isLoading) {
    return <div className="text-center py-4 text-red-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error.toString()}
      </div>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="flex w-full h-[400px] items-center justify-center text-center text-[22px] text-mg font-bald">
        No products found.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 items-start justify-center w-full sm:grid-cols-2 lg:grid-cols-4 gap-[40px] p-[40px]">
        {data.products.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 py-6">
        <button
          className={`px-4 py-2 rounded-md ${
            page > 1
              ? "bg-fades"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="font-semibold">
          Page {page} of {data.pagination.totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded-md ${
            page < data.pagination.totalPages
              ? "bg-fades"
              : "bg-gray-100 text-fade cursor-not-allowed"
          }`}
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= data.pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchResultsDisplay;
