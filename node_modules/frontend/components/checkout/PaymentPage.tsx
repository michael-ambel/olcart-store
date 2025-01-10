"use client";

import React, { useState } from "react";
import { useGetUserOrdersQuery } from "@/store/apiSlices/orderApiSlice";
import Image from "next/image";

export default function PaymentPage() {
  const { data: orders, isLoading, isError } = useGetUserOrdersQuery();
  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);

  const handleOrderSelect = (order: any) => {
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

  return (
    <div className="flex flex-col z-10 mt-[96px] mx-[0px] items-center">
      <div className="flex gap-[26px] mt-8">
        {/* Order Summary Section */}
        <div className="space-y-6 ml-[20px] mr-[460px]">
          <h1 className="text-xl font-bold mb-6 text-center">Order Summary</h1>
          {orders?.map((order: any) => (
            <div
              key={order._id}
              className={`relative p-6 border border-gray-300 rounded-lg shadow-sm ${
                selectedOrders.includes(order) ? "bg-bg" : ""
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="checkbox"
                  className="absolute flex right-[30px] w-[20px] h-[20px] rounded-[4px] border-[1.5px] border-bl text-mo  appearance-none   cursor-pointer transition-all duration-300 checked:before:content-['✔'] text-[20px] items-center"
                  checked={selectedOrders.includes(order)}
                  onChange={() => handleOrderSelect(order)}
                />
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {order.items.map((item: any) => (
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
                  <span className="font-medium">${order.shippingPrice}</span>
                </p>
                <p className="text-sm">
                  Item Price:{" "}
                  <span className="font-medium">${order.totalAmount}</span>
                </p>
              </div>
            </div>
          ))}
          ``
        </div>

        {/* Payment Options Section */}
        <div className="fixed right-[30px] top-[140px] p-6 border border-gray-300 rounded-lg shadow-sm space-y-6">
          <h2 className="text-[22px] font-bold mb-2">Select Payment Option</h2>
          <div className="flex flex-col text-[16px] font-medium gap-2 mb-4">
            <p className="">Selected Orders: {selectedOrders.length}</p>
            <p className="">
              Shipping Total: ${calculateTotal().shippingPrice}
            </p>
            <p className="">Grand Total: ${calculateTotal().totalAmount}</p>
          </div>
          <button
            className="w-full py-3 px-6 bg-mb text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            disabled={selectedOrders.length === 0}
          >
            Pay with PayPal
          </button>
          <button
            className="w-full py-3 px-6 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition"
            disabled={selectedOrders.length === 0}
          >
            Pay with Stripe
          </button>
        </div>
      </div>
    </div>
  );
}
