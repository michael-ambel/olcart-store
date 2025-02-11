"use client";

import { useUpdateCartMutation } from "@/store/apiSlices/userApiSlice";
import { Product } from "@/store/types/productTypes";
import { useDispatch } from "react-redux";
import { updateCart } from "@/store/slices/userSlice";
import Image from "next/image";
import { FC, useState } from "react";
import { CartResp } from "@/store/types/userTypes";
import { useUpdateCartedItemMutation } from "@/store/apiSlices/productApiSlice";
import { showToast } from "../ToastNotifications";
import Link from "next/link";

interface CardProp {
  product: Product;
}

const Card: FC<CardProp> = ({ product }) => {
  const s = product.averageRating || 0;
  const tstar: number[] = [1, 2, 3, 4, 5];

  const dispatch = useDispatch();
  const [updateCartMutation, { isLoading }] = useUpdateCartMutation();
  const [updateCartedItem, { isLoading: cartedIsLoading }] =
    useUpdateCartedItemMutation();

  const [buttonAnimation, setButtonAnimation] = useState(false);

  const addCartHandler = async () => {
    try {
      setButtonAnimation(true);
      const updatedCart: CartResp = await updateCartMutation({
        _id: product._id,
        quantity: 1,
      }).unwrap();

      dispatch(updateCart(updatedCart.cart));

      await updateCartedItem({
        _id: product._id,
        quantity: 1,
      });

      showToast("success", `${updatedCart.message}`);
    } catch (error) {
      if (error) {
        showToast("error", "Failed to Cart!");
      }
    } finally {
      setButtonAnimation(false);
    }
  };

  return (
    <div className="flex flex-col w-[190px] h-auto text-[14px] group relative">
      {/* Image Container */}
      <div className="relative flex items-center justify-center w-[190px] h-[190px] bg-bg rounded-[12px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative flex items-center justify-center w-[190px] h-[190px] rounded-[12px] overflow-hidden">
          <Link href={`/product/${product._id}`} className="w-full h-full">
            <Image
              src={
                typeof product.images?.[0] === "string"
                  ? product.images[0]
                  : "/placeholder-product.jpg"
              }
              alt={product.name || "Product"}
              layout="fill"
              objectFit="contain"
              className="bg-bg rounded-[12px] transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Cart Button with Uniform Color Icon */}
        <button
          onClick={addCartHandler}
          disabled={isLoading || cartedIsLoading}
          className="absolute bottom-[6px] right-[10px] transition-all duration-300 
          hover:scale-110 active:scale-95 bg-white/90 backdrop-blur-sm rounded-full p-1.5"
        >
          {buttonAnimation ? (
            <div className="w-[30px] h-[30px] border-[6px] border-fade border-t-mo rounded-full animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-mo hover:text-mo/80 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Product Name */}
      <p className="my-[6px] text-mg font-semibold transition-colors">
        {product.name?.slice(0, 20)}
        {product.name && product.name.length > 20 && "..."}
      </p>

      {/* Rating Section */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {tstar.map((ts, i) => {
            const src =
              s >= ts
                ? "/icons/fstar.svg"
                : ts - 1 < s && s < ts
                  ? "/icons/hstar.svg"
                  : "/icons/zstar.svg";
            return (
              <div
                key={i}
                className="w-[15px] hover:scale-110 transition-transform duration-150"
              >
                <Image
                  src={src}
                  alt=""
                  width={15}
                  height={15}
                  className="w-full h-auto drop-shadow-sm"
                />
              </div>
            );
          })}
        </div>
        <p className="text-sm hover:scale-[1.02] transition-transform">
          {product.salesCount} sold
        </p>
      </div>

      {/* Price Section with Unified Delivery Icons */}
      <div className="flex justify-between my-[4px] items-baseline">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] font-semibold">US</span>
          <span className="text-[16px] font-semibold hover:scale-[1.02] transition-transform">
            ${product.price}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm hover:translate-x-1 transition-transform">
          {product.shippingPrice === 0 ? (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-bl"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 7h-1V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1.05a2.5 2.5 0 1 0 4.9 0h4.1a2.5 2.5 0 1 0 4.9 0H20a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM7 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm10 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2-11H5V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1z" />
                <path d="M7 10h2v2H7zm0-3h2v2H7zm5 3h2v2h-2zm0-3h2v2h-2zm5 3h2v2h-2zm0-3h2v2h-2z" />
              </svg>
              <span className="text-mg font-medium">Free</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-bl"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 7h-1V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1.05a2.5 2.5 0 1 0 4.9 0h4.1a2.5 2.5 0 1 0 4.9 0H20a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM7 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm10 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2-11H5V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1z" />
                <path
                  fill="rgba(0,0,0,0.5)"
                  d="M12 12h2v2h-2zM16 12h2v2h-2zM8 12h2v2H8z"
                />
              </svg>
              <span className="text-mo font-medium">
                ${product.shippingPrice}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
