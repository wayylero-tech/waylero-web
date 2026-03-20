"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react"; // İkonlar eklendi
import { cleanSearchQuery, fuzzyMatch, normalizeText } from "@/lib/search";

// Veri İmportları
import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";
import turkeyImages from "../data/images/turkey.json";
import europaImages from "../data/images/europa.json";
import asiaImages from "../data/images/asia.json";

const slugifyForImages = (text: string) => {
  const trMap: { [key: string]: string } = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u"
  };
  return text.toString().replace(/[çğışüöÇĞİŞÜÖ]/g, (match) => trMap[match]).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
};

export default function KesfetClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("q") || "";
  const [search, setSearch] = useState(queryParam);
  const [submittedSearch, setSubmittedSearch] = useState("");

  useEffect(() => {
    const cleaned = cleanSearchQuery(queryParam);
    setSearch(queryParam);
    setSubmittedSearch(cleaned);
  }, [queryParam]);

  const allData: any = { turkey, europa, asia };
  const allImages: any = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/kesfet?q=${encodeURIComponent(search)}`);
    }
  };

  const clearSearch = () => {
    setSearch("");
    router.push("/kesfet");
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 font-sans">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Keşfet</h1>

      {/* 🔹 GRADYANLI ARAMA KUTUSU (HomeSearch ile aynı tasarım) */}
      <div className="mb-10">
        <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 shadow-md">
          <div className="flex items-center bg-white rounded-[14px] px-4 py-1">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Şehir veya mekan ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button 
                onClick={clearSearch}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(allData).map(([region, cities]: [string, any]) => 
          Object.entries(cities).map(([citySlug, places]: [string, any]) => {
            
            const filteredPlaces = (places as any[]).filter((place: any) => {
              if (!submittedSearch) return true;
              const cityTarget = normalizeText(citySlug.replace("-", " "));
              const placeTarget = normalizeText(place.name.tr);
              return fuzzyMatch(cityTarget, submittedSearch) || fuzzyMatch(placeTarget, submittedSearch);
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
                    const citySlugKey = slugifyForImages(citySlug);
                    const targetImageKey = `${citySlugKey}-${slugifyForImages(place.slug)}`;
                    const cityGroup = allImages[region]?.[citySlug] || allImages[region]?.[citySlugKey];
                    const coverImage = cityGroup?.[targetImageKey]?.[0] || null;

                    return (
                      <Link
                        key={`${region}-${citySlug}-${place.slug}-${index}`}
                        href={`/kesfet/${region}/${citySlug}/${place.slug}`}
                        className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={place.name.tr}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="text-[10px] text-gray-300 font-bold uppercase">Görsel Hazırlanıyor</div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 text-sm md:text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                            {place.name.tr}
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