"use client";

import { useState } from "react";
import { useRegisterUserMutation } from "@/store/apiSlices/userApiSlice";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { showToast } from "@/components/ToastNotifications";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [registerUser] = useRegisterUserMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setUser(resp.user));
      localStorage.setItem("user", JSON.stringify(resp.user));

      setSuccess("Registration successful!");
      setError(null);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      showToast("success", "🚀 You’ve launched into a shopping paradise! 🚀");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError((err as Error)?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center ">
      <div className="w-full sm:w-[540px] px-[10px] sm:px-[38px] py-[74px] mt-20 rounded-[10px] ">
        <h1 className="text-2xl ml-[41px] font-bold mb-[30px]">Register</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-[22px]"
        >
          <div className="flex  gap-[14px]">
            <Image
              src="/icons/person.svg"
              alt=""
              width={500}
              height={500}
              className="w-[28px]"
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-full border-mo focus:outline-mo"
            />
          </div>
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
          <div className="flex">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 ml-[41px] border rounded-full border-mo focus:outline-mo"
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
              {isLoading
                ? "Registering..."
                : success
                  ? "Registered!"
                  : "Register"}
            </button>
            {error && <p className="text-red-600 ml-[16px]">{error}</p>}
            {success && <p className="text-green-600 ml-[16px]">{success}</p>}
          </div>
        </form>
        <p className="mt-[40px] ml-[41px]">
          Already registered?{" "}
          <Link href="/login" className="text-mo font-semibold ml-[4px]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
