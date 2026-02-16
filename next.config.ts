import type { NextConfig } from "next";
import turkey from "./app/data/turkey.json";
import asia from "./app/data/asia.json";
import europa from "./app/data/europa.json";

type RegionData = {
  [city: string]: {
    slug: string;
  }[];
};

function generateRedirects(data: RegionData, region: string) {
  const redirects = [];

  for (const rawCity in data) {
    const city = rawCity.trim().toLowerCase(); // 🔥 otomatik temizleme
    const places = data[rawCity];

    for (const place of places) {
      redirects.push({
        source: `/${place.slug}`,
        destination: `/kesfet/${region}/${city}/${place.slug}`,
        permanent: true,
      });
    }
  }

  return redirects;
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...generateRedirects(turkey as RegionData, "turkey"),
      ...generateRedirects(asia as RegionData, "asia"),
      ...generateRedirects(europa as RegionData, "europa"),
    ];
  },
};

export default nextConfig;
