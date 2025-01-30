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
    <div className="fixed top-[0px] z-20 flex  w-full justify-around items-center h-[100px] bg-bgs">
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
        Payment
      </Link>
      <Link
        href="orders/processing"
        className={`${placeOrder === true ? "text-bl" : "text-fade"} px-[10px]`}
      >
        Processing
      </Link>
      <Link
        href="orders/processed"
        className={`${success === true ? "text-bl" : "text-fade"} px-[10px]`}
      >
        Processed
      </Link>
    </div>
  );
};

export default CheckOutProgress;
