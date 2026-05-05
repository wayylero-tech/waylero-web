"use client";

import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { Sparkles, MapPin, Navigation, Calendar, Info, Activity, ArrowRight } from "lucide-react";
import PlaceSlider from "./PlaceSlider";

const BASE_URL = "https://www.waylero.com";

export default function PlaceClient({ lang, region, city, place, foundPlace, images, nearbyPlaces }: any) {
  const isEn = lang === "en";
  const langPrefix = isEn ? "/en" : "";
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const canonical = `${BASE_URL}${langPrefix}/kesfet/${region}/${city}/${place}`;

  const t = isEn ? {
    badge: "EXPERIENCE POINT",
    todo: "Things to Do Here",
    nearby: "Explore Nearby",
    location: "Map Location",
    noPhoto: "No photos yet",
    unit: "km",
    distanceNote: "away",
    eventsTitle: "Events",
    eventsText: "Don't miss concerts and festivals →"
  } : {
    badge: "DENEYİM NOKTASI",
    todo: "Burada Neler Yapılır?",
    nearby: "Çevreyi Keşfet",
    location: "Harita Konumu",
    noPhoto: "Fotoğraf henüz eklenmedi",
    unit: "km",
    distanceNote: "yakınında",
    eventsTitle: "Etkinlikleri",
    eventsText: "Konser ve festivalleri kaçırma →"
  };

  // ✅ SEO Schema (JSON-LD)
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": foundPlace.name?.[lang],
    "description": foundPlace.description?.[lang],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": Number(foundPlace.latitude),
      "longitude": Number(foundPlace.longitude)
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-orange-100 shadow-sm">
              <Sparkles size={14} />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 mb-6 tracking-tighter leading-tight max-w-4xl uppercase">
              {foundPlace.name?.[lang]}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <MapPin size={14} className="text-blue-500" />
              <span>{region} / {city}</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {images.length > 0 ? (
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <PlaceSlider images={images} title={foundPlace.name?.[lang]} />
              </div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 text-gray-300 gap-4">
                <Info size={48} />
                <span className="font-bold uppercase tracking-widest text-xs">{t.noPhoto}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-16">
            <div className="prose prose-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Info size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 m-0">
                  {foundPlace.name?.[lang]}
                </h2>               
              </div>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {foundPlace.description?.[lang]}
              </p>
            </div>

            {foundPlace.latitude && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    <Navigation size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-gray-900">{t.location}</h2>
                </div>
                <div className="rounded-[3rem] overflow-hidden shadow-xl border border-gray-100 h-[450px]">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&hl=${lang}&z=15&output=embed`}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-orange-500" size={20} />
                <h3 className="font-serif font-bold text-xl">{t.todo}</h3>
              </div>
              <ul className="space-y-4">
                {(foundPlace.activities?.[lang] || []).map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-[2.5rem] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={20} />
                <h3 className="font-serif font-bold text-xl">{cityName} {t.eventsTitle}</h3>
              </div>
              <p className="text-sm opacity-90 mb-6">{t.eventsText}</p>
              <Link
                href={`/aktiviteler?city=${slugify(city)}`}
                className="flex items-center justify-between bg-white text-gray-900 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                {t.eventsTitle} <ArrowRight size={18} />
              </Link>
            </div>

            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
              <h3 className="font-serif font-bold text-xl mb-6">{t.nearby}</h3>
              <div className="space-y-6">
                {nearbyPlaces.map((p: any) => (
                  <Link
                    key={p.slug}
                    href={`${langPrefix}/kesfet/${region}/${city}/${p.slug}`}
                    className="flex flex-col gap-1 group"
                  >
                    <span className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors uppercase">
                      {p.name?.[lang]}
                    </span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      {p.distance.toFixed(1)} {t.unit} {t.distanceNote}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}