"use client";

import { useMemo } from "react";
import Link from "next/link";
import exploreMeta from "@/data/explore-meta.json";
import { Sparkles, Map, Globe2 } from "lucide-react";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

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

export default function KesfetClient({ lang }: { lang: string }) {
  const isEn = lang === "en";

  const t = isEn ? {
    title: "Explore World",
    subTitle: "Thousands of spots, endless adventure.",
    city: "City",
    point: "Points",
    badge: "EXPLORE MODE",
    explore: "EXPLORE",
  } : {
    title: "Dünyayı Keşfet",
    subTitle: "Binlerce nokta, sınırsız macera.",
    city: "Şehir",
    point: "Nokta",
    badge: "KEŞİF MODU",
    explore: "KEŞFET",
  };

  const getLocalizedLink = (path: string) => isEn ? `/en${path}` : path;

  const allCountries = useMemo(() => Object.entries(exploreMeta), []);

  const getCountryName = (slug: string) => {
    return countryNames[slug as keyof typeof countryNames]?.[isEn ? "en" : "tr"] || slug.replace(/-/g, " ");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-48 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-blue-100">
            <Globe2 size={14} />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-gray-900 mb-8 tracking-tight uppercase">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
            {t.subTitle}
          </p>
        </div>
      </section>

      {/* 2. COUNTRY GRID */}
      <section className="container mx-auto px-6 -mt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {allCountries.map(([slug, data]: any, index) => (
            <Link
              key={slug}
              href={getLocalizedLink(`/kesfet/${slug}`)}
              className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {data.coverPath ? (
                  <img
                    src={getCloudinaryUrl(data.coverPath, 600)}
                    alt={getCountryName(slug)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading={index < 6 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center"><Map size={40} className="text-gray-300" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      {data.cityCount} {t.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t.explore}</p>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-none group-hover:text-blue-200 transition-colors">
                      {getCountryName(slug)}
                    </h2>
                  </div>
                  <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                    <span className="text-lg font-black leading-none">{data.placeCount}</span>
                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-80">{t.point}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FOOTER DECORATION */}
      <footer className="container mx-auto px-6 pb-20 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-10" />
        <div className="flex flex-col items-center gap-4">
          <Sparkles size={24} className="text-orange-500 opacity-20" />
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Waylero &copy; 2026</p>
        </div>
      </footer>
    </main>
  );
}