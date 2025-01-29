import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com", "olcart-store.onrender.com"],
  },
};

export default nextConfig;
