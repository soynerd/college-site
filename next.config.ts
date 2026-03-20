import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: process.env.R2_PUBLIC_URL!.replace("https://", ""),
      }
    ],
  },
};

export default nextConfig;
