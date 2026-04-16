"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLang } from "../../context/LanguageContext";

// DATA
import turkey from "../../data/turkey.json";
import europa from "../../data/europa.json";
import asia from "../../data/asia.json";
import turkeyImages from "../../data/images/turkey.json";
import europaImages from "../../data/images/europa.json";
import asiaImages from "../../data/images/asia.json";

// MAPS & UTILS
import { cityToCountryMap } from "@/lib/cityToCountryMap";
import { countryToRegionMap } from "@/lib/countryToRegionMap";
import { slugify } from "@/lib/utils/slugify";

// ✅ Cloudinary Yapılandırması
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  // Path temizleme ve optimizasyon parametreleri: f_auto (format), q_auto (kalite), w (genişlik)
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

type RegionKey = "turkey" | "europa" | "asia";

interface RegionClientProps {
  region: string;
  lang: string;
}

export default function RegionClient({ region, lang: propLang }: RegionClientProps) {
  const { lang: contextLang } = useLang();
  const lang = propLang || contextLang || "tr";

  const isCountry = !!countryToRegionMap[region];
  const targetRegion = isCountry ? countryToRegionMap[region] : region;

  const allData: Record<RegionKey, any> = useMemo(() => ({
    turkey,
    europa,
    asia
  }), []);

  const allImages: Record<RegionKey, any> = useMemo(() => ({
    turkey: turkeyImages,
    europa: europaImages,
    asia: asiaImages
  }), []);

  const dataKey =
    targetRegion === "turkiye" || targetRegion === "turkey"
      ? "turkey"
      : targetRegion;

  const safeDataKey = dataKey as RegionKey;
  const dataSource = allData[safeDataKey] || {};

  const t = {
    tr: {
      discoverTitle: "Keşfedin",
      countryDesc: "Bu ülkedeki en popüler şehirleri keşfedin.",
      regionDesc: "Bölgedeki şehirler.",
      placeSuffix: "GEZİLECEK YER",
      fallbackCity: "Şehir"
    },
    en: {
      discoverTitle: "Explore",
      countryDesc: "Explore the most popular cities in this country.",
      regionDesc: "Cities in this region.",
      placeSuffix: "PLACES TO VISIT",
      fallbackCity: "City"
    }
  }[lang as "tr" | "en"];

  const countryCities = useMemo(() => {
    return Object.entries(dataSource)
      .filter(([cityKey]) => {
        const citySlug = slugify(cityKey);
        return isCountry ? cityToCountryMap[citySlug] === region : true;
      })
      .map(([cityKey, places]: [string, any]) => {
        if (!places?.length) return null;

        const citySlug = slugify(cityKey);
        const regionImages = allImages[safeDataKey]?.[cityKey] || {};

        const firstPlace = places[0];
        const imageKey = `${citySlug}-${slugify(firstPlace.slug)}`;

        const coverImage =
          regionImages[imageKey]?.[0] ||
          regionImages[firstPlace.slug]?.[0];

        return {
          name: cityKey,
          slug: citySlug,
          placeCount: places.length,
          coverImage
        };
      })
      .filter(Boolean);
  }, [region, isCountry, dataSource, safeDataKey, allImages]);

  const getLocalizedLink = (path: string) =>
    lang === "tr"
      ? path
      : `/${lang}${path.startsWith("/") ? path : `/${path}`}`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans">
      
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl font-black capitalize text-gray-900 drop-shadow-sm flex items-center gap-4">
          {region.replace(/-/g, " ")}
          <span className="text-blue-600 text-3xl opacity-50">
            / {t.discoverTitle}
          </span>
        </h1>

        <p className="text-gray-500 mt-3 text-lg font-medium">
          {isCountry ? t.countryDesc : t.regionDesc}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {countryCities.map((city: any, index: number) => (
          <Link
            key={city.slug}
            href={getLocalizedLink(`/kesfet/${targetRegion}/${city.slug}`)}
            prefetch={false}
            className="group relative h-96 w-full overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-200 block"
          >
            {city.coverImage ? (
              <img
                // ✅ Cloudinary URL'si burada oluşturuluyor (600px yeterli grid için)
                src={getCloudinaryUrl(city.coverImage, 600)}
                alt={`${city.name} ${t.fallbackCity}`}
                loading={index < 3 ? "eager" : "lazy"}
                // ✅ İlk 3 resim için yüksek öncelik
                fetchPriority={index < 3 ? "high" : "low"}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 animate-pulse" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-white text-3xl font-black mb-1">
                {city.name}
              </h3>

              <p className="text-blue-400 font-extrabold tracking-widest text-xs uppercase">
                {city.placeCount} {t.placeSuffix}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}