"use client";

import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { Sparkles, MapPin, ChevronRight, Hotel, Ticket, Globe2 } from "lucide-react";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

// 🔥 Türkçe karakter uyumlu, her kelimenin baş harfini büyük yapan fonksiyon
const capitalizeCityName = (str: string) => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => {
      if (word.startsWith("i") || word.startsWith("İ")) {
        return "İ" + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export default function CityClient({ lang, region, city, cityPlaces, images }: any) {
  const isEn = lang === "en";

  const t = isEn ? {
    badge: "EXPLORE ROUTE",
    suffix2: "amazing spots to discover.",
    exploreBtn: "View Details",
    backBtn: "All Routes",
    hotelBadge: "Stay",
    hotelText: "Hotels in ",
    tourBadge: "Experience",
    tourText: "Tours in "
  } : {
    badge: "KEŞİF ROTASI",
    suffix2: "farklı deneyim sizi bekliyor.",
    exploreBtn: "Detayları Gör",
    backBtn: "Başka Rotalar",
    hotelBadge: "Konaklama",
    hotelText: "Otelleri",
    tourBadge: "Deneyim",
    tourText: "Turları"
  };

  const exploreBase = isEn ? "/en/kesfet" : "/kesfet";
  
  // ✅ Şehir ismi neresinden gelirse gelsin baş harfleri düzgünce büyütülüyor
  const actualCityKey = capitalizeCityName(cityPlaces?.[0]?.cityName || city);
  const cityImages = images[city] || images[slugify(city)] || {};

  // 🔥 Özel sayfası olan popüler şehirlerin listesi
  const availableFeatureCities = ["istanbul", "paris", "roma", "viyana", "dubai", "bangkok", "antalya"];
  
  const currentCitySlug = slugify(city);
  const hasSpecificPage = availableFeatureCities.includes(currentCitySlug);

  // Dinamik Link Yönetimi
  const hotelLink = hasSpecificPage 
    ? `/${lang}/hotels/${currentCitySlug}` 
    : `/${lang}/hotels`;

  const tourLink = hasSpecificPage 
    ? `/${lang}/etkinlikler/${currentCitySlug}` 
    : `/${lang}/etkinlikler`;

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-48 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <nav className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/80 backdrop-blur-md rounded-full mb-10 border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href={exploreBase} className="hover:text-blue-600 transition-colors">
              {isEn ? "EXPLORE" : "KEŞFET"}
            </Link>
            <ChevronRight size={12} />
            <Link href={`${exploreBase}/${region}`} className="hover:text-blue-600 transition-colors uppercase">
              {region.replace(/-/g, " ")}
            </Link>
            <ChevronRight size={12} />
            {/* ✅ Buradaki zoraki uppercase kaldırıldı, sadece baş harfi büyük geliyor */}
            <span className="text-blue-600 font-bold">{actualCityKey}</span>
          </nav>

          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-6 text-orange-600 bg-orange-50 px-4 py-1.5 rounded-xl border border-orange-100 shadow-sm">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.badge}</span>
            </div>
            {/* ✅ Buradaki h1 alanındaki uppercase sınıfını kaldırdım. "İSTANBUL" yerine "İstanbul" basacak */}
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tighter leading-none">
              {actualCityKey}
            </h1>
            <p className="text-xl text-gray-500 font-medium italic opacity-80">
              {cityPlaces.length} {t.suffix2}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PLACES GRID */}
      <section className="container mx-auto px-6 -mt-24 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {cityPlaces.map((place: any, index: number) => {
            const placeName = place.name?.[lang] || place.name?.tr || "Place";
            const imageKey = `${slugify(actualCityKey)}-${slugify(place.slug)}`;
            const coverImage = cityImages[imageKey]?.[0] || cityImages[place.slug]?.[0];

            return (
              <Link
                key={place.slug}
                href={`${exploreBase}/${region}/${city}/${place.slug}`}
                className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {coverImage ? (
                    <img
                      src={getCloudinaryUrl(coverImage, 600)}
                      alt={placeName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                      <MapPin size={48} className="text-gray-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-10 z-10">                   
                  <h3 className="text-3xl font-serif font-bold text-white mb-4 group-hover:text-blue-200 transition-colors leading-tight">
                    {placeName}
                  </h3>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{t.exploreBtn}</span>
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. YAN YANA AKSİYON BUTONLARI (FOOTER ALANI) */}
      <footer className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900 p-8 md:p-10 rounded-[3.5rem] relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-10"></div>
          
          {/* Sol/Üst Taraf: Bilgilendirme Metni */}
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 shrink-0">
              <Globe2 size={24} />
            </div>
            <div>
              <h4 className="text-white font-serif text-xl font-bold tracking-tight">
                {actualCityKey}
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                {isEn ? "Discover hotel options, local tours and alternative routes." : "Otel seçeneklerini, yerel turları ve alternatif rotaları keşfedin."}
              </p>
            </div>
          </div>

          {/* Sağ/Alt Taraf: Yan Yana Butonlar Grubu */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
            {/* 1. HOTELS BUTTON */}
            <Link
              href={hotelLink}
              className="w-full sm:w-auto group relative overflow-hidden px-6 py-4 rounded-2xl bg-orange-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-start min-w-[160px]"
            >
              <span className="text-[9px] tracking-widest uppercase font-black opacity-80 flex items-center gap-1">
                <Hotel size={10} /> {t.hotelBadge}
              </span>
              <span className="text-xs font-bold mt-0.5 whitespace-nowrap">
                {isEn ? `${t.hotelText}${actualCityKey}` : `${actualCityKey} ${t.hotelText}`}
              </span>
            </Link>

            {/* 2. TOURS BUTTON */}
            <Link
              href={tourLink}
              className="w-full sm:w-auto group relative overflow-hidden px-6 py-4 rounded-2xl bg-white/10 text-white border border-white/10 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex flex-col items-start min-w-[160px]"
            >
              <span className="text-[9px] tracking-widest uppercase font-black text-orange-400 flex items-center gap-1">
                <Ticket size={10} /> {t.tourBadge}
              </span>
              <span className="text-xs font-bold mt-0.5 whitespace-nowrap">
                {isEn ? `${t.tourText}${actualCityKey}` : `${actualCityKey} ${t.tourText}`}
              </span>
            </Link>

            {/* 3. BACK TO EXPLORE BUTTON */}
            <Link
              href={exploreBase}
              className="w-full sm:w-auto group relative overflow-hidden px-6 py-4 rounded-2xl bg-white text-black transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105 flex flex-col items-start justify-center min-w-[140px] h-[52px]"
            >
              <span className="text-[9px] tracking-widest uppercase font-black text-gray-400 group-hover:text-white/80">
                {isEn ? "EXPLORE" : "KEŞFET"}
              </span>
              <span className="text-xs font-bold mt-0.5 whitespace-nowrap">
                {t.backBtn}
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}