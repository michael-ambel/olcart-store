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
    <div className="flex flex-col gap-6 md:gap-8 mt-6">
      {Object.entries(categorizedOrders).map(([status, filteredOrders]) => (
        <div key={status} className="space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-mg">{status}</h3>
          {filteredOrders.length > 0 ? (
            <ul className="space-y-4">
              {filteredOrders.map((order) => (
                <li
                  key={order._id}
                  className="p-4 sm:p-6 bg-white shadow-sm sm:shadow-md rounded-lg border"
                >
                  <div className="mb-4">
                    <h4 className="font-bold text-base sm:text-lg text-bl">
                      Order #{order._id?.slice(-8)}....
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Placed on:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                    <p className="text-bl font-semibold mt-2 text-sm sm:text-base">
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 xxl:grid-cols-4 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 p-2 sm:p-0"
                      >
                        <div className="flex items-center justify-center w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]">
                          <Image
                            src={item.images[0] || "/default-product.jpg"}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="object-contain w-full h-full p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-bl text-sm sm:text-base">
                            {item.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-fade">
                            Unit Price: ${item.price.toFixed(2)}
                          </p>
                          <p className="text-xs sm:text-sm text-fade">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-semibold text-gray-700 text-sm sm:text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Link
                      href={`/order/${order._id}`}
                      className="inline-block text-sm sm:text-base text-mg hover:text-mg/80 px-3 py-1 rounded-md"
                    >
                      View Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">
              No {status.toLowerCase()} orders
            </p>
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
    <div className="bg-bgt min-h-screen w-full">
      <CheckOutProgress
        cart={true}
        shippingInfo={true}
        paymentMethod={true}
        processing={true}
        processed={true}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto mt-[100px]">
        <div className="flex justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl  font-bold text-bl">Processed Orders</h1>
          <Link
            href="/"
            className="sm:w-auto text-center bg-mg text-white text-md sm:text-base py-[9px] px-8 rounded-full hover:bg-mg/90 transition-colors"
          >
            Home
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48 mt-[100px]">
            <div className="animate-spin text-mg text-[80px]">
              <AiOutlineLoading3Quarters />
            </div>
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center">Error loading orders</p>
        ) : (
          <CategorizedOrders
            orders={Array.isArray(processedOrders) ? processedOrders : []}
          />
        )}
      </div>
    </div>
  );
};

export default ProcessedOrders;
