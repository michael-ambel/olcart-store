"use client";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Product 1", image: "/products/earbud.png", price: "$10" },
  { id: 2, name: "Product 2", image: "/products/usb.png", price: "$20" },
  { id: 3, name: "Product 3", image: "/products/minifan.png", price: "$30" },
  { id: 4, name: "Product 4", image: "/products/shoe.png", price: "$40" },
  { id: 5, name: "Product 5", image: "/products/mouse.png", price: "$50" },
  { id: 6, name: "Product 6", image: "/products/usb.png", price: "$60" },
  { id: 7, name: "Product 7", image: "/products/shoe.png", price: "$70" },
  { id: 8, name: "Product 8", image: "/products/minifan.png", price: "$80" },
  { id: 9, name: "Product 9", image: "/products/mouse.png", price: "$90" },
  { id: 10, name: "Product 10", image: "/products/jbl.png", price: "$100" },
];

const PopularProduct: FC = () => {
  const productList = [...products, ...products, ...products];
  const [isHoverd, setIsHovered] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const [popUp, setPopUp] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollSpeed = 1;
  const wheelSpeed = 0.8;
  const itemWidth = 200;
  const resetThreshold = itemWidth * products.length;

  const handleMouseEnter = () => {
    setIsHovered(true);
    setPopUp(true);
    setTimeout(() => setPopUp(false), 3000);

    if (containerRef.current) {
      containerRef.current.style.cursor = "ew-resize";
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = "default";
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (!isHoverd) return;

    e.preventDefault();
    const scrollAmount = e.deltaY * wheelSpeed;
    setXOffset((prev) => prev - scrollAmount);
  };

  useEffect(() => {
    if (!isHoverd) {
      const interval = setInterval(() => {
        setXOffset((prev) => prev - scrollSpeed);
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isHoverd]);

  useEffect(() => {
    const container = containerRef.current;
    if (isHoverd && container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isHoverd]);

  useEffect(() => {
    if (xOffset <= -resetThreshold * 2) {
      setXOffset((prev) => prev + resetThreshold);
    } else if (xOffset >= -resetThreshold) {
      setXOffset((prev) => prev - resetThreshold);
    }
  }, [xOffset, productList.length]);

  return (
    <div className="relative flex flex-col justify-between w-full h-[250px] px-[84px] my-[40px]">
      <h2 className="text-[24px] font-bold">Popular Products</h2>
      <div
        ref={containerRef}
        className="flex w-full justify-between overflow-x-hidden "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {popUp && (
          <div className="absolute z-50 top-20 left-0 p-[10px] text-bg bg-bl w-auto h-outo rounded-full">
            Use scroll
          </div>
        )}

        <motion.div
          className="flex "
          style={{ transform: `translateX(${xOffset}px)` }}
        >
          {productList.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-center p-[0px] w-[200px] h-[200px] rounded-full"
            >
              <div className="flex items-center justify-center  w-[160px] h-[160px] rounded-full bg-fades">
                <Image
                  src={p.image}
                  alt=""
                  width={500}
                  height={500}
                  className=" w-[140px] "
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PopularProduct;
