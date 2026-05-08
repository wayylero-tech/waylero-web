"use client";

import TourCard from "@/components/TourCard";
import { MapPin } from "lucide-react";

export default function CityPageClient({ city, cityTours, lang }: { city: string, cityTours: any[], lang: 'tr' | 'en' }) {
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
      {/* HERO SECTION */}
      <section className="pt-20 pb-24 bg-[linear-gradient(110deg,#fdfaf7_50%,#fff7ed_50%)]">
        <div className="container mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 text-orange-600 text-xs font-bold rounded-full shadow-sm border border-orange-50">
            <MapPin size={14} />
            <span>{t.guide}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold capitalize text-gray-900">
            {city}
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            {isTR 
              ? `${city} şehrindeki en popüler turları keşfedin.` 
              : `Discover the most popular tours in ${city}.`}
          </p>

          <div className="flex justify-center gap-8 pt-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{cityTours.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{t.experiences}</p>
            </div>
            <div className="w-[1px] h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{t.avgRating}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOURS GRID SECTION */}
      <section className="container mx-auto px-6 py-16">
        {cityTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cityTours.map((tour: any) => (
              <TourCard key={tour.id} {...tour} lang={lang} city={city} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-orange-100 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-900">{t.noResultsTitle}</h3>
            <p className="text-gray-500 mt-2">{t.noResultsDesc}</p>
          </div>
        )}
      </section>
    </main>
  );
}