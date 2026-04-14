"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import { cleanSearchQuery, fuzzyMatch, normalizeText } from "@/lib/search";
import Image from "next/image";


// Veri importları
import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";
import turkeyImages from "../data/images/turkey.json";
import europaImages from "../data/images/europa.json";
import asiaImages from "../data/images/asia.json";
import { cityToCountryMap } from "@/lib/cityToCountryMap";
import { countryToRegionMap } from "@/lib/countryToRegionMap";


  

const slugCache = new Map<string, string>();

const slugify = (text: string) => {
  if (!text) return "";

  if (slugCache.has(text)) return slugCache.get(text)!;

  const trMap: any = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "C", Ğ: "G", İ: "I", I: "i", Ö: "O", Ş: "S", Ü: "U"
  };

  const result = text
    .toString()
    .replace(/[çğışüöÇĞİŞÜÖ]/g, (m) => trMap[m])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

  slugCache.set(text, result);
  return result;
};
// Yer Kartı Bileşeni (Arama Sonuçları İçin)
const PlaceCard = memo(({ place, cityKey, region, lang, allImages, getLocalizedLink }: any) => {
  const cleanCitySlug = slugify(cityKey);
  const cleanPlaceSlug = slugify(place.slug);
  
  const targetImageKey = `${cleanCitySlug}-${cleanPlaceSlug}`;
  const regionImages = allImages[region]?.[cityKey] || {};
  const coverImage = regionImages[targetImageKey]?.[0] || regionImages[place.slug]?.[0];

  const countryPath = region === "turkey" ? "turkiye" : (region === "europa" ? "avrupa" : region);

  return (
    <Link href={getLocalizedLink(`/kesfet/${countryPath}/${cleanCitySlug}/${cleanPlaceSlug}`)} className="group block">
      <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 mb-3 relative">
        
        {coverImage ? (
          <Image
            src={coverImage}
            alt={place.name.tr}
            fill
            loading="lazy" // 🔥 KRİTİK
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-2xl bg-gray-50">📍</div>
        )}

      </div>

      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 px-1 text-sm md:text-base">
        {place.name[lang] || place.name.tr}
      </h3>
    </Link>
  );
});

PlaceCard.displayName = "PlaceCard";

// 1. Props interface'ini ekliyoruz ki TypeScript kızmasın
interface KesfetClientProps {
  initialQuery: string;
  lang: string; // 👈 Burası kritik
}

// 2. Fonksiyonu bu props'u alacak şekilde güncelliyoruz
export default function KesfetClient({ initialQuery, lang: propLang }: KesfetClientProps) {
  // Senin mevcut useLang() hook'un context'ten alıyor, 
  // ama server'dan gelen lang değerini kullanmak SEO için daha tutarlı olur.
  const { lang: contextLang } = useLang(); 
  
  // Eğer propLang varsa onu kullan, yoksa context'tekine bak
  const lang = propLang || contextLang || "tr";

  const [submittedSearch, setSubmittedSearch] = useState(initialQuery);
  // ... (Geri kalan tüm kodun aynı kalabilir)

  const allData = useMemo(() => ({ turkey, europa, asia }), []);
  const allRegions = useMemo(() => {
  return {
    turkey,
    europa,
    asia
  };
}, []);
  const allImages = useMemo(() => ({ turkey: turkeyImages, europa: europaImages, asia: asiaImages }), []);
  
  const getLocalizedLink = (path: string) => (lang === "tr" ? path : `/${lang}${path.startsWith("/") ? path : `/${path}`}`);

  useEffect(() => {
    setSubmittedSearch(cleanSearchQuery(initialQuery));
  }, [initialQuery]);

  // 🌍 DİL SÖZLÜĞÜ (Eksik olan her şeyi buraya ekledik)
  const t = {
    tr: { 
      title: "Dünyayı Keşfet", 
      subTitle: "Binlerce nokta, sınırsız macera.", 
      countrySuffix: "Gezilecek Yerler",
      cityLabel: "ŞEHİR",
      pointLabel: "NOKTA",
      regions: { turkey: "Türkiye", europa: "Avrupa", asia: "Asya" },
      loading: "Yükleniyor...",
      noResult: "Sonuç bulunamadı."
    },
    en: { 
      title: "Explore the World", 
      subTitle: "Thousands of spots, endless adventure.", 
      countrySuffix: "Travel Guide",
      cityLabel: "CITY",
      pointLabel: "POINTS",
      regions: { turkey: "Turkey", europa: "Europe", asia: "Asia" },
      loading: "Loading...",
      noResult: "No results found."
    }
  }[lang as "tr" | "en"];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {!submittedSearch && (
        <div className="mb-20">
          <div className="max-w-2xl mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">{t.title}</h1>
            <p className="text-xl text-gray-500 font-medium">{t.subTitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(countryToRegionMap).map(([countrySlug, regionKey], index) => {
              const dataSource = regionKey === "turkey" ? turkey : regionKey === "europa" ? europa : asia;
              const citiesOfCountry = Object.entries(dataSource).filter(([cityKey]) => {
                const citySlug = slugify(cityKey);
                return cityToCountryMap[citySlug] === countrySlug;
              });

              if (citiesOfCountry.length === 0) return null;

              const cityCount = citiesOfCountry.length;
              const placeCount = citiesOfCountry.reduce((total, [, places]) => total + (places as any[]).length, 0);

              // Resim Bulma Mantığı
              const firstCityKey = citiesOfCountry[0][0];
              const firstCitySlug = slugify(firstCityKey);
              const firstPlace = (citiesOfCountry[0][1] as any[])[0];
              const regionImages = (allImages as any)[regionKey]?.[firstCityKey] || {};
              const imageKey = `${firstCitySlug}-${slugify(firstPlace.slug)}`;
              const countryCoverImage = regionImages[imageKey]?.[0] || regionImages[firstPlace.slug]?.[0];

              return (
                <Link key={countrySlug} href={getLocalizedLink(`/kesfet/${countrySlug}`)} className="group relative h-80 w-full overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-100 block">
                 {countryCoverImage ? (
  <Image
  src={countryCoverImage}
  alt={countrySlug}
  fill
  priority={index < 1} // SADECE İLKİ
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover group-hover:scale-110 transition-transform duration-700"
/>
) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-6xl">🌍</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-white text-3xl font-black capitalize mb-1">
                      {countrySlug.replace(/-/g, " ")}
                    </h3>
                    {/* ✅ DİNAMİK ETİKETLER (CITY / ŞEHİR) */}
                    <p className="text-blue-300 font-extrabold text-xs uppercase tracking-widest">
                      {cityCount} {t.cityLabel} • {placeCount} {t.pointLabel}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Arama Sonuçları Alanı */}
      {submittedSearch && (
        <div className="space-y-28">
          {Object.entries(allRegions).map(([region, cities]: [string, any]) =>
            Object.entries(cities).map(([cityKey, places]: [string, any]) => {
              const searchQuery = submittedSearch;
const searchCity = normalizeText(cityKey);

const filtered = (places as any[]).filter(p => {
  const placeName = p.name?.tr || "";

  return (
    fuzzyMatch(searchCity, searchQuery) ||
    fuzzyMatch(normalizeText(placeName), searchQuery)
  );
});

              if (filtered.length === 0) return null;

              return (
                <section key={cityKey} className="scroll-mt-10">
                  <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{cityKey}</h2>
                      {/* ✅ DİNAMİK BÖLGE İSİMLERİ (Europe / Avrupa) */}
                      <p className="text-blue-500 font-bold text-xs uppercase mt-2 tracking-widest">
                        {(t.regions as any)[region]}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {filtered.slice(0, 12).map((place: any, index: number) => (
                      <PlaceCard 
                        key={`${cityKey}-${place.slug}-${index}`}
                        place={place}
                        cityKey={cityKey}
                        region={region}
                        lang={lang}
                        allImages={allImages}
                        getLocalizedLink={getLocalizedLink}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      )}
    </main>
  );
}