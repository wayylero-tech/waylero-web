import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Wikimedia
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },

      // 🔥 Firebase Storage (senin hata buradan geliyordu)
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },

      // 🔥 BONUS (tüm googleapis future-proof)
      {
        protocol: "https",
        hostname: "**.googleapis.com",
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