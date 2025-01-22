"use client";

import { FC, useState, useEffect } from "react";
import Card from "./Card";
import { useGetUserFeedQuery } from "@/store/apiSlices/productApiSlice";
import CardSkeleton from "./CardSkeleton";

const YourFeed: FC = () => {
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(15); // Items per page
  const [isNextLoading, setIsNextLoading] = useState(false); // Loading state for next button
  const [isPreviousLoading, setIsPreviousLoading] = useState(false); // Loading state for previous button

  const { data, isLoading, error } = useGetUserFeedQuery({ page, limit });

  // Handle "Next" button click
  const handleNextPage = () => {
    if (
      data?.pagination?.page &&
      data?.pagination?.page < (data?.pagination?.totalPages || 0)
    ) {
      setIsNextLoading(true); // Set loading state for next button
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle "Previous" button click
  const handlePreviousPage = () => {
    if (data?.pagination?.page && data?.pagination?.page > 1) {
      setIsPreviousLoading(true); // Set loading state for previous button
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Use useEffect to reset the loading states when data is fetched
  useEffect(() => {
    if (!isLoading && data) {
      setIsNextLoading(false); // Reset next button loading state
      setIsPreviousLoading(false); // Reset previous button loading state
    }
  }, [isLoading, data]); // Depend on isLoading and data

  return (
    <div className="flex w-full my-[40px] min-h-[400px]">
      <div className="flex flex-col min-h-vh w-full mx-[40px] px-[20px] pt-[20px] bg-bgt rounded-[20px]">
        <h2 className="text-[24px] font-bold">Your Feed...</h2>
        <div className="grid grid-cols-5 items-center justify-center gap-[36px] w-full my-[30px]">
          {isLoading ? (
            Array.from({ length: 15 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : error ? (
            <div>Error loading products.</div>
          ) : (
            data && (
              <>
                {data.products.map((product) => (
                  <Card key={product._id} product={product} />
                ))}
              </>
            )
          )}
        </div>

        <div className="flex justify-between items-center pb-[60px] pt-[30px] px-[10px]">
          <button
            onClick={handlePreviousPage}
            disabled={
              isLoading ||
              isPreviousLoading ||
              !(data?.pagination?.page && data?.pagination?.page > 1)
            }
            className={`w-[100px] py-1 rounded-[2px] ${
              isLoading ||
              isPreviousLoading ||
              !(data?.pagination?.page && data?.pagination?.page > 1)
                ? "bg-fade  text-white "
                : "bg-mo text-white"
            }`}
          >
            {isPreviousLoading || isLoading ? (
              <span className="animate-spin">Loading...</span> // Spinner animation for previous button
            ) : (
              "Previous"
            )}
          </button>
          <span>
            Page {data?.pagination?.page || 0} of{" "}
            {data?.pagination?.totalPages || 0}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              isLoading ||
              isNextLoading ||
              !(
                data?.pagination?.page &&
                data?.pagination?.totalPages &&
                data.pagination.page < data.pagination.totalPages
              )
            }
            className={`w-[100px] py-1 rounded-[2px] ${
              isLoading ||
              isNextLoading ||
              !(
                data?.pagination?.page &&
                data?.pagination?.totalPages &&
                data.pagination.page < data.pagination.totalPages
              )
                ? "bg-mo  text-white"
                : "bg-mo text-white"
            }`}
          >
            {isNextLoading || isLoading ? (
              <span className="animate-spin">Loading...</span> // Spinner animation for next button
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
