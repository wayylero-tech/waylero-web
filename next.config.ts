import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔥 EKLEMEN GEREKEN KISIM:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/en/:path*',
        destination: '/:path*?lang=en',
      },
    ];
  },
  // ... diğer kodlar
};

export default nextConfig;