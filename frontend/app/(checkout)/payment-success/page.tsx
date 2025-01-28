"use client";
import CheckOutProgress from "@/components/checkout/CheckOutProgress";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const PayerID = searchParams.get("PayerID");

  // If no token or PayerID, simply display the success message without the payment details
  const showPaymentDetails = token && PayerID;

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
        <h1 className="text-4xl font-semibold text-green-700 mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Thank you for your purchase. Your payment has been successfully
          processed.
        </p>

        {showPaymentDetails && (
          <div className="text-lg text-gray-600 mb-6">
            <p>
              <span className="font-semibold">Payment ID:</span> {token}
            </p>
            <p>
              <span className="font-semibold">Payer ID:</span> {PayerID}
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="bg-green-700 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
