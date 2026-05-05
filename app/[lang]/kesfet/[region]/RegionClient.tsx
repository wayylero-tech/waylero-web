"use client";

import { useMemo } from "react";
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify"; // Yolunu kendi projene göre kontrol et
import { Sparkles, MapPin, Globe, ChevronRight } from "lucide-react";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

// Şehir isimlerini Türkçeleştirme haritası
const cityNameMapTR: Record<string, string> = {
  istanbul: "İstanbul", ankara: "Ankara", izmir: "İzmir", antalya: "Antalya", muğla: "Muğla"
  // ...buraya lazım olanları eklersin
};

const formatCityName = (name: string, lang: string) => {
  const normalized = name.replace(/-/g, " ").toLowerCase();
  if (lang === "tr") {
    return cityNameMapTR[normalized] || normalized.replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return normalized.replace(/[ğüşıöç]/g, (m) => ({'ğ':'g','ü':'u','ş':'s','ı':'i','ö':'o','ç':'c'}[m] || m))
                   .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function RegionClient({ region, lang, data, images }: any) {
  // ✅ useLang SİLİNDİ. Sadece dışarıdan (page.tsx'den) gelen 'lang' kullanılıyor.
  const isEn = lang === "en";
  
  const t = isEn ? {
    discoverTitle: "Explore",
    badge: "POPULAR CITIES",
    placeSuffix: "PLACES TO VISIT",
    exploreText: "Explore Now"
  } : {
    discoverTitle: "Keşfet",
    badge: "POPÜLER ŞEHİRLER",
    placeSuffix: "GEZİLECEK YER",
    exploreText: "Hemen İncele"
  };

  const countryCities = useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .map(([cityKey, places]: [string, any]) => {
        if (!places?.length) return null;
        
        const citySlug = slugify(cityKey);
        const cityImages = images[cityKey] || images[citySlug] || {};
        const firstPlace = places[0];
        
        const imageKey = firstPlace?.slug ? `${citySlug}-${slugify(firstPlace.slug)}` : "";
        const coverImage = cityImages[imageKey]?.[0] || cityImages[Object.keys(cityImages)[0]]?.[0];

        return {
          name: formatCityName(cityKey, lang),
          slug: citySlug,
          placeCount: places.length,
          coverImage
        };
      })
      .filter(Boolean);
  }, [data, images, lang]);

  const getLocalizedLink = (path: string) => isEn ? `/en${path}` : path;

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-48 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-blue-700 text-[10px] font-black uppercase rounded-full mb-8 border border-blue-100 shadow-sm">
            <Globe size={14} className="text-blue-500" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tight uppercase">
            {region.replace(/-/g, " ")}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            {isEn ? `Explore ${region}. Discover the most popular places.` : `${region}’i keşfedin. En popüler yerleri görün.`}
          </p>
        </div>
      </section>

      {/* 2. CITY GRID */}
      <section className="container mx-auto px-6 -mt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {countryCities.map((city: any, index: number) => (
            <Link
              key={city.slug}
              href={getLocalizedLink(`/kesfet/${region}/${city.slug}`)}
              className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {city.coverImage ? (
                  <img
                    src={getCloudinaryUrl(city.coverImage, 600)}
                    alt={city.name}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <MapPin size={40} className="text-gray-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70" />
                <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-2xl text-[10px] font-black text-gray-900 border border-white">
                  {city.placeCount} {t.placeSuffix}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t.discoverTitle}</p>
                <h3 className="text-4xl font-serif font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                  {city.name}
                </h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{t.exploreText}</span>
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}