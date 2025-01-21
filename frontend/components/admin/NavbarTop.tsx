"use client"; // Ensure this component is client-side

import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "../ToastNotifications";

const Navbar: FC = () => {
  // Access user from Redux state
  const user = useSelector((state: RootState) => state.user.user);
  const path = useSearchParams().get("v");
  const router = useRouter();

  const [header, setHeader] = useState("");

  useEffect(() => {
    if (user === undefined || !user?.role) return; // Wait until user state is defined

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      showToast("error", "Only allowed for admins");
    }
  }, [user]);

  useEffect(() => {
    switch (path) {
      case "1":
        setHeader("Dashboard");
        break;
      case "2":
        setHeader("Product");
        break;
      case "3":
        setHeader("Users");
        break;
      case "4":
        setHeader("Orders");
        break;
      case "5":
        setHeader("Analysis");
        break;
    }
  }, [path]);

  return (
    <nav
      className={`flex z-50 fixed top-0 bg-bg flex-col items-center justify-between h-[112px] pt-[32px] w-full px-[20px]`}
    >
      <div className="flex justify-between w-full items-end">
        {/* Logo */}
        <div className="items-baseline ">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="LOGO"
              width={500}
              height={500}
              className="w-[100px]"
            />
            {/* <p className="text-[20px] text-mb font-poetsen">
              olcart<span className="text-mo text-[18px]">.</span>
              <span className="text-bl text-[10px]">store</span>
            </p> */}
          </Link>
        </div>
        <div className="flex items-end justify-start min-w-[140px] pb-[0px] mx-[20px] text-[22px] font-semibold h-[60px]">
          {header}
        </div>

        {/* Search Bar */}
        <div className="flex items-end pb-[10px]">
          <input
            type="text"
            placeholder="search anything..."
            className="border-[2px] rounded-r-3xl rounded-l-lg  h-[42px] w-[380px]  focus:outline-none px-[26px] border-mo"
          />
          <button className="ml-[22px]  w-[34px] h-[34px]">
            <Image
              src="/icons/search.svg"
              alt="LOGO"
              width={500}
              height={500}
              className="w-[34px]"
            />
          </button>
        </div>

        <div className="flex justify-between items-center ml-[40px] w-[350px] pb-[10px]">
          <Link href="/cart">
            <div className="relative w-[50px] h-[36px]">
              <Image
                src="/icons/bell.svg"
                alt="LOGO"
                width={500}
                height={500}
                className="w-[32px]"
              />
              <span className="absolute bottom-0 right-0 w-[21px] h-[21px] items-center text-center text-[15] text-bl bg-mo font-semibold rounded-full">
                8
              </span>
            </div>
          </Link>

          <Link href="/cart">
            <div className="relative w-[50px] h-[36px]">
              <Image
                src="/icons/emails.svg"
                alt="LOGO"
                width={500}
                height={500}
                className="w-[34px]"
              />
              <span className="absolute bottom-0 right-0 w-[21px] h-[21px] items-center text-center text-[15] text-bl bg-mo font-semibold rounded-full">
                1
              </span>
            </div>
          </Link>

          {/* Profile */}
          <div className="flex items-end pb-[10px]">
            <span className="mb-[-6px]">Hi, {user?.name || "Admin"}...</span>
            <Link href="/profile">
              <Image
                src="/icons/person.svg"
                alt="LOGO"
                width={500}
                height={500}
                className="w-[28px] ml-[20px]"
              />
            </Link>
          </div>
        </div>
      </div>
      {/* <hr className="border-t-[2px] border-fade w-full my-[30px]" /> */}
    </nav>
  );
};

export default Navbar;
