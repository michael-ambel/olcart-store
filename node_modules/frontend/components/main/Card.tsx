"use client";

import { useUpdateCartMutation } from "@/store/apiSlices/userApiSlice";
import { Product } from "@/store/types/productTypes";
import { useDispatch } from "react-redux";
import { updateCart } from "@/store/slices/userSlice";
import Image from "next/image";
import { FC } from "react";
import { ICartItem } from "@/store/types/userTypes";
import { useUpdateCartedItemMutation } from "@/store/apiSlices/productApiSlice";
import { showToast } from "../ToastNotifications";

interface CardProp {
  product: Product;
}

const Card: FC<CardProp> = ({ product }) => {
  const s = product.averageRating || 0;
  const tstar: number[] = [1, 2, 3, 4, 5];

  const dispatch = useDispatch();
  const [updateCartMutation, { isLoading, isError }] = useUpdateCartMutation();
  const [
    updateCartedItem,
    { isLoading: cartedIsLoading, isError: cartedIsError },
  ] = useUpdateCartedItemMutation();

  const addCartHandler = async () => {
    try {
      const updatedCart: ICartItem[] = await updateCartMutation({
        _id: product._id,
        quantity: 1,
      }).unwrap();
      console.log(updateCart);
      dispatch(updateCart(updatedCart));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      await updateCartedItem({
        _id: product._id,
        quantity: 1,
      });
      showToast("success", `${product.name} Successfully Carted !`);
    } catch (error) {
      console.error("Failed to update cart:", error);
      showToast("error", `${product.name} Not Carted!`);
    }
  };

  return (
    <div className="flex flex-col w-[190px] h-auto text-[12px]">
      <div className="relative flex items-center justify-center w-[190px] h-[190px]  bg-bg rounded-[12px]">
        <div className="relative flex items-center justify-center w-[190px] h-[190px] ">
          <Image
            src={
              product.images && product.images.length > 0
                ? `${product.images[0]}`
                : ""
            }
            alt={product.name || "Product"}
            layout="fill"
            objectFit="contain" // E
            className="rounded-[12px]"
          />
        </div>

        <button
          onClick={addCartHandler}
          disabled={isLoading}
          className="absolute bottom-[6px] right-[10px]"
        >
          <Image
            src="./icons/addcart.svg"
            alt=""
            width={500}
            height={500}
            className="  w-[30px] "
          />
        </button>
      </div>
      <p className="my-[6px]">{product.name || ""}</p>
      <div className="flex justify-between ">
        <div className="flex justify-between w-[100px]">
          {tstar.map((ts, i) => {
            const src: string =
              s >= ts
                ? "/icons/fstar.svg"
                : ts - 1 < s && s < ts
                ? "/icons/hstar.svg"
                : "/icons/zstar.svg";

            return (
              <div key={i} className="w-[15px]">
                <Image
                  src={src}
                  alt=""
                  width={500}
                  height={500}
                  className=" w-[15px] "
                />
              </div>
            );
          })}
        </div>

        <p>256 sold</p>
      </div>
      <div className="flex justify-between my-[4px]">
        <p className="text-[10px] font-semibold">
          US<span className="text-[16px] font-semibold">${product.price}</span>
        </p>
        <p className="text-mb">free shipping</p>
      </div>
    </div>
  );
};

export default Card;
