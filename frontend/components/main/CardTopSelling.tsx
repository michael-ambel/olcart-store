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
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

interface CardProp {
  product: Partial<Product>;
}

const CardTopSelling: FC<CardProp> = ({ product }) => {
  const dispatch = useDispatch();
  const [updateCartMutation] = useUpdateCartMutation();
  const [updateCartedItem] = useUpdateCartedItemMutation();
  const [buttonAnimation, setButtonAnimation] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

  const addCartHandler = async () => {
    try {
      setButtonAnimation(true);
      if (!user) {
        showToast("error", "Please login to add to cart!");
        return;
      }
      const updatedCart: CartResp = await updateCartMutation({
        _id: product._id,
        quantity: 1,
      }).unwrap();

      dispatch(updateCart(updatedCart.cart));
      await updateCartedItem({ _id: product._id, quantity: 1 });
      showToast("success", `${updatedCart.message}`);
    } catch {
      showToast("error", "Failed to Cart!");
    } finally {
      setButtonAnimation(false);
    }
  };

  return (
    <div className="group relative w-[200px] p-4 h-[240px]  rounded-2xl  transition-all duration-500 hover:-translate-y-2">
      {/* Product Image Container */}
      <div className="relative w-full h-[160px] bg-white rounded-xl overflow-hidden">
        <Link href={`/product/${product._id}`} className="block w-full h-full">
          <Image
            src={
              typeof product.images?.[0] === "string"
                ? product.images[0]
                : "/placeholder-product.jpg"
            }
            alt={product.name || "Product"}
            fill
            className="object-contain scale-90 group-hover:scale-100 transition-transform duration-500"
          />
        </Link>

        {/* Add to Cart Button */}
        <button
          onClick={addCartHandler}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
        >
          {buttonAnimation ? (
            <Loader2 className="w-6 h-6 m-1 sm:w-7 sm:h-7 animate-spin text-mo stroke-[3px]" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-mo m-1.5 hover:text-mg transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
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

      {/* Product Name with Gradient Text */}
      <div className="mt-3 text-center">
        <h3 className="font-bold text-gray-900 text-sm truncate bg-mg bg-clip-text text-transparent">
          {product.name || ""}
        </h3>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-[0px] bg-gradient-to-br from-mo/20 to-mg/20 rounded-2xl blur-md"></div>
      </div>
    </div>
  );
};

export default CardTopSelling;
