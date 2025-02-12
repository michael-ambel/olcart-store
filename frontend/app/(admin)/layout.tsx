"use client";

import NavbarTop from "@/components/admin/NavbarTop";
import NavbarLeft from "@/components/admin/NavbarLeft";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <NavbarLeft />
      <NavbarTop />
      <div className="ml-[180px] pt-[110px]">{children}</div>
    </div>
  );
}
