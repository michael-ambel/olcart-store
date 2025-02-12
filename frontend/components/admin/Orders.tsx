"use client";
import React, { useState } from "react";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/store/apiSlices/orderApiSlice";
import { ClipLoader } from "react-spinners";
import { showToast } from "../ToastNotifications";
import { Edit } from "lucide-react";

const Orders = () => {
  const {
    data: orders = [],
    refetch,
    isLoading,
    isFetching,
  } = useGetOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    status: string;
  } | null>(null);

  // Tabs for filtering orders
  const orderTabs = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(
    (order) => activeTab === "All" || order.status === activeTab
  );

  const handleSave = async (status: string) => {
    if (selectedOrder) {
      try {
        await updateOrderStatus({ id: selectedOrder.id, status }).unwrap();
        showToast("success", "Order status updated successfully!");
        refetch();
        setSelectedOrder(null);
      } catch {
        showToast("error", "Failed to update order status.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {orderTabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-gray-200 text-mo font-bold"
                  : "bg-gray-200 text-bl"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading || isFetching ? (
          <div className="flex justify-center items-center h-64 ">
            <ClipLoader size={80} color="#333333" />
          </div>
        ) : (
          /* Orders Table */
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 text-left text-bl text-sm">
                <th className="px-2 py-3 ">No</th>
                <th className="px-2 py-3">ID</th>
                <th className="px-2 py-3 ">Name</th>
                <th className="px-2 py-3 ">Email</th>
                <th className="px-2 py-3 ">Items</th>
                <th className="px-2 py-3 ">Total</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3 ">Date</th>
                <th className="px-2 py-3 ">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm text-bl/80">
              {filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td className="px-2 py-2">{index + 1}</td>
                  <td className="px-2 py-2 ">{order._id}</td>
                  <td className="px-2 py-2 ">{order.user?.name}</td>
                  <td className="px-2 py-2 ">{order.user?.email}</td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.name.slice(0, 10)}... - ${item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-2 py-2">${order.totalAmount}</td>
                  <td
                    className={`px-2 py-2 text-sm font-medium ${
                      order.status === "Pending"
                        ? "text-yellow-600 "
                        : order.status === "Processing"
                          ? "text-blue-600"
                          : order.status === "Shipped"
                            ? "text-purple-600 "
                            : order.status === "Delivered"
                              ? "text-green-600 "
                              : order.status === "Cancelled"
                                ? "text-red-600  "
                                : "text-gray-800 "
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="px-2 py-2 ">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-2 py-2 ">
                    <button
                      className="text-mg hover:text-mb"
                      onClick={() =>
                        setSelectedOrder({
                          id: order._id || "",
                          status: order.status || "Pending",
                        })
                      }
                    >
                      <Edit size={18} className="text-mb" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Edit Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Edit Order #{selectedOrder.id}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedOrder.status}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, status: e.target.value })
                }
              >
                {orderTabs.slice(1).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                onClick={() => handleSave(selectedOrder.status)}
                disabled={isUpdating}
              >
                {isUpdating ? <ClipLoader size={18} color="#ffffff" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
