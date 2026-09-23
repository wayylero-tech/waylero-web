import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180,

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    optimizeCss: true,
    inlineCss: true, // <-- Bu satırı ekleyerek CSS'lerin harici yoldan engelleme yapmasını önleyebilirsin
  },
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;