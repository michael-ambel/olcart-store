"use client";

import { useGetUserProcessingOrdersQuery } from "@/store/apiSlices/orderApiSlice";
import CheckOutProgress from "@/components/checkout/CheckOutProgress";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IOrder } from "@/store/types/orderTypes";
import Image from "next/image";
import Link from "next/link";
import EmptyCheckoutAccess from "@/components/checkout/EmptyCheckoutAccess";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface OrderItemProps {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const OrderItem: React.FC<OrderItemProps> = ({
  name,
  image,
  price,
  quantity,
}) => (
  <div className="flex items-center w-full sm:w-auto space-x-4 p-2 sm:p-0">
    <div className="flex items-center justify-center w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]">
      <Image
        src={image}
        alt={name}
        width={120}
        height={120}
        className="object-contain w-full h-full p-1"
      />
    </div>

    <div className="flex-1">
      <h4 className="font-semibold text-bl text-sm sm:text-base">{name}</h4>
      <p className="text-xs sm:text-sm text-fade">
        Unit Price: ${price.toFixed(2)}
      </p>
      <p className="text-xs sm:text-sm text-fade">Quantity: {quantity}</p>
      <p className="font-semibold text-gray-700 text-sm sm:text-base">
        ${(price * quantity).toFixed(2)}
      </p>
    </div>
  </div>
);

interface CategorizedOrdersProps {
  orders: IOrder[];
}

const CategorizedOrders: React.FC<CategorizedOrdersProps> = ({ orders }) => {
  const categorizedOrders = {
    Pending: orders.filter((order) => order.status === "Pending"),
    Processing: orders.filter((order) => order.status === "Processing"),
    Shipped: orders.filter((order) => order.status === "Shipped"),
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 mt-6 ">
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
                  <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-4">
                    {order.items.map((item) => (
                      <OrderItem
                        key={item._id}
                        name={item.name}
                        image={item.images[0] || "/default-product.jpg"}
                        price={item.price}
                        quantity={item.quantity}
                      />
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

const ProcessingOrders: React.FC = () => {
  const {
    data: processingOrders,
    isLoading,
    isError,
  } = useGetUserProcessingOrdersQuery();

  const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <CheckOutProgress
        cart={true}
        shippingInfo={true}
        paymentMethod={true}
        processing={true}
        processed={false}
      />

      {!user ? (
        <div className="flex justify-center items-center h-screen mt-[20px] flex-col">
          <EmptyCheckoutAccess />
        </div>
      ) : (
        <div className="bg-bgt min-h-screen w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto mt-[100px]">
            <div className="flex justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-xl  font-bold text-bl">Processing Orders</h1>
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
              <CategorizedOrders orders={processingOrders || []} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessingOrders;
