import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
        pathname: "/**",
      },

      // ✅ YOUTUBE FIX
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/en/:path*",
        destination: "/:path*?lang=en",
      },
    ];
  },
};

export default nextConfig;