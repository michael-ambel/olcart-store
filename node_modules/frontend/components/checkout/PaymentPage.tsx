"use client";

import React, { useState, useEffect } from "react";
import {
  useGetUserOrdersQuery,
  useCreatePaymentSessionMutation,
} from "@/store/apiSlices/orderApiSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showToast } from "../ToastNotifications";
import { IPaymentOrder, IOrder } from "@/store/types/orderTypes"; // Import both types

export default function PaymentPage() {
  const [selectedOrders, setSelectedOrders] = useState<IPaymentOrder[]>([]);
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
      prev.includes(order)
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
            // Map IOrder to IPaymentOrder
            const paymentOrder: IPaymentOrder = {
              ...order,
              _id: order._id || "", // Ensure _id is a string, provide a fallback if undefined
              shippingPrice: 10, // Example shipping price (replace with actual logic)
              paymentStatus: "Pending", // Example payment status
              status: order.status || "Pending", // Ensure status exists with a fallback
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
                    className="absolute flex right-[30px] w-[20px] h-[20px] rounded-[4px] border-[1.5px] border-bl text-mo appearance-none cursor-pointer transition-all duration-300 checked:before:content-['✔'] text-[20px] items-center"
                    checked={selectedOrders.includes(paymentOrder)}
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
                          src={item.images[0]}
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
            <button
              disabled={isPaying}
              onClick={() => handlePayment("paypal")}
              className="pay-button w-full rounded-[8px] bg-blue-800 h-[44px]"
            >
              Pay with PayPal
            </button>
            <button
              disabled={isPaying}
              onClick={() => handlePayment("stripe")}
              className="pay-button w-full rounded-[8px] bg-mb h-[44px]"
            >
              Pay with Stripe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
