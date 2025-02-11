"use client";

// app/admin/orders/page.tsx
import React, { useState } from "react";
import OrderEditPopup from "./OrderEditPoup";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("total");
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    status: string;
  } | null>(null);

  // Sample orders data with dynamic IDs
  const orders = [
    { id: "ksd9sd88o4ij", status: "pending", total: 100, date: "2023-10-01" },
    { id: "lkjhgf123456", status: "paid", total: 200, date: "2023-10-02" },
    { id: "mnbvcxz7890", status: "delivered", total: 300, date: "2023-10-03" },
    { id: "poiuytrewq", status: "canceled", total: 400, date: "2023-10-04" },
    { id: "asdfghjkl123", status: "pending", total: 150, date: "2023-10-05" },
    { id: "zxcvbnm456", status: "paid", total: 250, date: "2023-10-06" },
  ];

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(
    (order) => activeTab === "total" || order.status === activeTab,
  );

  // Handle saving the updated order status
  const handleSave = (status: string) => {
    if (selectedOrder) {
      // Update the order status in the backend or state
      console.log(`Order ${selectedOrder.id} status updated to:`, status);
      setSelectedOrder(null); // Close the popup
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Tabs for filtering orders */}
        <div className="flex space-x-4 mb-6">
          {["total", "pending", "paid", "delivered", "canceled"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order, index) => (
              <tr key={order.id}>
                {/* Dynamically render the row number (No) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                {/* Display the dynamic order ID */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Edit Popup */}
      {selectedOrder && (
        <OrderEditPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Orders;
