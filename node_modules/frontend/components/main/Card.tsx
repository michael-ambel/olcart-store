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

  const [buttonAnimation, setButtonAnimation] = useState(false); // State for button animation

  const addCartHandler = async () => {
    try {
      setButtonAnimation(true);
      const updatedCart: CartResp = await updateCartMutation({
        _id: product._id,
        quantity: 1,
      }).unwrap();

      console.log(updatedCart);
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
    <div className="flex flex-col w-[190px] h-auto text-[12px]">
      <div className="relative flex items-center justify-center w-[190px] h-[190px] bg-bg rounded-[12px]">
        <div className="relative flex items-center justify-center w-[190px] h-[190px]">
          <Image
            src={
              product.images && product.images.length > 0
                ? `${product.images[0]}`
                : ""
            }
            alt={product.name || "Product"}
            layout="fill"
            objectFit="contain"
            className="rounded-[12px]"
          />
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
              className="w-[30px]"
            />
          )}
        </button>
      </div>

      <p className="my-[6px]">{product.name || ""}</p>
      <div className="flex justify-between">
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
                  className="w-[15px]"
                />
              </div>
            );
          })}
        </div>

        <p>{product.salesCount} sold</p>
      </div>
      <div className="flex justify-between my-[4px]">
        <p className="text-[10px] font-semibold">
          US<span className="text-[16px] font-semibold">${product.price}</span>
        </p>
        <p className="text-mb">
          {product.shippingPrice === 0
            ? "Free Shipping"
            : `Shipping: $${product.shippingPrice}`}
        </p>
      </div>
    </div>
  );
};

export default Card;
