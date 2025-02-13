"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  User,
  ListChecks,
  CreditCard,
  MapPin,
  LogOut,
  ChevronDown,
} from "lucide-react";

type ProfileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
};

const SliderMenu: React.FC<ProfileSidebarProps> = ({ isOpen, logout }) => {
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={sidebarRef}
      className={`absolute top-[110px] xl:top-[90px] right-0 w-[280px] bg-white/95 shadow-2xl rounded-lg transform transition-all ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen
          ? "translate-x-0 opacity-100 visible duration-1000"
          : "translate-x-full opacity-0 invisible duration-500"
      } p-4 flex flex-col gap-3 z-40 border border-mo/10 backdrop-blur-lg`}
    >
      {/* Menu Items */}
      <div className="flex flex-col gap-[26px]">
        <Link
          href="/profile"
          className="group w-full py-3 px-4 flex items-center gap-3 text-mo hover:bg-mo/5 rounded-lg transition-all duration-300 hover:-translate-x-1 shadow-md"
        >
          <User
            size={26}
            className="text-bl transition-all duration-300 group-hover:scale-110"
          />
          <span className="font-medium">Profile</span>
        </Link>

        {/* Orders Dropdown */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsOrdersOpen(!isOrdersOpen)}
            className="group w-full py-3 px-4 flex justify-between items-center text-mo hover:bg-mo/5 rounded-lg transition-all duration-300 hover:-translate-x-1 shadow-md"
          >
            <div className="flex items-center gap-3">
              <ListChecks
                size={26}
                className="text-bl transition-all duration-300 group-hover:scale-110"
              />
              <span className="font-medium">Orders</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-bl transition-transform duration-300 ${
                isOrdersOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOrdersOpen && (
            <div className="flex flex-col gap-2 pl-8 animate-in slide-in-from-top">
              <Link
                href="/orders/processing"
                className="py-2 px-4 text-mo/90 bg-mo/5 hover:bg-mo/10 rounded-md transition-all duration-300 hover:pl-6 shadow--md"
              >
                Processing
              </Link>
              <Link
                href="/orders/processed"
                className="py-2 px-4 text-mo/90 bg-mo/5 hover:bg-mo/10 rounded-md transition-all duration-300 hover:pl-6 shadow-md"
              >
                Processed
              </Link>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <Link
          href="/payment-method"
          className="group py-3 px-4 flex items-center gap-3 text-mo hover:bg-mo/5 rounded-lg transition-all duration-300 hover:-translate-x-1 shadow-md"
        >
          <CreditCard
            size={26}
            className="text-bl transition-all duration-300 group-hover:scale-110"
          />
          <span className="font-medium">Payment </span>
        </Link>

        {/* Shipping Address */}
        <Link
          href="/shipping-address"
          className="group py-3 px-4 flex items-center gap-3 text-mo hover:bg-mo/5 rounded-lg transition-all duration-300 hover:-translate-x-1 shadow-md"
        >
          <MapPin
            size={26}
            className="text-bl transition-all duration-300 group-hover:scale-110"
          />
          <span className="font-medium">Address</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-4 py-3 px-4 flex items-center gap-3 text-white bg-mo hover:bg-mo/90 rounded-lg transition-all duration-300 hover:-translate-x-1 shadow-lg hover:shadow-xl"
        >
          <LogOut
            size={24}
            className="text-white transition-all duration-300 group-hover:scale-110"
          />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SliderMenu;
