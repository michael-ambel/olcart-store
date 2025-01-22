"use client";

import { FC } from "react";

const CardSkeleton: FC = () => {
  return (
    <div className="flex flex-col w-[190px] h-auto text-[12px]">
      <div className="relative flex items-center justify-center w-[190px] h-[190px] bg-fades animate-pulse rounded-[12px]">
        <div className="relative flex items-center justify-center w-[190px] h-[190px] bg-fades animate-pulse rounded-[12px]"></div>
      </div>

      {/* Skeleton for Product Name */}
      <div className="my-[6px] bg-gray-300 animate-pulse w-[80%] h-[14px] rounded-[4px]"></div>

      {/* Skeleton for Rating and Sales Count */}
      <div className="flex justify-between">
        <div className="flex justify-between w-[100px]">
          {/* 5 Stars Skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-[15px] bg-gray-300 animate-pulse h-[15px]"
            ></div>
          ))}
        </div>

        {/* Skeleton for Sales Count */}
        <div className="w-[40px] bg-gray-300 animate-pulse h-[14px] rounded-[4px]"></div>
      </div>

      {/* Skeleton for Price and Shipping */}
      <div className="flex justify-between my-[4px]">
        {/* Skeleton for Price */}
        <div className="w-[80px] bg-gray-300 animate-pulse h-[14px] rounded-[4px]"></div>

        {/* Skeleton for Shipping */}
        <div className="w-[100px] bg-gray-300 animate-pulse h-[14px] rounded-[4px]"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
