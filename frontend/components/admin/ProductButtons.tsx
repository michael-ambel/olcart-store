"use client";
import Link from "next/link";
import { useState } from "react";

const ProductButtons = () => {
  const [active, setActive] = useState("list");
  return (
    <div className="flex w-full gap-[15px]">
      <Link
        onClick={() => setActive("list")}
        href="/admin/products?v=2"
        className={`flex items-center justify-center rounded-[10px] w-[138px] h-[38px] text-bg ${
          active === "list" ? "bg-mo" : "bg-bl"
        }`}
      >
        List
      </Link>
      <Link
        onClick={() => setActive("create")}
        href="/admin/products/create?v=2"
        className={`flex items-center justify-center rounded-[10px] w-[138px] h-[38px] text-bg ${
          active === "list" ? "bg-bl" : "bg-mo"
        }`}
      >
        Create
      </Link>
    </div>
  );
};

export default ProductButtons;
