import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ayasofya",
        destination: "/kesfet/turkey/istanbul/ayasofya",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
