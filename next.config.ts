import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.0.182:3000",
    "192.168.0.182",
    "localhost",
    "127.0.0.1"
  ]
};

export default nextConfig;
