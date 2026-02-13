"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";

type Place = {
  slug: string;
  name: { tr: string };
};

const formatCityName = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const allData = { turkey, europa, asia };
  const regions = Object.entries(allData);
  const searchLower = search.toLowerCase();

  const results: any[] = [];

  if (search.length >= 2) {
    regions.forEach(([region, cities]: [string, any]) => {
      Object.entries(cities).forEach(([citySlug, places]: [string, any]) => {
        const cityName = formatCityName(citySlug);

        places.forEach((place: Place) => {
          if (
            place.name.tr.toLowerCase().includes(searchLower) ||
            cityName.toLowerCase().includes(searchLower)
          ) {
            results.push({ region, citySlug, cityName, place });
          }
        });
      });
    });
  }

  return (
    <div className="mb-8 relative">
      <input
        type="text"
        placeholder="Şehir veya mekan ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && search.length >= 2) {
            e.preventDefault();
            router.push(`/kesfet?search=${encodeURIComponent(search)}`);
          }
        }}
        className="w-full border rounded-xl px-4 py-4 text-lg"
      />

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.slice(0, 15).map((item) => {
            const fullSlug = `${item.region}-${item.citySlug}-${item.place.slug}`;

            return (
              <Link
                key={fullSlug}
                href={`/kesfet/${item.region}/${item.citySlug}/${fullSlug}`}
                className="block px-4 py-3 hover:bg-gray-100"
              >
                <div className="font-medium">{item.place.name.tr}</div>
                <div className="text-sm text-gray-500">
                  {item.cityName} • {item.region.toUpperCase()}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
