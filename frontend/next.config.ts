import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
};

export default nextConfig;
