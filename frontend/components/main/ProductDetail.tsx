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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ProductDetailPage = () => {
  const { id } = useParams() as { id: string };
  const { data: product, isLoading, isError, error } = useGetProductQuery(id);
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [buttonAnimation, setButtonAnimation] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

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
    } catch {
      if (!user) {
        showToast("error", "Please login to add to cart!");
      } else {
        showToast("error", "Failed to Cart!");
      }
    } finally {
      setButtonAnimation(false); // Stop animation after the process completes
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Product Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-[40%] xl:w-[35%]">
          <div className="relative aspect-square bg-white shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
            <Image
              src={
                typeof product.images[0] === "string" ? product.images[0] : ""
              }
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 35vw"
              className="rounded-2xl object-contain p-4"
              priority
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 flex flex-col justify-between space-y-6 ">
          <h1 className="text-3xl md:text-4xl font-bold ">{product.name}</h1>
          <p className="text-bl/90 text-lg">{product.description}</p>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-base">
            <div className="flex items-center gap-2">
              {ratingStars(product.averageRating || 0)}
              <span className="font-medium ">
                {product.averageRating?.toFixed(1) || ""}
              </span>
            </div>
            <p className="text-bl/80">{product.salesCount} sold</p>
            <p className="font-semibold text-mg">In Stock: {product.stock}</p>
          </div>
        </div>

        {/* Price & Cart Section */}
        <div className="w-full lg:w-[320px] xl:w-[280px] space-y-6">
          <div className="bg-bl/5 p-6 rounded-2xl space-y-4 md:space-y-8 border border-bl/10">
            <p className="text-3xl font-bold text-bl">
              ${product.price.toFixed(2)}
            </p>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <button
                  onClick={handleDecrease}
                  className="px-4 py-2 bg-bl/5 text-bl rounded-xl hover:bg-bl/10 disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  className="w-16 py-2 text-center border border-bl/20 rounded-xl bg-white"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={handleIncrease}
                  className="px-4 py-2 bg-bl/5 text-bl rounded-xl hover:bg-bl/10 disabled:opacity-40"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3 text-bl/90">
              <div className="flex justify-between">
                <span>Item Price:</span>
                <span className="font-medium">${itemPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">
                  {shippingPrice === 0
                    ? "Free"
                    : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-medium text-mg">
                  -${discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-2xl pt-3 border-t border-bl/10">
                <span className="font-bold text-bl">Total:</span>
                <span className="font-bold text-bl">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={addToCartHandler}
              disabled={buttonAnimation}
              className="w-full py-4 bg-mo text-white rounded-xl hover:bg-mo/90 transition-all font-bold disabled:opacity-80"
            >
              {buttonAnimation ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <TabsSection product={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
