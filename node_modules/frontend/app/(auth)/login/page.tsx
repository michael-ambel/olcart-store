"use client";

import { useState } from "react";
import { useLoginUserMutation } from "@/store/apiSlices/userApiSlice";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import LogoutButton from "@/components/main/LogoutButton";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const resp = await loginUser({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setUser(resp.user));
      localStorage.setItem("user", JSON.stringify(resp.user));
      setSuccess("Login successful!");
      setError(null);
      setFormData({ email: "", password: "" });
    } catch (error) {
      setError((error as Error)?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[440px] mx-auto px-[38px] py-[74px] mt-20 bg-bgs rounded-[10px]">
      <h1 className="text-2xl ml-[41px] font-bold mb-[30px]">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-[22px]">
        <div className="flex  gap-[14px]">
          <Image
            src="/icons/email.svg"
            alt=""
            width={500}
            height={500}
            className="w-[28px]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-full border-mo focus:outline-mo"
          />
        </div>

        <div className="flex  gap-[14px]">
          <Image
            src="/icons/password.svg"
            alt=""
            width={500}
            height={500}
            className="w-[28px]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-full border-mo focus:outline-mo"
          />
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className={`w-[120px] h-[44px] ml-[41px] mt-[6px] rounded-full text-white ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-mo hover:bg-mo-light"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : success ? "Logged in!" : "Login"}
          </button>
          {error && <p className="text-red-600 ml-[16px]">{error}</p>}
          {success && <p className="text-green-600 ml-[16px]">{success}</p>}
        </div>
      </form>
      <p className="mt-[40px] ml-[41px]">
        Not registered?{" "}
        <Link href="/register" className="text-mo font-semibold ml-[4px]">
          Register
        </Link>
      </p>
      <LogoutButton />
    </div>
  );
}
