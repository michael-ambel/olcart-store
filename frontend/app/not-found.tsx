"use client";

import React from "react";
import Link from "next/link";

const Custom404: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-mo">
      <div className="text-center space-y-6">
        <div className="text-9xl font-bold tracking-tighter">🛒</div>
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-2xl font-medium">
          Oops! Your cart took a wrong turn.
        </p>
        <p className="text-lg">
          The page you&apos;re looking for is out of stock or lost in the
          aisles.
        </p>
        <Link
          href="/"
          className=" mt-6 px-8 py-4 bg-bgt text-mo font-semibold rounded-lg shadow-sm hover:bg-bg hover:text-mg transition duration-300 flex items-center justify-center space-x-2"
        >
          <span>Continue Shopping</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
