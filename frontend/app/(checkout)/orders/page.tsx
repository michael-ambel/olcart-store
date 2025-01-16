"use client";
import CheckOutProgress from "@/components/checkout/CheckOutProgress";

export default function Procecced() {
  return (
    <div className="bg-green-50 min-h-screen flex flex-col justify-center items-center py-10">
      <CheckOutProgress
        cart={true}
        shippingInfo={true}
        paymentMethod={true}
        placeOrder={true}
        success={true}
      />
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-green-700 mb-4">Orders</h1>

        <div className="mt-8">
          <a
            href="/"
            className="bg-green-700 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
          >
            Go to Home Page
          </a>
        </div>
      </div>
    </div>
  );
}
