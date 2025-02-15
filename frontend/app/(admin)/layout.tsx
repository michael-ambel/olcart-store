// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import NavbarTop from "@/components/admin/NavbarTop";
import NavbarLeft from "@/components/admin/NavbarLeft";
import SmallScreenMessage from "@/components/admin/SmallScreenMessage";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="xl:hidden">
        <SmallScreenMessage />
      </div>

      {/* Desktop View */}
      <div className="hidden xl:block relative">
        <NavbarLeft />
        <NavbarTop />
        <div className="ml-[180px] pt-[110px]">{children}</div>
      </div>
    </>
  );
}
