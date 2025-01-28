"use client";

import NavbarTop from "@/components/admin/NavbarTop";
import NavbarLeft from "@/components/admin/NavbarLeft";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative">
        <NavbarLeft />
        <NavbarTop />
        {children}
      </body>
    </html>
  );
}
