"use client";

import { useGetUserProcessingOrdersQuery } from "@/store/apiSlices/orderApiSlice";
import CheckOutProgress from "@/components/checkout/CheckOutProgress";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IOrder } from "@/store/types/orderTypes";
import Image from "next/image";
import Link from "next/link";

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
  <div className="flex items-center max-w-[260px] space-x-4">
    <div className="flex items-center justify-center w-[90px] object-cover ">
      <Image
        src={image}
        alt={name}
        height={100}
        width={100}
        className=" rounded-md shadow-sm"
      />
    </div>

    <div className="flex-1">
      <h4 className="font-semibold text-bl">{name}</h4>
      <p className="text-sm text-fade">Unit Price: ${price.toFixed(2)}</p>
      <p className="text-sm text-fade">Quantity: {quantity}</p>{" "}
      <p className="font-semibold text-gray-700">${price * quantity}</p>
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
                  <div className="mb-4">
                    <h4 className="font-bold text-[18px] text-bl">
                      Order #{order._id}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Placed on:{" "}
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
                      <OrderItem
                        key={item._id}
                        name={item.name}
                        image={item.images[0]}
                        price={item.price}
                        quantity={item.quantity}
                      />
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Link
                      href={`/order/${order._id}`}
                      className=" text-mg  py-[6px] px-[13px]"
                    >
                      View Details
                    </Link>
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

const ProcessingOrders: React.FC = () => {
  const {
    data: processingOrders,
    isLoading,
    isError,
  } = useGetUserProcessingOrdersQuery();

  return (
    <div className="bg-bgt min-h-screen flex flex-col justify-start w-full ">
      <CheckOutProgress
        cart={true}
        shippingInfo={true}
        paymentMethod={true}
        processing={true}
        processed={false}
      />
      <div className="flex flex-col justify-start mx-[84px]  mt-[120px]">
        <div className="flex justify-between">
          <h1 className="text-[28px] font-bold  text-bl ">Processing Orders</h1>

          <Link href="/" className="bg-mg text-white py-3 px-8 rounded-full">
            Go to Home Page
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin text-blue-500 text-3xl">
              <AiOutlineLoading3Quarters />
            </div>
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load processing orders.</p>
        ) : (
          <CategorizedOrders orders={processingOrders || []} />
        )}
      </div>
    </div>
  );
};

export default ProcessingOrders;
