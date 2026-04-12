import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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

      // ✅ DOĞRU DIGITAL OCEAN HOST
      {
        protocol: "https",
        hostname: "ifyazilim.nyc3.digitaloceanspaces.com",
      },

      // 🔥 BUNU DA EKLE (cdn varyantı kullanıyorsan şart)
      {
        protocol: "https",
        hostname: "ifyazilim.nyc3.cdn.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;