"use client";

import { ChangeEvent, FC, FormEvent, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setFilters, setSearchQuery } from "@/store/slices/productSlice";
import { usePathname } from "next/navigation"; // Import usePathname
import { useLogoutUserMutation } from "@/store/apiSlices/userApiSlice";
import { clearUser } from "@/store/slices/userSlice";

const Navbar: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isOrdersMenuOpen, setIsOrdersMenuOpen] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true); // Track if user existence is being checked
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null); // Reference for slider menu
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.user.cart.length);

  const { filters } = useSelector((state: RootState) => state.product);

  const [logoutUser] = useLogoutUserMutation(); // Your custom logout hook mutation

  const logout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(clearUser()); // Clear the user from Redux state
      localStorage.removeItem("user"); // Remove user info from localStorage
      setIsProfileMenuOpen(false); // Close the profile menu
      router.refresh(); // Refresh the page after logout
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
    // Simulate user existence check (replace with your actual logic)
    setTimeout(() => {
      setIsCheckingUser(false); // Set to false once the check is done
    }, 1000); // Simulate a delay for the check
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sliderRef.current &&
        !sliderRef.current.contains(event.target as Node) &&
        !profileMenuRef.current?.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false); // Close slider when clicking outside
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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
                src="/icons/cart.svg"
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
                src="/icons/bell.svg"
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
          <div className="relative">
            {isCheckingUser ? (
              <div className="w-[150px] h-[36px] bg-gray-200 animate-pulse"></div> // Placeholder space while checking user
            ) : user ? (
              <>
                <div
                  ref={profileMenuRef}
                  className="flex items-end pb-[10px] cursor-pointer"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <span className="mb-[-6px]">Hi, {user.name}...</span>
                  <Image
                    src="/icons/person.svg"
                    alt="Profile Icon"
                    width={500}
                    height={500}
                    className="w-[29px] ml-[20px]"
                  />
                </div>

                {/* Slider Menu */}
                {isProfileMenuOpen && (
                  <div
                    ref={sliderRef}
                    className="fixed top-0 right-0 w-[250px] h-full bg-white shadow-lg transition-transform transform ease-in-out duration-300"
                    style={{
                      transform: isProfileMenuOpen
                        ? "translateX(0)"
                        : "translateX(100%)",
                    }}
                  >
                    <div className="flex flex-col p-4">
                      <Link href="/profile">
                        <button
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="py-2 px-4 text-left hover:bg-gray-200"
                        >
                          My Profile
                        </button>
                      </Link>
                      <div>
                        <button
                          onClick={() => setIsOrdersMenuOpen(!isOrdersMenuOpen)}
                          className="py-2 px-4 text-left hover:bg-gray-200"
                        >
                          Orders
                        </button>
                        {isOrdersMenuOpen && (
                          <div className="pl-4">
                            <Link href="/orders/processing">
                              <button
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="py-2 px-4 text-left hover:bg-gray-200"
                              >
                                Processing
                              </button>
                            </Link>
                            <Link href="/orders/processed">
                              <button
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="py-2 px-4 text-left hover:bg-gray-200"
                              >
                                Processed
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                      <Link href="/payment-method">
                        <button
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="py-2 px-4 text-left hover:bg-gray-200"
                        >
                          Payment Method
                        </button>
                      </Link>
                      <Link href="/shipping-address">
                        <button
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="py-2 px-4 text-left hover:bg-gray-200"
                        >
                          Shipping Address
                        </button>
                      </Link>
                      <button
                        onClick={logout} // Call the logout function directly here
                        className="py-2 px-4 text-left hover:bg-gray-200 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login">
                <button className="text-blue-600">Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
