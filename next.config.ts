import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.20', 'localhost'],
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
