"use client";
import { Suspense } from "react";

export default function AdminOrders() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}

function AdminOrdersContent() {
  return <div>Admin Orders Page</div>;
}
