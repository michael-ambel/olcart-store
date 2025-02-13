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
  const [isTouching, setIsTouching] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const [popUp, setPopUp] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollSpeed = 1;
  const wheelSpeed = 0.8;
  const itemWidth = 200;
  const resetThreshold = itemWidth * products.length;
  const animationFrameRef = useRef<number | null>(null);
  const touchStartX = useRef<number>(0);
  const lastXOffset = useRef<number>(0);

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

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      setIsTouching(true);
      if (e.touches[0]) {
        touchStartX.current = e.touches[0].clientX;
      }
      lastXOffset.current = xOffset;
    },
    [xOffset]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isTouching) return;
      if (e.touches[0]) {
        const deltaX = e.touches[0].clientX - touchStartX.current;
        setXOffset(lastXOffset.current + deltaX);
      }
    },
    [isTouching]
  );

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

  const scrollAutomatically = useCallback(() => {
    if (!isHovered && !isTouching) {
      setXOffset((prev) => prev - scrollSpeed);
      animationFrameRef.current = requestAnimationFrame(scrollAutomatically);
    }
  }, [isHovered, isTouching, scrollSpeed]);

  useEffect(() => {
    if (!isHovered && !isTouching) {
      animationFrameRef.current = requestAnimationFrame(scrollAutomatically);
    }
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, isTouching, scrollAutomatically]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    if (xOffset <= -resetThreshold * 2) {
      setXOffset((prev) => prev + resetThreshold);
    } else if (xOffset >= -resetThreshold) {
      setXOffset((prev) => prev - resetThreshold);
    }
  }, [xOffset, resetThreshold]);

  return (
    <div className="relative flex flex-col justify-between w-full h-[300px] overflow-x-clip px-[0] my-[60px]">
      <h2 className="text-[24px] ml-[40px] font-bold">Top-Selling Items</h2>
      <div
        ref={containerRef}
        className="flex w-full justify-between "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {popUp && (
          <div className="absolute z-40 top-0 right-[40px] py-[10px] px-[20px] text-bg bg-mg w-auto h-auto rounded-full">
            Use scroll
          </div>
        )}
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
          <motion.div
            className="flex"
            style={{ transform: `translateX(${xOffset}px)` }}
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
