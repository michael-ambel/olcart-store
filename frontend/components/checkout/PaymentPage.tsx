"use client";

import React, { useState, useEffect } from "react";
import {
  useGetUserOrdersQuery,
  useCreatePaymentSessionMutation,
} from "@/store/apiSlices/orderApiSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showToast } from "../ToastNotifications";
import { IPaymentOrder, IOrder } from "@/store/types/orderTypes";

export default function PaymentPage() {
  const [selectedOrders, setSelectedOrders] = useState<IPaymentOrder[]>([]);
  const [activePaymentMethod, setActivePaymentMethod] = useState<
    "paypal" | "stripe" | null
  >(null); // Track active payment method
  const [createPaymentSession, { isLoading: isPaying }] =
    useCreatePaymentSessionMutation();

  const { data: orders, isLoading, isError } = useGetUserOrdersQuery();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      showToast("success", "Payment successful! Thank you.");
    } else if (status === "failed") {
      showToast("error", "Payment failed. Please try again.");
    }
  }, []);

  const handleOrderSelect = (order: IPaymentOrder) => {
    setSelectedOrders((prev) =>
      prev.some((o) => o._id === order._id)
        ? prev.filter((o) => o._id !== order._id)
        : [...prev, order]
    );
  };

  const calculateTotal = () => {
    return selectedOrders.reduce(
      (acc, order) => ({
        totalAmount: acc.totalAmount + order.totalAmount,
        shippingPrice: acc.shippingPrice + order.shippingPrice,
      }),
      { totalAmount: 0, shippingPrice: 0 }
    );
  };

  const handlePayment = async (paymentMethod: "paypal" | "stripe") => {
    try {
      if (selectedOrders.length === 0) {
        showToast("error", "Please select at least one order");
        return;
      }

      setActivePaymentMethod(paymentMethod); // Set the active payment method

      const orderIds = selectedOrders?.map((order) => order._id);

      const { paymentUrl } = await createPaymentSession({
        orderIds,
        paymentMethod,
      }).unwrap();

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        showToast("error", "Failed to create payment session.");
      }
    } catch (error) {
      if (error) {
        showToast(
          "error",
          "Failed to create payment session. Please try again."
        );
      }
    } finally {
      setActivePaymentMethod(null); // Reset the active payment method
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading orders...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-600">
        Failed to fetch orders. Please try again later.
      </p>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500 flex-col">
        <p>No orders to pay for yet. Please add some orders to proceed!</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-mo text-white rounded-lg"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col z-10 mt-[96px] mx-[0px] items-center">
      <div className="flex gap-[26px] mt-8">
        <div className="space-y-6 ml-[20px] mr-[460px]">
          <h1 className="text-xl font-bold mb-6 text-center">Order Summary</h1>
          {orders?.map((order: IOrder) => {
            const paymentOrder: IPaymentOrder = {
              ...order,
              _id: order._id || "",
              shippingPrice: 10,
              paymentStatus: "Pending",
              status: order.status || "Pending",
            };

            return (
              <div
                key={paymentOrder._id}
                className={`relative p-6 border border-gray-300 rounded-lg shadow-sm ${
                  selectedOrders.includes(paymentOrder) ? "bg-bg" : ""
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <input
                    type="checkbox"
                    className={`absolute right-[30px] h-[22px] w-[22px] appearance-none rounded-md border-2 border-bl cursor-pointer focus:outline-none 
    flex items-center justify-center
 
    ${
      selectedOrders.some((o) => o._id === paymentOrder._id)
        ? "after:content-['✔'] after:absolute after:right-0 after:font-bold after:text-[18px] after:text-mo after:pointer-events-none after:h-full after:w-full after:flex after:items-center after:justify-center"
        : ""
    }`}
                    checked={selectedOrders.some(
                      (o) => o._id === paymentOrder._id
                    )}
                    onChange={() => handleOrderSelect(paymentOrder)}
                  />
                  <h2 className="text-lg font-semibold">
                    Order ID: {paymentOrder._id}
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {paymentOrder.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-2 border-b pb-2"
                    >
                      <div className="flex items-center w-[70px] h-[70px]">
                        <Image
                          src={item.images[0] || "/default-image.png"}
                          alt={item.name}
                          width={70}
                          height={70}
                          className="rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="text-md font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-sm">
                    Shipping:{" "}
                    <span className="font-medium">
                      ${paymentOrder.shippingPrice}
                    </span>
                  </p>
                  <p className="text-sm">
                    Item Price:{" "}
                    <span className="font-medium">
                      ${paymentOrder.totalAmount}
                    </span>
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className="font-medium">{paymentOrder.status}</span>
                  </p>
                  <p className="text-sm">
                    Payment Status:{" "}
                    <span
                      className={`font-medium ${
                        paymentOrder.paymentStatus === "Failed"
                          ? "text-red-600"
                          : paymentOrder.paymentStatus === "Pending"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {paymentOrder.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed right-[30px] top-[140px] w-[400px] p-6 border border-gray-300 rounded-lg shadow-sm space-y-6">
          <h2 className="text-[22px] font-bold mb-2">Select Payment Option</h2>
          <div className="flex flex-col text-[16px] font-medium gap-2 mb-4">
            <p className="">Selected Orders: {selectedOrders.length}</p>
            <p className="">
              Shipping Total: ${calculateTotal().shippingPrice}
            </p>
            <p className="">Grand Total: ${calculateTotal().totalAmount}</p>
          </div>

          <div className="flex flex-col gap-4 text-bg text-[18px]">
            {/* PayPal Button */}
            <button
              disabled={isPaying && activePaymentMethod === "paypal"}
              onClick={() => handlePayment("paypal")}
              className="relative w-full rounded-xl bg-gradient-to-r from-[#003087] to-[#009cde] h-[52px] 
      transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,156,222,0.4)] 
      focus:ring-4 focus:ring-[#009cde]/50 focus:outline-none
      active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {activePaymentMethod === "paypal" && isPaying ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-semibold tracking-wide pt-[1px] animate-pulse ml-[10px]">
                      Processing...
                    </span>
                  </>
                ) : (
                  <>
                    <Image
                      src="/icons/paypal.svg"
                      alt="PayPal"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-semibold tracking-wide">
                      Pay with PayPal
                    </span>
                  </>
                )}
              </div>
            </button>

            {/* Stripe Button */}
            <button
              disabled={isPaying && activePaymentMethod === "stripe"}
              onClick={() => handlePayment("stripe")}
              className="relative w-full rounded-xl bg-gradient-to-r from-[#635bff] to-[#a259ff] h-[52px] 
      transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(163,89,255,0.4)] 
      focus:ring-4 focus:ring-[#a259ff]/50 focus:outline-none
      active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {activePaymentMethod === "stripe" && isPaying ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-semibold tracking-wide pt-[1px] animate-pulse ml-[10px]">
                      Processing...
                    </span>
                  </>
                ) : (
                  <>
                    <Image
                      src="/icons/stripe.svg"
                      alt="Stripe"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-semibold tracking-wide">
                      Pay with Stripe
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
