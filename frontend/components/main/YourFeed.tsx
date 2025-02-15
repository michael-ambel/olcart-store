"use client";

import { FC, useState, useEffect } from "react";
import Card from "./Card";
import { useGetUserFeedQuery } from "@/store/apiSlices/productApiSlice";
import { CardSkeleton } from "./CardSkeleton";

const YourFeed: FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isPreviousLoading, setIsPreviousLoading] = useState(false);

  const { data, isLoading, error } = useGetUserFeedQuery({ page, limit });

  const handleNextPage = () => {
    if (
      data?.pagination?.page &&
      data.pagination.page < (data.pagination.totalPages || 0)
    ) {
      setIsNextLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data?.pagination?.page && data.pagination.page > 1) {
      setIsPreviousLoading(true);
      setPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!isLoading && data) {
      setIsNextLoading(false);
      setIsPreviousLoading(false);
    }
  }, [isLoading, data]);

  return (
    <div className="w-full my-10 min-h-[400px] md:px-4">
      <div className="flex flex-col w-full mx-auto bg-white rounded-3xl shadow-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-[40px]">
          <h2 className="text-[24px] font-bold ">Personalized Feed</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-6 w-full mb-8">
          {isLoading ? (
            Array.from({ length: 15 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-gray-600 text-lg">Failed to load products</p>
              <p className="text-sm text-gray-400 mt-2">
                Please try again later
              </p>
            </div>
          ) : (
            data?.products.map((product) => (
              <Card key={product._id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-6 border-t border-gray-100">
          <button
            onClick={handlePreviousPage}
            disabled={
              isPreviousLoading ||
              isLoading ||
              !(data?.pagination?.page && data.pagination.page > 1)
            }
            className={`flex items-center px-6 py-2 rounded-full transition-all ${
              isPreviousLoading ||
              isLoading ||
              !(data?.pagination?.page && data.pagination.page > 1)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-mo/10 hover:bg-mo/20 text-mo"
            }`}
          >
            {isPreviousLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-mo border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Previous"
            )}
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-mo">
                {data?.pagination?.page || 0}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-mg">
                {data?.pagination?.totalPages || 0}
              </span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={
              isNextLoading ||
              isLoading ||
              !(
                data?.pagination?.page &&
                data.pagination.page < (data.pagination.totalPages || 0)
              )
            }
            className={`flex items-center px-6 py-2 rounded-full transition-all ${
              isNextLoading ||
              isLoading ||
              !(
                data?.pagination?.page &&
                data.pagination.page < (data.pagination.totalPages || 0)
              )
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-mg/10 hover:bg-mg/20 text-mg"
            }`}
          >
            {isNextLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-mg border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YourFeed;
