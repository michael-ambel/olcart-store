"use client";

import { useUpdateCartMutation } from "@/store/apiSlices/userApiSlice";
import { Product } from "@/store/types/productTypes";
import { useDispatch } from "react-redux";
import { updateCart } from "@/store/slices/userSlice";
import Image from "next/image";
import { FC, useState } from "react";
import { CartResp, ICartItem } from "@/store/types/userTypes";
import { useUpdateCartedItemMutation } from "@/store/apiSlices/productApiSlice";
import { showToast } from "../ToastNotifications";
import Link from "next/link";

interface CardProp {
  product: Partial<Product>;
}

const CardTopSelling: FC<CardProp> = ({ product }) => {
  const s = product.averageRating || 0;
  const tstar: number[] = [1, 2, 3, 4, 5];

  const dispatch = useDispatch();
  const [updateCartMutation, { isLoading }] = useUpdateCartMutation();
  const [updateCartedItem, { isLoading: cartedIsLoading }] =
    useUpdateCartedItemMutation();

  const [buttonAnimation, setButtonAnimation] = useState(false); // State for button animation

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
      showToast("error", "Failed to Cart!");
    } finally {
      setButtonAnimation(false); // Stop animation after the process completes
    }
  };

  return (
    <div className="flex flex-col group w-[210px] p-[20px] h-auto text-[14px] text-mg font-semibold">
      <div className="relative flex items-center justify-center w-[170px] h-[170px] bg-bgt rounded-[12px]">
        <div className="relative flex items-center justify-center w-[170px] h-[170px] hover:cursor-pointer">
          <Link href={`/product/${product._id}`}>
            <Image
              src={
                product.images && product.images.length > 0
                  ? `${product.images[0]}`
                  : ""
              }
              alt={product.name || "Product"}
              layout="fill"
              objectFit="contain"
              className=""
            />
          </Link>
        </div>

        <button
          onClick={addCartHandler}
          disabled={isLoading || cartedIsLoading} // Disable button during loading
          className="absolute bottom-[6px] right-[10px] transition-transform duration-400 "
        >
          {buttonAnimation ? (
            <div className="w-[30px] h-[30px] border-[6px] border-fade border-t-mo rounded-full animate-spin"></div>
          ) : (
            <Image
              src="./icons/addcart.svg"
              alt="Add to Cart"
              width={30}
              height={30}
              className="w-[30px] hidden group-hover:block"
            />
          )}
        </button>
      </div>

      <p className="my-[6px]">
        {product.name && product.name.length > 20
          ? `${product.name.slice(0, 16)}...`
          : product.name || ""}
      </p>
    </div>
  );
};

export default CardTopSelling;
