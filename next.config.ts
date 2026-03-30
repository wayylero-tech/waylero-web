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
    const city = rawCity.trim().toLowerCase();
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
  // 🔥 ADIM 1: Hayalet Katman (Rewrites) Ekleme
  // Bu ayar sayesinde mevcut URL yapın bozulmaz, sadece yeni diller eklenir.
  async rewrites() {
    return [
      {
        // Örn: waylero.com/en/kesfet/istanbul -> Arka planda: /kesfet/istanbul?lang=en
        source: '/en/:path*',
        destination: '/:path*?lang=en',
      },
      {
        // Örn: waylero.com/de/kesfet/berlin -> Arka planda: /kesfet/berlin?lang=de
        source: '/de/:path*',
        destination: '/:path*?lang=de',
      },
    ];
  },

  // Mevcut yönlendirmelerin (Hali hazırda indekslenmiş olanlar)
  async redirects() {
    return [
      ...generateRedirects(turkey as RegionData, "turkey"),
      ...generateRedirects(asia as RegionData, "asia"),
      ...generateRedirects(europa as RegionData, "europa"),
    ];
  },
};

export default nextConfig;