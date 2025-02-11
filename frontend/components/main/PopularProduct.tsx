"use client";
import { FC, useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useGetTopSellingAndRatedProductsQuery } from "@/store/apiSlices/productApiSlice";
import CardTopSelling from "./CardTopSelling";

const PopularProduct: FC = () => {
  const { data, isLoading } = useGetTopSellingAndRatedProductsQuery();
  const products = data || [];

  const productList = [...products, ...products, ...products];
  const [isHovered, setIsHovered] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const [popUp, setPopUp] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollSpeed = 1;
  const wheelSpeed = 0.8;
  const itemWidth = 200;
  const resetThreshold = itemWidth * products.length;

  const animationFrameRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setPopUp(true);
    setTimeout(() => setPopUp(false), 4000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isHovered) return;

      e.preventDefault();
      const scrollAmount = e.deltaY * wheelSpeed;
      setXOffset((prev) => prev - scrollAmount);
    },
    [isHovered, wheelSpeed]
  );

  const scrollAutomatically = useCallback(() => {
    if (!isHovered) {
      setXOffset((prev) => prev - scrollSpeed);
      animationFrameRef.current = requestAnimationFrame(scrollAutomatically);
    }
  }, [isHovered, scrollSpeed]);

  // Start automatic scroll when not hovered
  useEffect(() => {
    if (!isHovered) {
      animationFrameRef.current = requestAnimationFrame(scrollAutomatically);
    }
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, scrollAutomatically]);

  // Adding mouse wheel listener when hovered
  useEffect(() => {
    const container = containerRef.current;
    if (isHovered && container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isHovered, handleWheel]);

  // Reset the scroll position when reaching the end or beginning
  useEffect(() => {
    if (xOffset <= -resetThreshold * 2) {
      setXOffset((prev) => prev + resetThreshold);
    } else if (xOffset >= -resetThreshold) {
      setXOffset((prev) => prev - resetThreshold);
    }
  }, [xOffset, resetThreshold]);

  return (
    <div className="relative flex flex-col justify-between w-full h-[300px] px-[0] my-[100px]">
      <h2 className="text-[24px] ml-[40px] font-bold">Top-Selling Items</h2>
      <div
        ref={containerRef}
        className="flex w-full justify-between "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Popup message for user instruction */}
        {popUp && (
          <div className="absolute z-40 top-0 right-[40px] py-[10px] px-[20px] text-bg bg-mg w-auto h-auto rounded-full">
            Use scroll
          </div>
        )}

        {/* Suspense Placeholders */}
        {isLoading ? (
          <div className="flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-[12px] w-[210px] p-[20px] h-auto text-[14px] text-mg font-semibold"
              >
                <div className="relative flex items-center justify-center w-[150px] h-[150px] bg-bgs rounded-[12px] animate-pulse"></div>
                <p className="my-[6px] h-[20px] bg-bgs w-3/4 rounded-md animate-pulse"></p>
              </div>
            ))}
          </div>
        ) : (
          // Scrollable product list
          <motion.div
            className="flex"
            style={{
              transform: `translateX(${xOffset}px)`,
            }}
          >
            {productList.map((p, i) => (
              <CardTopSelling key={i} product={p} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PopularProduct;
