"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  BarChart,
  Layers,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/analysis", icon: BarChart, label: "Analysis" },
  { href: "/admin/products/category", icon: Layers, label: "Category" },
];

const NavbarLeft = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-[180px] h-screen bg-bgs shadow-lg p-4 flex flex-col items-start gap-6 pt-[120px]">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-mo text-white shadow-md" // Active state
                : "text-gray-600 hover:bg-blue-50 hover:shadow-md"
            }`}
          >
            <Icon
              size={24}
              className={`${
                isActive ? "text-white" : "text-gray-600"
              } transition-all duration-300`}
            />
            <span className="text-[15px] font-medium">{label}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default NavbarLeft;
