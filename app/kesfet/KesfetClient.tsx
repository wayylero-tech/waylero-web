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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCountries.map(([slug, data]: any, index) => (
          <Link
            key={slug}
            href={getLocalizedLink(`/kesfet/${slug}`)}
            aria-label={`${slug.replace(/-/g, " ")} keşfet`}
            className="group relative aspect-[3/4] w-full rounded-[3rem] overflow-hidden bg-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            {data.coverPath ? (
              <img
                // Varsayılan resim (Masaüstü için makul boy)
                src={getCloudinaryUrl(data.coverPath, 600)}
                // MOBİL/MASAÜSTÜ AYRIMI BURADA:
                // Tarayıcı ekrana göre en küçük dosyayı Cloudinary'den çeker.
                srcSet={`
                  ${getCloudinaryUrl(data.coverPath, 400)} 400w,
                  ${getCloudinaryUrl(data.coverPath, 600)} 600w,
                  ${getCloudinaryUrl(data.coverPath, 800)} 800w
                `}
                // Ekranda kapladığı genişlik tahmini
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={`${slug} kapak`}
                // CLS'yi önlemek için oran veriyoruz (Zorunlu)
                width={400}
                height={533}
                loading={index < 2 ? "eager" : "lazy"}
                // @ts-ignore
                fetchPriority={index < 2 ? "high" : "auto"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500 uppercase font-bold tracking-widest">
                Resim Hazırlanıyor
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent opacity-95 transition-opacity" />

            <div className="absolute bottom-10 left-10 right-10 z-10">
              <h2 className="text-white text-4xl font-black capitalize mb-3 drop-shadow-2xl tracking-tight">
                {slug.replace(/-/g, " ")}
              </h2>
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-white text-[11px] font-black uppercase tracking-[0.1em] border border-white/30">
                  {data.cityCount} {t.city}
                </span>
                <span className="px-4 py-1.5 bg-blue-600 rounded-full text-white text-[11px] font-black uppercase tracking-[0.1em]">
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