"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { trackSearch } from "@/lib/analytics";
import { useLang } from "@/app/context/LanguageContext";
import { cityToCountryMap } from "@/lib/cityToCountryMap";

// forcedLang ekledik ki Google botu için sunucudan dil gönderilebilsin
export default function HomeSearch({ forcedLang }: { forcedLang?: string }) {
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(false);

  const router = useRouter();
  const { lang: contextLang } = useLang();

  // Öncelik sunucudan gelen dilde, yoksa context'i kullan
  const activeLang = forcedLang || contextLang || "tr";

  // 🌍 DİL SÖZLÜĞÜ (activeLang'e bağlandı)
  const t = {
    tr: {
      placeholder: "Şehir, mekan veya etkinlik ara...",
      highlightPlaceholder: "Hangi şehirde ne arıyorsunuz?",
      helper: 'İpucu: "Konya\'da gezilecek yerler" yazabilirsin.',
    },
    en: {
      placeholder: "Search city, place or event...",
      highlightPlaceholder: "What are you looking for and where?",
      helper: 'Tip: Type "Places to visit in London".',
    }
  }[activeLang as "tr" | "en"] || { placeholder: "Search...", helper: "" };

  // 🔥 TÜM ŞEHİRLER (OTOMATİK)
  const citySlugMap = useMemo(() => {
    const map: Record<string, { region: string; slug: string }> = {};

    Object.entries(cityToCountryMap).forEach(([city, country]) => {
      const upper = city.toLocaleUpperCase("tr-TR");

      map[upper] = {
        region: country,
        slug: city,
      };

      if (city.includes("-")) {
        const spaced = city.replace(/-/g, " ").toLocaleUpperCase("tr-TR");
        map[spaced] = {
          region: country,
          slug: city,
        };
      }
    });

    return map;
  }, []);

  // 🧠 QUERY NORMALIZE
  const normalizeQuery = (q: string) => {
    return q
      .toLocaleLowerCase("tr-TR")
      .replace(/['’](da|de|ta|te)/g, "")
      .replace(/(da|de|ta|te)\b/g, "")
      .replace(/['’](ya|ye|yu|yü)/g, "")
      .replace(/(ya|ye|yu|yü)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const findCityMatch = (query: string) => {
    const normalized = normalizeQuery(query);
    const upper = normalized.toLocaleUpperCase(
      activeLang === "tr" ? "tr-TR" : "en-US"
    );

    const foundKey = Object.keys(citySlugMap).find(city =>
      upper.includes(city)
    );

    return foundKey ? citySlugMap[foundKey] : null;
  };

  const isEventIntent = (query: string) => {
    const q = query.toLowerCase();
    const keywords = [
      "etkinlik", "konser", "festival", "tiyatro",
      "event", "concert", "show", "party"
    ];
    return keywords.some(k => q.includes(k));
  };

  const performSearch = () => {
    const query = search.trim();
    if (!query) return;

    trackSearch(query);

    const cityMatch = findCityMatch(query);
    const isEvent = isEventIntent(query);

    const prefix = activeLang === "en" ? "/en" : "";

    if (isEvent) {
      const cityParam = cityMatch ? cityMatch.slug : query;
      router.push(`${prefix}/aktiviteler?city=${encodeURIComponent(cityParam)}`);
    } else if (cityMatch) {
      router.push(`${prefix}/kesfet/${cityMatch.region}/${cityMatch.slug}`);
    } else {
      router.push(`${prefix}/kesfet?q=${encodeURIComponent(query)}`);
    }

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
    <div className="mb-6">
      <div className={`p-[2px] rounded-2xl transition-all duration-300 ${
        highlight
          ? "bg-yellow-400 scale-[1.02] shadow-[0_0_20px_rgba(255,200,0,0.8)]"
          : "bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400"
      }`}>
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

      <p className="mt-2 text-[11px] text-gray-400 px-2 italic opacity-80">
        {t.helper}
      </p>
    </div>
  );
}