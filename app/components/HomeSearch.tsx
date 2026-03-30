"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/app/context/LanguageContext";
// 🔥 Arama mantığını lib'den çekiyoruz
import { fuzzyMatch } from "@/lib/search"; 

import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";

type Place = {
  slug: string;
  name: Record<string, string>;
};

const formatCityName = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { lang } = useLang();

  const allData = { turkey, europa, asia };
  const regions = Object.entries(allData);

  const results: any[] = [];

  const t = {
    tr: "Şehir veya mekan ara...",
    en: "Search for city or place...",
    de: "Nach Stadt oder Ort suchen..."
  }[lang];

  if (search.length >= 2) {
    regions.forEach(([region, cities]: [string, any]) => {
      Object.entries(cities).forEach(([citySlug, places]: [string, any]) => {
        const cityName = formatCityName(citySlug);

        places.forEach((place: any) => {
          // 🔥 lib/search içindeki fuzzyMatch'i kullanarak her dile bakıyoruz
          const isMatch = 
            fuzzyMatch(place.name?.tr || "", search) || 
            fuzzyMatch(place.name?.en || "", search) || 
            fuzzyMatch(place.name?.de || "", search) ||
            fuzzyMatch(cityName, search);

          if (isMatch) {
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
        placeholder={t}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && search.length >= 2) {
            e.preventDefault();
            router.push(`/kesfet?search=${encodeURIComponent(search)}`);
          }
        }}
        className="w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
      />

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-2xl shadow-2xl max-h-96 overflow-y-auto border-gray-100">
          {results.slice(0, 15).map((item, i) => {
            const fullSlug = `${item.region}-${item.citySlug}-${item.place.slug}`;
            const displayName = item.place.name[lang] || item.place.name["tr"];

            return (
              <Link
                key={`${fullSlug}-${i}`}
                href={`/kesfet/${item.region}/${item.citySlug}/${item.place.slug}`}
                className="block px-6 py-4 hover:bg-blue-50 transition-colors border-b last:border-0 border-gray-50"
              >
                <div className="font-bold text-gray-900">{displayName}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <span>📍 {item.cityName}</span>
                  <span className="text-gray-300">•</span>
                  <span className="uppercase text-[10px] font-bold tracking-wider text-blue-600">{item.region}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}