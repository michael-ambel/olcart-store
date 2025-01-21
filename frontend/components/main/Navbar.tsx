"use client"; // Ensure this component is client-side

import { ChangeEvent, FC, FormEvent, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setFilters, setSearchQuery } from "@/store/slices/productSlice";
import { usePathname } from "next/navigation"; // Import usePathname

const Navbar: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.user.cart.length);

  const { filters } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setSearchTerm("");
    }
  }, [pathname]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setFilters({ ...filters, page: 1 }));
      dispatch(setSearchQuery(searchTerm.trim()));
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav
      className={`flex z-40 fixed top-0 bg-bg flex-col items-center justify-between h-[110px] xxl:h-[132px] pt-[20px] w-full px-[40px]`}
    >
      <div className="flex justify-between w-full items-end">
        {/* Logo */}
        <div className="items-baseline mr-[30px]">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="LOGO"
              width={500}
              height={500}
              className="w-[104px]"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-end pb-[10px]">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="search anything..."
              onChange={handleInputChange}
              value={searchTerm}
              className="border-[2px] rounded-full h-[42px] w-[408px]  focus:outline-none px-[26px] border-mo"
            />
            <button type="submit" className="ml-[22px]  w-[34px] h-[34px]">
              <Image
                src="/icons/search.svg"
                alt="Search Icon"
                width={500}
                height={500}
                className="w-[34px]"
              />
            </button>
          </form>
        </div>

        {/* Cart and Profile */}
        <div className="flex justify-between items-center ml-[100px] w-[350px] pb-[10px]">
          <Link href="/cart">
            <div className="relative w-[50px] h-[36px]">
              <Image
                src="./icons/cart.svg"
                alt="Cart Icon"
                width={500}
                height={500}
                className="w-[34px]"
              />
              <span className="absolute bottom-0 right-0 w-[21px] h-[21px] items-center text-center text-[14] text-bg bg-mo font-semibold rounded-full">
                {cart}
              </span>
            </div>
          </Link>

          <Link href="/cart">
            <div className="relative w-[44px] h-[36px]">
              <Image
                src="./icons/bell.svg"
                alt="Notifications Icon"
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
                alt="Profile Icon"
                width={500}
                height={500}
                className="w-[29px] ml-[20px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
