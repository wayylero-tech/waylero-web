"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { cleanSearchQuery, fuzzyMatch, normalizeText } from "@/lib/search";
import { trackSearch, trackPlaceClick } from "@/lib/analytics";
import { useLang } from "../context/LanguageContext";

// Veri İmportları
import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";
import turkeyImages from "../data/images/turkey.json";
import europaImages from "../data/images/europa.json";
import asiaImages from "../data/images/asia.json";

// 🛡️ Middleware'den gelen dev liste (Hızlı erişim için dışarıda tanımladık)
const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "istanbul": "turkiye", "ankara": "turkiye", "antalya": "turkiye", "izmir": "turkiye",
  "berlin": "almanya", "munih": "almanya", "frankfurt": "almanya", "koln": "almanya",
  "paris": "fransa", "lyon": "fransa", "strazburg": "fransa",
  "roma": "italya", "milano": "italya", "venedik": "italya", "floransa": "italya",
  "madrid": "ispanya", "barselona": "ispanya", "sevilla": "ispanya",
  "londra": "ingiltere", "manchester": "ingiltere", "liverpool": "ingiltere",
  "rotterdam": "hollanda", "amsterdam": "hollanda", "lahey": "hollanda", "eindhoven": "hollanda",
  "viyana": "avusturya", "salzburg": "avusturya",
  "kopenhag": "danimarka", "billund": "danimarka",
  "stockholm": "isvec", "oslo": "norvec", "zurich": "isvicre", "helsinki": "finlandiya",
  "atina": "yunanistan", "santorini": "yunanistan", "selanik": "yunanistan",
  "lizbon": "portekiz", "porto": "portekiz", "prague": "cek-cumhuriyeti", "budapest": "macaristan",
  "bratislava": "slovakya", "edinburgh": "iskocya", "bukres": "romanya",
  "delhi": "hindistan", "mumbai": "hindistan", "bangkok": "tayland", "singapur": "singapur",
  "seul": "guney-kore", "dubai": "bae", "tokyo": "japonya", "kyoto": "japonya", "beijing": "cin",
  "bali": "endonezya", "mekke": "suudi-arabistan", "medine": "suudi-arabistan"
  // NOT: Middleware'deki listenin tamamını buraya ekleyebilirsin kanka.
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
  const [search, setSearch] = useState(queryParam);
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
      slogan: ["Waylero ile", "Keşfet", "Planla", "Paylaş"],
      placeholder: "Şehir, mekan veya deneyim ara...",
      helper: 'İpucu: "Paris\'te gezilecek yerler" gibi doğal cümlelerle arayabilirsin.',
      noImage: "Görsel Hazırlanıyor"
    },
    en: {
      title: "Explore",
      subTitle: "Don't wonder where to go. It's all here.",
      stats: ["🌍 30+ Countries", "🏙️ 300+ Cities", "📍 2000+ Spots"],
      slogan: ["Explore with Waylero", "Explore", "Plan", "Share"],
      placeholder: "Search city, place or experience...",
      helper: 'Tip: You can search with natural phrases like "Places to visit in Paris".',
      noImage: "Image Coming Soon"
    }
  }[lang as "tr" | "en"] || {
    title: "Explore",
    subTitle: "Don't wonder where to go. It's all here.",
    stats: ["🌍 30+ Countries", "🏙️ 300+ Cities", "📍 2000+ Spots"],
    slogan: ["Explore with Waylero", "Explore", "Plan", "Share"],
    placeholder: "Search...",
    helper: "",
    noImage: "Image Coming Soon"
  };

  useEffect(() => {
    const cleaned = cleanSearchQuery(queryParam);
    setSearch(queryParam);
    setSubmittedSearch(cleaned);
  }, [queryParam]);

  const allData: any = { turkey, europa, asia };
  const allImages: any = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      trackSearch(search);
      router.push(getLocalizedLink(`/kesfet?q=${encodeURIComponent(search)}`));
    }
  };

  const clearSearch = () => {
    setSearch("");
    router.push(getLocalizedLink("/kesfet"));
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 font-sans">
      {/* HEADER + INFO BLOCK (Değişmedi) */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">{t.subTitle}</p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex gap-2 flex-wrap md:justify-end">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow">{t.stats[0]}</div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow">{t.stats[1]}</div>
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow">{t.stats[2]}</div>
          </div>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="mb-10">
        <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 shadow-md">
          <div className="flex items-center bg-white rounded-[14px] px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder={t.placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent focus:outline-none text-gray-700"
            />
            {search && (
              <button onClick={clearSearch} className="p-1 hover:bg-gray-100 rounded-full ml-2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
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
                    
                    // 🔥 LİNK DÜZELTME MANTIĞI: Middleware listesinden ülke bulma
                    let countryPath = region === "turkey" ? "turkiye" : region;
                    const foundCountry = cityToCountryMap[cleanCity] || cityToCountryMap[cleanCity.replace(/-/g, "")];
                    if (foundCountry) {
                      countryPath = foundCountry;
                    }

                    const targetImageKey = `${cleanCity}-${slugifyForImages(place.slug)}`;
                    const cityGroup = allImages[region]?.[citySlug] || allImages[region]?.[cleanCity];
                    const coverImage = cityGroup?.[targetImageKey]?.[0] || cityGroup?.[place.slug]?.[0] || null;

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