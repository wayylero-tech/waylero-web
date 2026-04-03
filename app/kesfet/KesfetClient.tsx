"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackSearch, trackPlaceClick } from "@/lib/analytics";
import { useLang } from "../context/LanguageContext";
import { cleanSearchQuery, fuzzyMatch, normalizeText } from "@/lib/search";

// Veri importları
import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";
import turkeyImages from "../data/images/turkey.json";
import europaImages from "../data/images/europa.json";
import asiaImages from "../data/images/asia.json";

// 🛡️ Middleware'den gelen dev liste (Hızlı erişim için dışarıda tanımladık)
const cityToCountryMap: Record<string, string> = {
  // ... (önceki map olduğu gibi kalsın)
};

const slugifyForImages = (text: string) => {
  const trMap: { [key: string]: string } = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u"
  };
  return text
    .toString()
    .replace(/[çğışüöÇĞİŞÜÖ]/g, (match) => trMap[match])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

export default function KesfetClient() {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("q") || "";
  const [submittedSearch, setSubmittedSearch] = useState("");

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  const t = {
    tr: {
      title: "Keşfet",
      subTitle: "Nereye gitsem diye düşünme. Hepsi burada.",
      stats: ["🌍 30+ Ülke", "🏙️ 300+ Şehir", "📍 2000+ Nokta"],
      noImage: "Görsel Hazırlanıyor"
    },
    en: {
      title: "Explore",
      subTitle: "Don't wonder where to go. It's all here.",
      stats: ["🌍 30+ Countries", "🏙️ 300+ Cities", "📍 2000+ Spots"],
      noImage: "Image Coming Soon"
    }
  }[lang as "tr" | "en"] || {
    title: "Explore",
    subTitle: "Don't wonder where to go. It's all here.",
    stats: ["🌍 30+ Countries", "🏙️ 300+ Cities", "📍 2000+ Spots"],
    noImage: "Image Coming Soon"
  };

  useEffect(() => {
    const cleaned = cleanSearchQuery(queryParam);
    setSubmittedSearch(cleaned);
  }, [queryParam]);

  const allData: any = { turkey, europa, asia };
  const allImages: any = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 font-sans">
      {/* HEADER + INFO BLOCK */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">{t.subTitle}</p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex gap-2 flex-wrap md:justify-end">
            {t.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow"
              >
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="space-y-12">
        {Object.entries(allData).map(([region, cities]: [string, any]) =>
          Object.entries(cities).map(([citySlug, places]: [string, any]) => {
            const filteredPlaces = (places as any[]).filter((place: any) => {
              if (!submittedSearch) return true;
              const cityTarget = normalizeText(citySlug.replace("-", " "));
              return (
                fuzzyMatch(cityTarget, submittedSearch) ||
                fuzzyMatch(normalizeText(place.name?.tr || ""), submittedSearch) ||
                fuzzyMatch(normalizeText(place.name?.en || ""), submittedSearch)
              );
            });

            if (filteredPlaces.length === 0) return null;

            return (
              <section key={`${region}-${citySlug}`} className="mb-12">
                <h2 className="text-xl font-bold mb-6 capitalize text-gray-700 flex items-center">
                  <span className="bg-gradient-to-b from-blue-500 to-purple-600 w-1.5 h-6 rounded-full mr-3"></span>
                  {citySlug.replace("-", " ")}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredPlaces.map((place: any, index: number) => {
                    const cleanCity = slugifyForImages(citySlug);

                    let countryPath = region === "turkey" ? "turkiye" : region;
                    const foundCountry =
                      cityToCountryMap[cleanCity] || cityToCountryMap[cleanCity.replace(/-/g, "")];
                    if (foundCountry) {
                      countryPath = foundCountry;
                    }

                    const targetImageKey = `${cleanCity}-${slugifyForImages(place.slug)}`;
                    const cityGroup =
                      allImages[region]?.[citySlug] || allImages[region]?.[cleanCity];
                    const coverImage =
                      cityGroup?.[targetImageKey]?.[0] ||
                      cityGroup?.[place.slug]?.[0] ||
                      null;

                    return (
                      <Link
                        key={`${region}-${citySlug}-${place.slug}-${index}`}
                        href={getLocalizedLink(`/kesfet/${countryPath}/${cleanCity}/${place.slug}`)}
                        onClick={() => trackPlaceClick(place.name.tr, citySlug)}
                        className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={place.name[lang] || place.name.tr}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="text-[10px] text-gray-300 font-bold uppercase">{t.noImage}</div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 text-sm md:text-base group-hover:text-blue-600 line-clamp-2">
                            {place.name[lang] || place.name.tr}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}