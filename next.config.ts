import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
