import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.20', 'localhost'],
  async redirects() {
    return [
      { source: '/shop', destination: '/products', permanent: true },
      { source: '/shop/:path*', destination: '/products', permanent: true },
    ];
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
