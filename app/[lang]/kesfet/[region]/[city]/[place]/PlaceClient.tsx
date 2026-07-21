"use client";

import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { Sparkles, MapPin, Navigation, Calendar, Info, Activity, ArrowRight, Ticket } from "lucide-react";
import PlaceSlider from "./PlaceSlider";
import { trackPlaceViewed } from "@/lib/analytics";
import { useEffect, useState } from "react";


const BASE_URL = "https://www.waylero.com";

export default function PlaceClient({
  lang,
  region,
  city,
  place,
  foundPlace,
  images,
  nearbyPlaces,
  liveEntryFee,
}: any) {
  const isEn = lang === "en";
  const langPrefix = lang === "en" ? "/en" : "/tr";
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
    eventsText: "Don't miss concerts and festivals →",
    estimated: "Est.",
    feeTitle: "Entry Fee",
  } : {
    badge: "DENEYİM NOKTASI",
    todo: "Burada Neler Yapılır?",
    nearby: "Çevreyi Keşfet",
    location: "Harita Konumu",
    noPhoto: "Fotoğraf henüz eklenmedi",
    unit: "km",
    distanceNote: "yakınında",
    eventsTitle: "Etkinlikleri",
    eventsText: "Konser ve festivalleri kaçırma →",
    estimated: "Tahmini",
    feeTitle: "Giriş Ücreti",
  };

  // ✅ SEO Schema (JSON-LD) - Temizlenmiş değişkenlerle uyumlu
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": canonical,
    "name": foundPlace.name,
    "description": foundPlace.description,
    "url": canonical,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical
    },
    "image": images?.length > 0 ? (images[0]?.url || images[0]) : `${BASE_URL}/images/waylero-placeholder.jpg`,
    "hasMap": `https://www.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}`,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": Number(foundPlace.latitude),
      "longitude": Number(foundPlace.longitude)
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": region
    },
    "touristType": ["Tourists", "Travelers", "Backpackers", "Photographers"],
    "isAccessibleForFree": true,
    "publicAccess": true,
    "potentialAction": {
      "@type": "ViewAction",
      "target": canonical
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
              {foundPlace.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <MapPin size={14} className="text-blue-500" />
              <span>{region} / {city}</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {images.length > 0 ? (
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <PlaceSlider images={images} title={foundPlace.name} />
              </div>
            ) : (
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white h-[500px] relative bg-gray-900">
                <img
                  src="/images/waylero-placeholder.jpg" 
                  alt={foundPlace.name || "Waylero Explore"}
                  className="w-full h-full object-cover opacity-80"
                  loading="eager" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-12">
                  <p className="text-white font-serif text-3xl font-bold uppercase tracking-tight">
                    {foundPlace.name}
                  </p>
                </div>
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
                  {foundPlace.name}
                </h2>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {foundPlace.description}
              </p>
            </div>

            {foundPlace.latitude && (
              <div className="space-y-10">
                {/* HARİTA */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                      <Navigation size={24} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900">
                      {t.location}
                    </h2>
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
                  <div className="flex items-center justify-center mt-4">
                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                      {foundPlace.latitude}, {foundPlace.longitude}
                    </p>
                  </div>
                </div>

                {/* NASIL GİDİLİR */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                      <Navigation size={24} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900">
                      {lang === "tr" ? "Nasıl Gidilir?" : "How to Get There"}
                    </h2>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${foundPlace.latitude},${foundPlace.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-black text-white px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 transition-all"
                    >
                      <span>
                        {lang === "tr" ? "Google Maps ile Yol Tarifi Al" : "Get Directions with Google Maps"}
                      </span>
                      <ArrowRight size={18} />
                    </a>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="font-bold text-base mb-2 text-gray-900">
                          {lang === "tr" ? "Özel Araç ile" : "By Car"}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {lang === "tr"
                            ? `${foundPlace.name} konumuna özel aracınızla kolayca ulaşabilirsiniz. Google Maps üzerinden canlı navigasyon başlatabilirsiniz.`
                            : `You can easily reach ${foundPlace.name} by car using live navigation on Google Maps.`}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="font-bold text-base mb-2 text-gray-900">
                          {lang === "tr" ? "Konum Bilgisi" : "Location Info"}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {lang === "tr" ? `${cityName}, ${region} bölgesinde yer almaktadır.` : `Located in ${cityName}, ${region}.`}
                        </p>
                      </div>
                    </div>
                  </div>
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
                {(foundPlace.activities || []).map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {liveEntryFee && (
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Ticket className="text-emerald-500" size={20} />
                  <h3 className="font-serif font-bold text-xl">{t.feeTitle}</h3>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <p className="text-sm text-emerald-900 font-medium whitespace-pre-line leading-relaxed">
                    {liveEntryFee}
                  </p>
                </div>
              </div>
            )}

            {region.toLowerCase() === "turkiye" && (
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
            )}

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2.5rem] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Activity size={20} />
                <h3 className="font-serif font-bold text-xl">
                  {lang === "tr" ? `${cityName} Otelleri` : `${cityName} Hotels`}
                </h3>
              </div>
              <p className="text-sm opacity-90 mb-6">
                {lang === "tr" ? "Konaklayacak en iyi yerleri keşfetmek için tıklayın." : "Click to discover the best places to stay."}
              </p>
              <Link
                href="/hotels"
                className="flex items-center justify-between bg-white text-gray-900 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                {lang === "tr" ? "OTELLERİ GÖR" : "VIEW HOTELS"} <ArrowRight size={18} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-amber-500 text-white rounded-[2.5rem] p-8 shadow-lg border border-orange-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Navigation size={20} />
                <h3 className="font-serif font-bold text-xl">
                  {lang === "tr" ? `${cityName} Turları` : `${cityName} Tours`}
                </h3>
              </div>
              <p className="text-sm opacity-90 mb-6">
                {lang === "tr" ? "Şehri uzman rehberlerle keşfedeceğin turlara göz at." : "Check out tours to explore the city with expert guides."}
              </p>
              <Link
                href="/etkinlikler"
                className="flex items-center justify-between bg-white text-gray-900 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                {lang === "tr" ? "TURLARI KEŞFET" : "EXPLORE TOURS"} <ArrowRight size={18} />
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
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded">
                        {t.estimated}
                      </span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {p.distance.toFixed(1)} {t.unit} {t.distanceNote}
                      </span>
                    </div>
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