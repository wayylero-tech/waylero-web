"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { trackSearch } from "@/lib/analytics";
import { cityToCountryMap } from "@/lib/cityToCountryMap";
import { normalizeText, cleanSearchQuery, fuzzyMatch } from "@/lib/search";
import globalPlaces from "@//data/globalPlaces.json";

export default function HomeSearch({ forcedLang }: { forcedLang?: string }) {
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [mapPlace, setMapPlace] = useState<any | null>(null);

  const router = useRouter();

const activeLang = forcedLang === "en" ? "en" : "tr";

  const t = {
    tr: {
      placeholder: "Şehir, mekan veya etkinlik ara...",
      highlightPlaceholder: "Hangi şehirde ne arıyorsunuz?",
      helper: 'İpucu: "Mevlana nasıl gidilir?" veya "Antalya konser"',
    },
    en: {
      placeholder: "Search city, place or event...",
      highlightPlaceholder: "What are you looking for and where?",
      helper: 'Tip: Try "How to go to Maiden Tower?" or "London events"',
    },
  }[activeLang as "tr" | "en"];

  const countryMap: Record<string, string[]> = {
   turkiye: ["turkey", "turkiye", "türkiye"],
  amerika: ["usa", "united states", "america", "amerika"],
  fransa: ["france", "fransa"],
  almanya: ["germany", "almanya"],
  italya: ["italy", "italya"],
  ispanya: ["spain", "ispanya"],
  ingiltere: ["uk", "england", "united kingdom", "britain", "ingiltere"],
  hollanda: ["netherlands", "holland", "hollanda"],
  avusturya: ["austria", "avusturya"],
  yunanistan: ["greece", "yunanistan"],
  "cek-cumhuriyeti": ["czech republic", "czechia", "cek cumhuriyeti"],
  rusya: ["russia", "rusya"],
  portekiz: ["portugal", "portekiz"],
  romanya: ["romania", "romanya"],
  danimarka: ["denmark", "danimarka"],
  urdun: ["jordan", "urdun", "ürdün"],
  isvec: ["sweden", "isvec", "isveç"],
  norvec: ["norway", "norvec", "norveç"],
  isvicre: ["switzerland", "isvicre", "isviçre"],
  endonezya: ["indonesia", "endonezya"],
  irlanda: ["ireland", "irlanda"],
  "bosna-hersek": ["bosnia and herzegovina", "bosnia", "bosna hersek"],
  avustralya: ["australia", "avustralya"],
  gurcistan: ["georgia", "gurcistan"],
  iskocya: ["scotland", "iskocya", "iskoçya"],
  galler: ["wales", "galler"],
  malezya: ["malaysia", "malezya"],
  cin: ["china", "çin", "cin"],
  hindistan: ["india", "hindistan"],
  tayland: ["thailand", "tayland"],
  "guney-kore": ["south korea", "korea", "guney kore", "güney kore"],
  filipinler: ["philippines", "filipinler"],
  japonya: ["japan", "japonya"],
  "sri-lanka": ["sri lanka", "srilanka"],
  singapur: ["singapore", "singapur"],
  umman: ["oman", "umman"],
  "suudi-arabistan": ["saudi arabia", "suudi arabistan"],
  misir: ["egypt", "mısır", "misir"],
  belarus: ["belarus", "belarus"],
  kktc: ["northern cyprus", "cyprus north", "kktc"],
  bae: ["uae", "united arab emirates", "bae"],
  peru: ["peru"]
  };

  const locationData = useMemo(() => {
    const cityMap: Record<string, { region: string; slug: string }> = {};
    const countries = new Set<string>();

    Object.entries(cityToCountryMap).forEach(([city, country]) => {
      const normalizedCity = normalizeText(city);
      cityMap[normalizedCity] = {
        region: country.toLowerCase(),
        slug: city,
      };
      countries.add(normalizeText(country));
    });

    return { cityMap, countries: Array.from(countries) };
  }, []);

  const isEventIntent = (query: string) => {
    const q = query.toLowerCase();
    return ["etkinlik", "konser", "festival", "tiyatro", "event"].some((k) => q.includes(k));
  };

  const isNavigationIntent = (query: string) => {
    const q = normalizeText(query);
    return ["nasil gidilir", "yol tarifi", "nerede", "how to go"].some((k) => q.includes(k));
  };

  const getIntent = (query: string) => {
  const q = query.toLowerCase();

  if (["konser", "festival", "tiyatro", "etkinlik", "event"].some(k => q.includes(k))) {
    return "event";
  }

  if (["nasil gidilir", "yol tarifi", "how to go", "nerede"].some(k => q.includes(k))) {
    return "navigation";
  }

  if (["gezilecek", "visit", "place"].some(k => q.includes(k))) {
    return "place";
  }

  return "search";
};

  const performSearch = () => {
  const rawQuery = search.trim();
  if (!rawQuery) return;

  const intent = getIntent(rawQuery);

  window.gtag?.("event", "search", {
    search_term: rawQuery,
    intent: intent,
    language: activeLang,
    page_location: window.location.href,
  });

  const prefix = activeLang === "en" ? "/en" : "";
  const cleaned = cleanSearchQuery(rawQuery);
  const normalized = normalizeText(rawQuery);
  const fullQuery = `${normalized} ${cleaned}`;

  setMapPlace(null);

  // 🔥 EVENT CHECK (eski isEventIntent SİLİNDİ)
  if (intent === "event") {
    const cityKey = Object.keys(locationData.cityMap).find((c) =>
      fullQuery.includes(c)
    );

    const citySlug = cityKey
      ? locationData.cityMap[cityKey].slug
      : cleaned;

    router.push(
      `${prefix}/aktiviteler?city=${encodeURIComponent(citySlug)}`
    );

    setSearch("");
    return;
  }

  const cityKeys = Object.keys(locationData.cityMap);

  let cityMatch = cityKeys.find(
    (c) => c === cleaned || c === normalized
  );

  if (!cityMatch) {
    cityMatch = cityKeys.find((c) => fullQuery.includes(c));
  }

  if (cityMatch) {
    const city = locationData.cityMap[cityMatch];
    router.push(`${prefix}/kesfet/${city.region}/${city.slug}`);
    setSearch("");
    return;
  }


    const countryMatch = locationData.countries.find((c) => {
      const normC = normalizeText(c);
      return (
        fullQuery.includes(normC) ||
        normC.includes(cleaned) ||
        countryMap[normC]?.some((alias) => fullQuery.includes(alias))
      );
    });

    if (countryMatch) {
      router.push(`${prefix}/kesfet/${countryMatch.toLowerCase()}`);
      setSearch("");
      return;
    }

    const placeMatch = globalPlaces.find(
      (p) => fuzzyMatch(p.name_tr, rawQuery) || fuzzyMatch(p.name_en, rawQuery)
    );

    if (placeMatch) {
      if (isNavigationIntent(rawQuery)) {
        setMapPlace(placeMatch);
      } else {
        router.push(`${prefix}/kesfet/${placeMatch.country}/${placeMatch.city}/${placeMatch.slug}`);
      }
      setSearch("");
      return;
    }

    router.push(`${prefix}/kesfet?q=${encodeURIComponent(rawQuery)}`);
    setSearch("");
  };

  useEffect(() => {
    const handler = () => {
      setHighlight(true);
      document.getElementById("home-search-input")?.focus();
      setTimeout(() => setHighlight(false), 2000);
    };
    window.addEventListener("triggerSearchFocus", handler);
    return () => window.removeEventListener("triggerSearchFocus", handler);
  }, []);

  return (
    <div className="mb-6 relative">
      {/* 1. ARKA PLAN BLUR KATMANI (Yeşil çizdiğin yerler için) */}
      {mapPlace && (
        <div 
          className="fixed inset-0 z-[40] bg-white/30 backdrop-blur-md transition-all duration-500"
          onClick={() => setMapPlace(null)} 
        />
      )}

      {/* 2. SEARCH BAR (z-60 ile her şeyin üstünde ve net) */}
      <div
        className={`relative z-[60] p-[2px] rounded-2xl transition-all duration-300 ${
          highlight
            ? "bg-yellow-400 scale-[1.02] shadow-[0_0_20px_rgba(255,200,0,0.8)]"
            : "bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400"
        }`}
      >
        <div className="flex items-center bg-white rounded-[14px] px-4 py-3">
          <Search
            className="w-5 h-5 text-gray-400 mr-3 cursor-pointer"
            onClick={performSearch}
          />
          <input
            id="home-search-input"
            type="text"
            placeholder={highlight ? t.highlightPlaceholder : t.placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && performSearch()}
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 font-medium"
          />
        </div>
      </div>

        {/* 3. HARİTA PANELİ (z-50 - Blur'un üstünde, Input'un altında) */}
      {mapPlace && (
        <div className="absolute left-0 right-0 top-full mt-4 z-[50] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50/80 backdrop-blur-sm">
              <div>
                <h3 className="font-bold text-gray-900">Yol Tarifi</h3>
                <p className="text-xs text-gray-500 font-medium">{mapPlace.name_tr || mapPlace.name_en}</p>
              </div>
              <button 
                onClick={() => setMapPlace(null)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-all"
              >
                <span className="text-xl text-gray-500">×</span>
              </button>
            </div>

            {/* Harita */}
            <div className="w-full h-[380px] bg-slate-50">
              <iframe
                className="w-full h-full border-0"
                src={`https://maps.google.com/maps?q=${mapPlace.lat},${mapPlace.lng}&z=15&output=embed`}
                allowFullScreen
              />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-5 bg-white">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lokasyon</span>
                <span className="text-xs font-mono text-gray-600">{mapPlace.lat}, {mapPlace.lng}</span>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${mapPlace.lat},${mapPlace.lng}`, "_blank")}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95"
              >
                Haritada Aç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}