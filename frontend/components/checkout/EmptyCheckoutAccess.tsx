// components/checkout/EmptyCheckoutAccess.tsx
import Link from "next/link";

export default function EmptyCheckoutAccess() {
  return (
    <div className="max-w-2xl w-full mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-mo/20">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Icon Container */}
        <div className="bg-mo/20 w-16 h-16 rounded-full flex items-center justify-center animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-mo"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Ready to <span className="text-mo">Checkout?</span> Sign In!
          </h2>
          <p className="text-gray-600 sm:text-lg max-w-prose mx-auto">
            Unlock seamless checkout by signing in to your account.
            <span className="block mt-1 text-mg font-medium">
              Enjoy faster processing and order tracking!
            </span>
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full ">
          <Link
            href="/"
            className="w-full  px-6 py-2.5 text-center text-sm font-semibold text-mg border-2 border-mg rounded-full hover:bg-mg/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-mg focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
          <Link
            href="/login"
            className="w-full  px-6 py-2.5 text-center text-sm font-semibold text-white bg-mo rounded-full hover:bg-mo/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-mo focus:ring-offset-2"
          >
            Secure Login
          </Link>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500 mt-4">
          New customer?{" "}
          <Link
            href="/register"
            className="text-mg font-semibold hover:text-mg/80 underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
