"use client";
import CheckOutProgress from "@/components/checkout/CheckOutProgress";
import { useRouter } from "next/router";

export default function PaymentCancelled() {
  const router = useRouter();
  const { token, PayerID } = router.query;

  return (
    <div className="bg-red-50 min-h-screen flex flex-col justify-center items-center py-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Your payment was not completed. Please try again or contact support.
        </p>

        <div className="text-lg text-gray-600 mb-6">
          {token && (
            <p>
              <span className="font-semibold">Payment ID:</span> {token}
            </p>
          )}
          {PayerID && (
            <p>
              <span className="font-semibold">Payer ID:</span> {PayerID}
            </p>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-red-500 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
