"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetProductQuery,
  useUpdateCartedItemMutation,
} from "@/store/apiSlices/productApiSlice";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updateCart } from "@/store/slices/userSlice";
import { showToast } from "../ToastNotifications";
import { CartResp } from "@/store/types/userTypes";
import { useUpdateCartMutation } from "@/store/apiSlices/userApiSlice";

import TabsSection from "./ProductDetailTab";

const ProductDetailPage = () => {
  const { id } = useParams() as { id: string };
  const { data: product, isLoading, isError, error } = useGetProductQuery(id);
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [buttonAnimation, setButtonAnimation] = useState(false);

  const [updateCartMutation] = useUpdateCartMutation();
  const [updateCartedItem] = useUpdateCartedItemMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg font-medium text-mg">
        Loading product details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg font-medium text-red-500">
        Error loading product: {(error as Error).message}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-bl">
        No product found
      </div>
    );
  }

  // Rating functionality
  const ratingStars = (rating: number) => {
    const tstar: number[] = [1, 2, 3, 4, 5];
    return (
      <div className="flex justify-between w-[100px]">
        {tstar.map((ts, i) => {
          const src: string =
            rating >= ts
              ? "/icons/fstar.svg"
              : ts - 1 < rating && rating < ts
              ? "/icons/hstar.svg"
              : "/icons/zstar.svg";
          return (
            <div key={i} className="w-[15px]">
              <Image
                src={src}
                alt=""
                width={500}
                height={500}
                className="w-[15px]"
              />
            </div>
          );
        })}
      </div>
    );
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  // Calculate item price, shipping price, discount, and total
  const itemPrice = product.price * quantity;
  const shippingPrice = product.shippingPrice === 0 ? 0 : product.shippingPrice;
  const discount = product.discountPrice || 0; // Assuming `discount` exists on the product
  const total = itemPrice + shippingPrice - discount;

  const addToCartHandler = async () => {
    try {
      setButtonAnimation(true);
      const updatedCart: CartResp = await updateCartMutation({
        _id: product._id,
        quantity,
      }).unwrap();

      dispatch(updateCart(updatedCart.cart));

      await updateCartedItem({
        _id: product._id,
        quantity,
      });

      showToast("success", `${updatedCart.message}`);
    } catch (error) {
      if (error) {
        showToast("error", "Failed to Cart!");
      }
    } finally {
      setButtonAnimation(false); // Stop animation after the process completes
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between w-full gap-[40px]">
        <div className="flex  items-start justify-between gap-6">
          <div className="relative flex items-start w-[340px] h-[340px] bg-white shadow-lg rounded-[12px] hover:shadow-2xl transition-shadow duration-300">
            <Image
              src={
                typeof product.images[0] === "string" ? product.images[0] : ""
              }
              alt={product.name}
              layout="fill"
              objectFit="contain"
              className="rounded-[12px] "
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 h-[340px] justify-between ">
          <h1 className="text-[26px] font-bold">{product.name}</h1>
          <p>{product.description}</p>
          <div className="flex   items-start justify-between">
            <div className="flex items-center gap-2">
              <div>{ratingStars(product.averageRating || 0)}</div>
              <span className="font-medium">
                {product.averageRating ? product.averageRating.toFixed(1) : ""}
              </span>
            </div>
            <p className="">{product.salesCount} sold</p>
            <p className="text-[18] font-semibold">In Stock: {product.stock}</p>
          </div>
        </div>

        <div className="flex flex-col h-[340px] justify-between w-[240px]">
          <div className="">
            <p className="text-[24px] font-bold">${product.price.toFixed(2)}</p>
            <div className="flex text-[18px] justify-between">
              <p className="">Shipping:</p>
              <span>
                {shippingPrice === 0 ? "Free" : shippingPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between font-semibold">
            <button
              onClick={handleDecrease}
              className="px-4 py-2 bg-fade rounded-md disabled:opacity-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              className="py-[10px]  text-center border border-fade rounded-md"
              min="1"
              max={product.stock}
            />
            <button
              onClick={handleIncrease}
              className="px-4 py-2 bg-fade rounded-md disabled:opacity-50"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>

          <div className=" text-[17px]">
            <div className="flex  justify-between">
              <p className="">Item Price:</p>
              <span className="font-semibold">${itemPrice.toFixed(2)}</span>
            </div>
            <div className="flex  justify-between">
              <p className=" ">Shipping: </p>
              <span className="font-semibold">
                ${shippingPrice === 0 ? "Free" : shippingPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex  justify-between">
              <p className=" ">Discount: </p>
              <span className="font-semibold">${discount.toFixed(2)}</span>
            </div>
            <div className="flex  mt-4 justify-between">
              <p className=" font-bold ">Total:</p>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={addToCartHandler}
            disabled={buttonAnimation}
            className="w-full  py-2 bg-mo text-bg rounded-[2px] outline-none"
          >
            {buttonAnimation ? <span> Adding</span> : <span>Add to Cart</span>}
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <TabsSection product={product} />
    </div>
  );
};

export default ProductDetailPage;
