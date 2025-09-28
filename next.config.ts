import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ion.jamesallen.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.vrai.com',
      },
      {
        protocol: 'https',
        hostname: 'madebymonah.com',
      },
      {
        protocol: 'https',
        hostname: 'boxedupon.com',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
