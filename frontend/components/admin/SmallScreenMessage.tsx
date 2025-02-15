// components/admin/SmallScreenMessage.tsx
"use client";

import Link from "next/link";

export default function SmallScreenMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mo/10 p-4">
      <div className="max-w-md text-center">
        <div className="text-4xl mb-4">📱</div>
        <h1 className="text-2xl font-bold text-mo mb-4">
          Admin Panel Optimized for Larger Screens
        </h1>
        <p className="text-mg-600 mb-6">
          For the best experience and proper data visualization, please use a
          desktop or laptop computer. The admin interface requires more screen
          space to function effectively.
        </p>
        <Link
          href="/"
          className="inline-block bg-mg text-white px-6 py-2 rounded-lg
           hover:bg-mg/80 transition-colors duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
