import Link from "next/link";
import React from "react";

interface Progress {
  cart: boolean;
  shippingInfo: boolean;
  paymentMethod: boolean;
  placeOrder: boolean;
  success: boolean;
}

const CheckOutProgress = ({
  cart,
  shippingInfo,
  paymentMethod,
  placeOrder,
  success,
}: Progress) => {
  return (
    <div className="fixed top-[0px] z-50 flex  w-full justify-around items-center h-[100px] bg-bgs">
      <Link
        href="/cart"
        className={`${cart === true ? "text-bl" : "text-fade"} px-[10px]`}
      >
        Cart
      </Link>

      <Link
        href="/shipping-address"
        className={`${
          shippingInfo === true ? "text-bl" : "text-fade"
        } px-[10px]`}
      >
        Shipping Information
      </Link>
      <Link
        href="/payment-method"
        className={`${
          paymentMethod === true ? "text-bl" : "text-fade"
        } px-[10px]`}
      >
        Payment Method
      </Link>
      <Link
        href="/place-order"
        className={`${placeOrder === true ? "text-bl" : "text-fade"} px-[10px]`}
      >
        Place Order
      </Link>
      <Link
        href="/success"
        className={`${success === true ? "text-bl" : "text-fade"} px-[10px]`}
      >
        Success
      </Link>
    </div>
  );
};

export default CheckOutProgress;
