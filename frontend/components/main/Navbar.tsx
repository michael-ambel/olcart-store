"use client";

import { ChangeEvent, FC, FormEvent, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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
import { showToast } from "../ToastNotifications";

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
      setIsMenuOpen(false);
      dispatch(clearUser());
      localStorage.removeItem("user");
      showToast("success", "Logged out successfully");
      router.refresh();
    } catch {
      showToast("error", "Logout failed");
    }
  };

  const cartBtnHandler = () => {
    router.push("/cart");
    // if (user) {
    //   router.push("/cart");
    // } else {
    //   showToast("error", "Please login to view cart!");
    // }
  };

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setSearchTerm("");
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sliderMenu = document.querySelector(".slider-menu-container");
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !sliderMenu?.contains(event.target as Node)
      ) {
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
    <nav className="fixed top-0 z-50 w-full bg-white shadow-lg ">
      <div className="container mx-auto px-4 sm:px-[30px] lg:px-[40px]">
        {/* Main Navbar Section */}
        <div className="h-14 mx-auto md:h-[120px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="LOGO"
                width={500}
                height={500}
                className="w-[82px] md:w-[104px] hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex md:px-[8%] flex-1 max-w-2xl mx-6 lg:mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  onChange={handleInputChange}
                  value={searchTerm}
                  className="w-full h-10 px-6 py-2 border-2 rounded-full border-bl/40 focus:border-bl outline-none transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2 w-6 h-6 hover:scale-110 transition-transform duration-300"
                >
                  <Image
                    src="/icons/search.svg"
                    alt="Search Icon"
                    width={24}
                    height={24}
                    className="w-full h-full"
                  />
                </button>
              </div>
            </form>
          </div>

          {/* Icons Section */}
          <div className="flex flex-1 justify-between pl-[14%] md:pl-0 items-center gap-2 md:gap-4">
            {/* Cart Icon */}
            <button
              onClick={cartBtnHandler}
              className="p-1.5 hover:scale-110 transition-transform duration-300 sm:min-w-[38px] sm:min-h-[38px]  relative"
            >
              <Image
                src="/icons/cart.svg"
                alt="Cart Icon"
                width={24}
                height={24}
                className="w-[30px] h-[30px] md:w-[34px] xl:w-[38px] md:h-[34px] xl:h-[38px]"
              />
              {cart > 0 ? (
                <span className="absolute bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-semibold text-[12px] md:text-[14px] text-white bg-mo  rounded-[6px]">
                  {cart}
                </span>
              ) : (
                <span className="absolute bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[12px] md:text-[14px] text-white bg-mo font-semibold rounded-[6px]">
                  0
                </span>
              )}
            </button>

            {/* Notifications Icon */}
            <Link
              href="/notifications"
              className="p-1.5 mr-2 sm:min-w-[38px] sm:min-h-[38px]   hover:scale-110 transition-transform duration-300 relative"
            >
              <Image
                src="/icons/bell.svg"
                alt="Notifications Icon"
                width={24}
                height={24}
                className="w-[30px] h-[30px] md:w-[34px] xl:w-[38px] md:h-[34px] xl:h-[38px]"
              />
              <span className="absolute bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[12px] md:text-[14px] text-white bg-mo font-semibold rounded-[6px]">
                0
              </span>
            </Link>

            {/* Profile Section */}
            <div
              ref={menuRef}
              className="flex items-center gap-2 md:gap-6 pl-2"
            >
              {user && (
                <span className="hidden md:block text-mo font-medium text-md md:text-[18px]">
                  Hi, {user.name.split(" ")[0]}
                </span>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 bg-mo/10 rounded-lg hover:bg-mo/20 transition-colors duration-300"
              >
                {isMenuOpen ? (
                  <X className="w-7 h-7 md:w-8 md:h-8 xxl:w-10 xxl:h-10 text-mo" />
                ) : (
                  <Menu className="w-7 h-7 md:w-8 md:h-8 xxl:w-10 xxl:h-10 text-mo" />
                )}
              </button>

              {!user && (
                <button
                  onClick={() => router.push("/login")}
                  className="text-mo font-semibold px-[8px] py-[6px] rounded-[4px] bg-bl/10 md:text-[18px] whitespace-nowrap"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anything..."
                onChange={handleInputChange}
                value={searchTerm}
                className="w-full h-10 px-4 py-2 border-2 rounded-full border-bl/40 focus:border-bl outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-2 w-6 h-6 hover:scale-110 transition-transform duration-300"
              >
                <Image
                  src="/icons/search.svg"
                  alt="Search Icon"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </button>
            </div>
          </form>
        </div>
      </div>

      <SliderMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        logout={logout}
      />
    </nav>
  );
};

export default Navbar;
