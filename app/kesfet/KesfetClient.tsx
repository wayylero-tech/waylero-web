"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import exploreMeta from "../data/explore-meta.json";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

// Vercel kotasını harcamayan, direkt Cloudinary'den çeken fonksiyon
const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  // q_auto:eco -> Çok daha az yer kaplar, f_auto -> WebP/Avif formatına çevirir
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

const trackClick = (type: string, label: string, destination?: string) => {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "click", {
    click_type: type,
    label,
    destination,
    transport_type: "beacon",
  });
};;

export default function KesfetClient({ initialQuery, lang: propLang }: any) {
  const { lang: contextLang } = useLang();
  const lang = propLang || contextLang || "tr";
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");

  const t = {
    tr: { title: "Dünyayı Keşfet", subTitle: "Binlerce nokta, sınırsız macera.", city: "Şehir", point: "Nokta" },
    en: { title: "Explore World", subTitle: "Thousands of spots, endless adventure.", city: "City", point: "Points" }
  }[lang as "tr" | "en"] || { title: "Dünyayı Keşfet", subTitle: "Binlerce nokta.", city: "Şehir", point: "Nokta" };

  const getLocalizedLink = (path: string) => (lang === "tr" ? path : `/${lang}${path}`);

  const filteredCountries = useMemo(() => {
    return Object.entries(exploreMeta).filter(([name]) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <header className="mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4 italic">
          {t.title}
        </h1>
        <p className="text-xl text-gray-500 font-medium">{t.subTitle}</p>
      </header>

     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {filteredCountries.map(([slug, data]: any, index) => (
    <Link
      key={slug}
      href={getLocalizedLink(`/kesfet/${slug}`)}
      // aspect-[3/4] sayesinde kartlar dikey ve şık durur
      className="relative group block overflow-hidden rounded-2xl aspect-[3/4] shadow-lg bg-gray-200"
      onClick={() => trackClick("country", slug, `/kesfet/${slug}`)}
    >
      {data.coverPath ? (
        <img
          src={getCloudinaryUrl(data.coverPath, 500)}
          srcSet={`
            ${getCloudinaryUrl(data.coverPath, 300)} 300w,
            ${getCloudinaryUrl(data.coverPath, 500)} 500w,
            ${getCloudinaryUrl(data.coverPath, 700)} 700w
          `}
          // 4 sütunlu yapıda her resim ekranın yaklaşık %25'ini kaplar
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

      {/* Karartma katmanı */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />

      {/* Kart İçeriği */}
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <h2 className="text-white text-xl md:text-2xl font-black capitalize mb-2 drop-shadow-md tracking-tight">
          {slug.replace(/-/g, " ")}
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