// components/OrderEditPopup.tsx
"use client";

import React from "react";

interface OrderEditPopupProps {
  order: { id: string; status: string };
  onClose: () => void;
  onSave: (status: string) => void;
}

const OrderEditPopup: React.FC<OrderEditPopupProps> = ({
  order,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = React.useState(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Order #{order.id}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => onSave(status)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderEditPopup;
