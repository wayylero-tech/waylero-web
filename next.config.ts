import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "ifyazilim.nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "ifyazilim.nyc3.cdn.digitaloceanspaces.com",
      },

      // ☁️ CLOUDINARY EKLENDİ
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;