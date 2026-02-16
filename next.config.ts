import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/aysofya",
        destination: "/kesfet/turkey/istanbul/aysofya",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
