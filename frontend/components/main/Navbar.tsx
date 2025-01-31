"use client";

import { ChangeEvent, FC, FormEvent, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setFilters, setSearchQuery } from "@/store/slices/productSlice";
import { usePathname } from "next/navigation";
import { useLogoutUserMutation } from "@/store/apiSlices/userApiSlice";
import { clearUser } from "@/store/slices/userSlice";
import { Menu, X } from "lucide-react";
import SliderMenu from "./SliderMenu";

const Navbar: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.user.cart.length);
  const { filters } = useSelector((state: RootState) => state.product);
  const [logoutUser] = useLogoutUserMutation();

  const logout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(clearUser());
      localStorage.removeItem("user");
      setIsMenuOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setSearchTerm("");
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <nav className="flex z-50 fixed top-0 bg-white flex-col items-center justify-between h-[110px] xxl:h-[132px] pt-[20px] w-full px-[40px] border-b border-mo/10">
      <div className="flex justify-between w-full items-end">
        {/* Logo */}
        <div className="items-baseline mr-[30px]">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="LOGO"
              width={500}
              height={500}
              className="w-[104px] hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-end pb-[10px]">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Search anything..."
              onChange={handleInputChange}
              value={searchTerm}
              className="border-[2px] rounded-full h-[42px] w-[408px] outline-none px-[26px] border-bl/40 focus:border-bl   transition-all duration-300"
            />
            <button
              type="submit"
              className="ml-[22px] w-[34px] h-[34px] hover:scale-110 transition-transform duration-300"
            >
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

        {/* Cart and Menu */}
        <div className="flex justify-between items-center ml-[100px] w-[380px] pb-[10px]">
          <Link href="/cart">
            <div className="relative w-[50px] h-[36px] hover:scale-110 transition-transform duration-300">
              <Image
                src="/icons/cart.svg"
                alt="Cart Icon"
                width={500}
                height={500}
                className="w-[34px]"
              />
              <span className="absolute bottom-0 right-0 w-[21px] h-[21px] flex items-center justify-center text-sm text-white bg-mo font-semibold rounded-[7px]">
                {cart}
              </span>
            </div>
          </Link>

          <Link href="/notifications">
            <div className="relative w-[44px] h-[36px] hover:scale-110 transition-transform duration-300">
              <Image
                src="/icons/bell.svg"
                alt="Notifications Icon"
                width={500}
                height={500}
                className="w-[30px]"
              />
              <span className="absolute bottom-0 right-0 w-[21px] h-[21px] flex items-center justify-center text-sm text-white bg-mo font-semibold rounded-[7px]">
                0
              </span>
            </div>
          </Link>

          {/* Profile Section */}
          <div ref={menuRef} className="relative flex items-center gap-[30px]">
            {user && (
              <span className="text-mo font-medium">
                Hi, {user.name.split(" ")[0]}
              </span>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2  bg-mo/10 rounded-xl transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-[34px] h-[30px] text-mo" />
              ) : (
                <Menu className="w-[34px] h-[30px] text-mo" />
              )}
            </button>

            <SliderMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              logout={logout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
