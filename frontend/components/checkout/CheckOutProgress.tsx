import Link from "next/link";
import React from "react";
import {
  FiShoppingCart,
  FiTruck,
  FiCreditCard,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";

interface Progress {
  cart: boolean;
  shippingInfo: boolean;
  paymentMethod: boolean;
  processing: boolean;
  processed: boolean;
}

const CheckOutProgress = ({
  cart,
  shippingInfo,
  paymentMethod,
  processing,
  processed,
}: Progress) => {
  const steps = [
    {
      id: 1,
      name: "Cart",
      icon: FiShoppingCart,
      completed: cart,
      path: "/cart",
    },
    {
      id: 2,
      name: "Shipping",
      icon: FiTruck,
      completed: shippingInfo,
      path: "/shipping-address",
    },
    {
      id: 3,
      name: "Payment",
      icon: FiCreditCard,
      completed: paymentMethod,
      path: "/payment-method",
    },
    {
      id: 4,
      name: "Processing",
      icon: FiPackage,
      completed: processing,
      path: "/orders/processing",
    },
    {
      id: 5,
      name: "Completed",
      icon: FiCheckCircle,
      completed: processed,
      path: "/orders/processed",
    },
  ];

  const activeStep =
    steps.findIndex((step) => !step.completed) + 1 || steps.length;

  return (
    <div className="fixed top-0 z-20 w-full bg-bgs pb-10 pt-6 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200">
            <div
              className="absolute h-full bg-mo transition-all duration-500"
              style={{
                width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`, // Line stops before the active step
              }}
            />
          </div>

          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isCompleted = step.completed && activeStep > step.id;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center z-10"
              >
                <Link
                  href={step.path}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-bg text-mo border-[3px] border-mo shadow-lg hover:scale-110" // Active step: orange circle
                      : isCompleted
                        ? "bg-mo  text-bg font-bold shadow-lg" // Completed steps: gray circle
                        : "bg-white text-gray-400 border-2 border-gray-300" // Inactive steps: gray border
                  }`}
                >
                  <step.icon className="w-6 h-6" strokeWidth={2.5} />
                </Link>

                {/* Desktop - Step names */}
                <span
                  className={`absolute top-full mt-3 text-sm font-medium hidden sm:block ${
                    isActive ? "text-mo font-bold" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>

                {/* Mobile - Only numbers */}
                <span
                  className={`absolute top-full mt-3 text-sm sm:hidden ${
                    isActive ? "text-mo font-bold" : "text-gray-500"
                  }`}
                >
                  {step.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckOutProgress;
