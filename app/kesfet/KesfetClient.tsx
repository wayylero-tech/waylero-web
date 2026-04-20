"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import exploreMeta from "../data/explore-meta.json";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

// Cloudinary helper
const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

// Google Analytics click tracker
const trackClick = (type: string, label: string, destination?: string) => {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "click", {
    click_type: type,
    label,
    destination,
    transport_type: "beacon",
  });
};

// COUNTRY DICTIONARY
const countryNames: Record<string, { tr: string; en: string }> = {
  turkiye: { tr: "Türkiye", en: "Turkey" },
  amerika: { tr: "Amerika", en: "USA" },
  fransa: { tr: "Fransa", en: "France" },
  almanya: { tr: "Almanya", en: "Germany" },
  italya: { tr: "İtalya", en: "Italy" },
  ispanya: { tr: "İspanya", en: "Spain" },
  ingiltere: { tr: "İngiltere", en: "United Kingdom" },
  hollanda: { tr: "Hollanda", en: "Netherlands" },
  avusturya: { tr: "Avusturya", en: "Austria" },
  yunanistan: { tr: "Yunanistan", en: "Greece" },
  "cek-cumhuriyeti": { tr: "Çek Cumhuriyeti", en: "Czech Republic" },
  rusya: { tr: "Rusya", en: "Russia" },
  portekiz: { tr: "Portekiz", en: "Portugal" },
  romanya: { tr: "Romanya", en: "Romania" },
  danimarka: { tr: "Danimarka", en: "Denmark" },
  urdun: { tr: "Ürdün", en: "Jordan" },
  isvec: { tr: "İsveç", en: "Sweden" },
  norvec: { tr: "Norveç", en: "Norway" },
  isvicre: { tr: "İsviçre", en: "Switzerland" },
  endonezya: { tr: "Endonezya", en: "Indonesia" },
  irlanda: { tr: "İrlanda", en: "Ireland" },
  "bosna-hersek": { tr: "Bosna Hersek", en: "Bosnia and Herzegovina" },
  avustralya: { tr: "Avustralya", en: "Australia" },
  gurcistan: { tr: "Gürcistan", en: "Georgia" },
  iskocya: { tr: "İskoçya", en: "Scotland" },
  galler: { tr: "Galler", en: "Wales" },
  malezya: { tr: "Malezya", en: "Malaysia" },
  cin: { tr: "Çin", en: "China" },
  hindistan: { tr: "Hindistan", en: "India" },
  tayland: { tr: "Tayland", en: "Thailand" },
  "guney-kore": { tr: "Güney Kore", en: "South Korea" },
  filipinler: { tr: "Filipinler", en: "Philippines" },
  japonya: { tr: "Japonya", en: "Japan" },
  "sri-lanka": { tr: "Sri Lanka", en: "Sri Lanka" },
  singapur: { tr: "Singapur", en: "Singapore" },
  umman: { tr: "Umman", en: "Oman" },
  "suudi-arabistan": { tr: "Suudi Arabistan", en: "Saudi Arabia" },
  misir: { tr: "Mısır", en: "Egypt" },
  belarus: { tr: "Belarus", en: "Belarus" },
  kktc: { tr: "KKTC", en: "Northern Cyprus" },
 bae: { tr: "BAE", en: "UAE" },
peru: { tr: "Peru", en: "Peru" },
};

type CountrySlug = keyof typeof countryNames;

export default function KesfetClient({ initialQuery, lang: propLang }: any) {
  const { lang: contextLang } = useLang();
  const lang = propLang || contextLang || "tr";
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");

  const t = {
    tr: {
      title: "Dünyayı Keşfet",
      subTitle: "Binlerce nokta, sınırsız macera.",
      city: "Şehir",
      point: "Nokta",
    },
    en: {
      title: "Explore World",
      subTitle: "Thousands of spots, endless adventure.",
      city: "City",
      point: "Points",
    },
  }[lang as "tr" | "en"];

  const getLocalizedLink = (path: string) =>
    lang === "tr" ? path : `/${lang}${path}`;

  // FILTERED COUNTRIES
 const filteredCountries = useMemo(() => {
  return Object.entries(exploreMeta).filter(([slug, data]: any) => {
    const name =
      countryNames[slug as keyof typeof countryNames]?.[
        lang as "tr" | "en"
      ] || slug.replace(/-/g, " ");

    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });
}, [searchQuery, lang]);

  // COUNTRY NAME HELPER
  const getCountryName = (slug: string) => {
  return (
    countryNames[slug as keyof typeof countryNames]?.[
      lang as "tr" | "en"
    ] || slug.replace(/-/g, " ")
  );
};
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <header className="mb-16">
  <p className="text-blue-600 font-bold tracking-widest text-sm mb-2">
    KEŞFET
  </p>

  <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4 italic">
    {t.title}
  </h1>

  <p className="text-xl text-gray-500 font-medium">{t.subTitle}</p>
</header>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filteredCountries.map(([slug, data]: any, index) => (
          <Link
            key={slug}
            href={getLocalizedLink(`/kesfet/${slug}`)}
            className="relative group block overflow-hidden rounded-2xl aspect-[3/4] shadow-lg bg-gray-200"
            onClick={() => trackClick("country", slug, `/kesfet/${slug}`)}
          >
            {/* IMAGE */}
            {data.coverPath ? (
              <img
                src={getCloudinaryUrl(data.coverPath, 500)}
                srcSet={`
                  ${getCloudinaryUrl(data.coverPath, 300)} 300w,
                  ${getCloudinaryUrl(data.coverPath, 500)} 500w,
                  ${getCloudinaryUrl(data.coverPath, 700)} 700w
                `}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                alt={`${slug} kapak`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading={index < 4 ? "eager" : "lazy"}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500 text-xs font-bold uppercase">
                Resim Yok
              </div>
            )}

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />

            {/* CONTENT */}
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <h2 className="text-white text-xl md:text-2xl font-black mb-2 drop-shadow-md tracking-tight">
                {getCountryName(slug)}
              </h2>

              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-lg rounded-md text-white text-[9px] font-bold uppercase border border-white/10">
                  {data.cityCount} {t.city}
                </span>
                <span className="px-2.5 py-1 bg-blue-600 rounded-md text-white text-[9px] font-bold uppercase">
                  {data.placeCount} {t.point}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}