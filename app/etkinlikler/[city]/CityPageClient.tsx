"use client";

import TourCard from "@/components/TourCard";
import { MapPin } from "lucide-react";
import { useLang } from "../../context/LanguageContext";
import { useEffect } from "react";

export default function CityPageClient({ city, cityTours, initialLang }: any) {
  const { lang, setLang } = useLang();

  // Sayfa yüklendiğinde URL'den gelen dili Context'e işle (Senkronizasyon)
  useEffect(() => {
    if (initialLang && lang !== initialLang) {
      setLang(initialLang);
    }
  }, [initialLang, setLang, lang]);

  const isTR = lang === "tr";

  const t = {
    guide: isTR ? "Destinasyon Rehberi" : "Destination Guide",
    experiences: isTR ? "Deneyim" : "Experiences",
    avgRating: isTR ? "Ort. Puan" : "Avg. Rating",
    noResultsTitle: isTR ? "Henüz Deneyim Bulunamadı" : "No Experiences Found",
    noResultsDesc: isTR ? "Bu şehir için etkinliklerimiz yakında eklenecektir." : "Tours for this city will be added soon.",
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="pt-20 pb-24 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 text-blue-600 text-xs font-bold rounded-full">
            <MapPin size={14} />
            <span>{t.guide}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold capitalize">
            {city}
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            {isTR 
              ? `${city} şehrindeki en popüler turları keşfedin.` 
              : `Discover the most popular tours in ${city}.`}
          </p>

          <div className="flex justify-center gap-8 pt-4">
            <div>
              <p className="text-xl font-bold">{cityTours.length}</p>
              <p className="text-xs text-gray-500">{t.experiences}</p>
            </div>
            <div className="w-[1px] h-10 bg-gray-200" />
            <div>
              <p className="text-xl font-bold">4.8</p>
              <p className="text-xs text-gray-500">{t.avgRating}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        {cityTours.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cityTours.map((tour: any) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <h3 className="text-xl font-bold">{t.noResultsTitle}</h3>
            <p className="text-gray-500">{t.noResultsDesc}</p>
          </div>
        )}
      </section>
    </main>
  );
}