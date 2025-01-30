"use client";

import { useGetUserProcessedOrdersQuery } from "@/store/apiSlices/orderApiSlice";
import CheckOutProgress from "@/components/checkout/CheckOutProgress";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IOrder } from "@/store/types/orderTypes";
import Image from "next/image";
import Link from "next/link";

const CategorizedOrders: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
  const categorizedOrders = {
    Delivered: orders.filter((order) => order.status === "Delivered"),
    Cancelled: orders.filter((order) => order.status === "Cancelled"),
  };

  return (
    <div className="flex flex-col gap-[60px]  mt-[40px]">
      {Object.entries(categorizedOrders).map(([status, filteredOrders]) => (
        <div key={status}>
          <h3 className="text-[22px] font-bold text-mg mb-3">{status}</h3>
          {filteredOrders.length > 0 ? (
            <ul className="space-y-6">
              {filteredOrders.map((order) => (
                <li
                  key={order._id}
                  className="p-6 bg-white shadow-md rounded-lg border hover:shadow-lg transition"
                >
                  <div className="flex flex-col mb-4 items-start">
                    <h4 className="font-bold text-[18px] text-bl">
                      Order #{order._id}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                    <p className="text-bl font-semibold mt-2">
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-[30px]">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex items-center justify-center w-[90px] object-cover ">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            height={100}
                            width={100}
                            className=" rounded-md shadow-sm"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-bl">{item.name}</h4>
                          <p className="text-sm text-fade">
                            Unit Price: ${item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-fade">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-semibold text-gray-700">
                            ${item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <div className="mt-4 text-right">
                      <Link
                        href={`/order/${order._id}`}
                        className=" text-mg  py-[6px] px-[13px]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No orders under {status}.</p>
          )}
        </div>
      ))}
    </div>
  );
};

const ProcessedOrders: React.FC = () => {
  const {
    data: processedOrders,
    isLoading,
    isError,
  } = useGetUserProcessedOrdersQuery();

  return (
    <div className="bg-bgt min-h-screen flex flex-col justify-start w-full ">
      <CheckOutProgress
        cart={true}
        shippingInfo={true}
        paymentMethod={true}
        placeOrder={true}
        success={true}
      />
      <div className="flex flex-col justify-start mx-[84px]  mt-[120px]">
        <div className="flex justify-between">
          <h1 className="text-[28px] font-bold  text-bl">Processed Orders</h1>
          <Link href="/" className="bg-mg text-white py-3 px-8 rounded-full">
            Go to Home Page
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin text-green-500 text-3xl">
              <AiOutlineLoading3Quarters />
            </div>
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load processed orders.</p>
        ) : (
          <CategorizedOrders orders={processedOrders || []} />
        )}
      </div>
    </div>
  );
};

export default ProcessedOrders;
