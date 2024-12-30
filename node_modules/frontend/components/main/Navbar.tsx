"use client"; // Ensure this component is client-side

import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Link from "next/link";
import Image from "next/image";

const Navbar: FC = () => {
  // Access user from Redux state
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <nav
      className={`flex z-50 fixed top-0 bg-bg flex-col items-center justify-between h-[132px] pt-[32px] w-full px-[84px]`}
    >
      <div className="flex justify-between w-full items-end">
        {/* Logo */}
        <div className="items-baseline ">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="LOGO"
              width={500}
              height={500}
              className="w-[50px]"
            />
            <p className="text-[20px] text-mb font-poetsen">
              olcart<span className="text-mo text-[18px]">.</span>
              <span className="text-bl text-[10px]">store</span>
            </p>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-end pb-[10px]">
          <input
            type="text"
            placeholder="search anything..."
            className="border-[2px] rounded-full h-[42px] w-[408px]  focus:outline-none px-[26px] border-mo"
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

        <div className="flex justify-between items-center ml-[100px] w-[350px] pb-[10px]">
          <Link href="/cart">
            <div className="relative w-[50px] h-[36px]">
              <Image
                src="./icons/cart.svg"
                alt="LOGO"
                width={500}
                height={500}
                className="w-[34px]"
              />
              <span className="absolute bottom-0 right-0 w-[21px] h-[21px] items-center text-center text-[15] text-bl bg-mo font-semibold rounded-full">
                8
              </span>
            </div>
          </Link>

          <Link href="/cart">
            <div className="relative w-[44px] h-[36px]">
              <Image
                src="./icons/bell.svg"
                alt="LOGO"
                width={500}
                height={500}
                className="w-[30px]"
              />
              <span className="absolute bottom-0 right-0 w-[21px] h-[21px] items-center text-center text-[15] text-bl bg-mo font-semibold rounded-full">
                1
              </span>
            </div>
          </Link>

          {/* Profile */}
          <div className="flex items-end pb-[10px]">
            <span className="mb-[-6px]">Hi, {user?.name || "Guest"}...</span>
            <Link href="/profile">
              <Image
                src="./icons/person.svg"
                alt="LOGO"
                width={500}
                height={500}
                className="w-[29px] ml-[20px]"
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
