"use client";

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
    return (
      <div className="text-center text-[18px] py-[80px] text-red-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error: {"status" in error ? error.status : error.message}
      </div>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="flex w-full h-[400px] items-center justify-center text-center text-[22px] text-mg font-bold">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full md:pl-[270px]">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4 p-2 md:p-4">
        {data.products.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 py-6">
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            page > 1 ? "bg-mo text-white" : "bg-gray-200 cursor-not-allowed"
          }`}
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {page} of {data.pagination.totalPages}
        </span>

        <button
          className={`px-4 py-2 rounded-md text-sm ${
            page < data.pagination.totalPages
              ? "bg-mo text-white"
              : "bg-gray-200 cursor-not-allowed"
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
