"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";

/* 🔹 ŞEHİR VERİLERİ */
const cities = [
  {
    id: "tumsehirler",
    name: { tr: "Diğer Şehirler", en: "Other Cities" },
    image: "/assets/sehir1/tumsehirler.webp",
    desc: {
      tr: "Dünyanın dört bir yanındaki turları ve aktiviteleri keşfet",
      en: "Discover tours and activities from all around the world",
    },
  },
  {
    id: "istanbul",
    name: { tr: "İstanbul", en: "Istanbul" },
    image: "/assets/sehir1/istanbul.webp",
    desc: {
      tr: "Boğaz turları, tarihi yerler ve etkinlikler",
      en: "Bosphorus tours, historical places and events",
    },
  },
  {
    id: "nevsehir",
    name: { tr: "Nevşehir", en: "Nevsehir" },
    image: "/assets/sehir1/nevsehir.webp",
    desc: {
      tr: "Kapadokya balon turları ve peri bacaları",
      en: "Cappadocia hot air balloon tours and fairy chimneys",
    },
  },
  {
    id: "antalya",
    name: { tr: "Antalya", en: "Antalya" },
    image: "/assets/sehir1/antalya.webp",
    desc: {
      tr: "Plajlar, şelaleler ve antik kentler",
      en: "Beaches, waterfalls and ancient cities",
    },
  },
  {
    id: "izmir",
    name: { tr: "İzmir", en: "Izmir" },
    image: "/assets/sehir1/izmir.webp",
    desc: {
      tr: "Efes Antik Kenti ve Ege kıyıları",
      en: "Ephesus Ancient City and Aegean coast",
    },
  },
  {
    id: "mugla",
    name: { tr: "Muğla", en: "Mugla" },
    image: "/assets/sehir1/mugla.webp",
    desc: {
      tr: "Bodrum, Marmaris ve Fethiye'nin eşsiz koyları",
      en: "Unique bays of Bodrum, Marmaris and Fethiye",
    },
  },
  {
    id: "aydin",
    name: { tr: "Aydın", en: "Aydin" },
    image: "/assets/sehir1/aydin.webp",
    desc: {
      tr: "Kuşadası ve Didim plajları, antik kalıntılar",
      en: "Kusadasi and Didim beaches, ancient ruins",
    },
  },
  {
    id: "trabzon",
    name: { tr: "Trabzon", en: "Trabzon" },
    image: "/assets/sehir1/trabzon.webp",
    desc: {
      tr: "Sümela Manastırı ve Karadeniz yaylaları",
      en: "Sumela Monastery and Black Sea plateaus",
    },
  },
  {
    id: "viyana",
    name: { tr: "Viyana", en: "Vienna" },
    image: "/assets/sehir1/viyana.webp",
    desc: {
      tr: "Klasik müzik, saraylar ve sanat galerileri",
      en: "Classical music, palaces and art galleries",
    },
  },
  {
    id: "roma",
    name: { tr: "Roma", en: "Rome" },
    image: "/assets/sehir1/roma.webp",
    desc: {
      tr: "Kolezyum, Vatikan ve tarihi meydanlar",
      en: "Colosseum, Vatican and historical squares",
    },
  },
  {
    id: "paris",
    name: { tr: "Paris", en: "Paris" },
    image: "/assets/sehir1/paris.webp",
    desc: {
      tr: "Eyfel Kulesi, Louvre Müzesi ve romantik sokaklar",
      en: "Eiffel Tower, Louvre Museum and romantic streets",
    },
  },
  {
    id: "dubai",
    name: { tr: "Dubai", en: "Dubai" },
    image: "/assets/sehir1/dubai.webp",
    desc: {
      tr: "Gökdelenler, lüks alışveriş ve çöl safarisi",
      en: "Skyscrapers, luxury shopping and desert safari",
    },
  },
  {
    id: "bangkok",
    name: { tr: "Bangkok", en: "Bangkok" },
    image: "/assets/sehir1/bangkok.webp",
    desc: {
      tr: "Tapınaklar, sokak lezzetleri ve gece hayatı",
      en: "Temples, street food and nightlife",
    },
  },
];

const AFFILIATE_BASE = "https://www.getyourguide.com";

export default function EtkinliklerClient({
  currentLang,
}: {
  currentLang: "en" | "tr";
}) {

  const t = useMemo(
    () =>
      currentLang === "tr"
        ? {
            title: "Etkinlikleri Keşfet",
            subtitle: "Şehrini seç ve sana en uygun etkinlikleri listele.",
            popular: "Popüler Şehirler",
            affiliateText: "GetYourGuide turlarını gör →",
            note: "Daha fazla şehir yakında eklenecek.",
            badge: "EĞLENCEYE BAŞLA",
          }
        : {
            title: "Discover Events",
            subtitle: "Choose your city and find the best events & tours.",
            popular: "Popular Cities",
            affiliateText: "View tours on GetYourGuide →",
            note: "More cities coming soon.",
            badge: "START THE FUN",
          },
    [currentLang]
  );

  /* ✅ FIX: DOĞRU ROUTE */
  const getLocalizedLink = (cityId: string) => {
  return `/${currentLang}/etkinlikler/${cityId}`;
};

  const getAffiliateLink = (cityId: string) =>
    `${AFFILIATE_BASE}/${cityId}-l123/?partner_id=WAYLERO_PRO`;

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="pt-40 pb-60 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-orange-100">
            {t.badge}
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            {t.title}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto italic">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* CITIES */}
      <section className="container mx-auto px-6 -mt-16 pb-24 relative z-10">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-10 italic">
          {t.popular}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {cities.map((city) => (
            <div key={city.id} className="group">

              {/* CITY CARD */}
              <Link
                href={getLocalizedLink(city.id)}
                className="block h-[400px] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative"
              >
                <img
                  src={city.image}
                  alt={city.name[currentLang]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 w-full">

                  <div className="flex items-center gap-2 mb-2 text-blue-300 text-[10px] uppercase tracking-widest font-black">
                    <MapPin size={12} />
                    <span>
                      {currentLang === "tr"
                        ? `Türkiye • ${city.name.tr}`
                        : `Turkey • ${city.name.en}`}
                    </span>
                  </div>

                  <h3 className="text-white text-3xl font-black mb-4">
                    {city.name[currentLang]}
                  </h3>

                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-all">
                    <ChevronRight size={20} />
                  </div>

                </div>
              </Link>

              {/* AFFILIATE */}
              <a
                href={getAffiliateLink(city.id)}
                target="_blank"
                rel="sponsored nofollow"
                className="block mt-4 text-xs font-bold text-orange-600 hover:underline uppercase tracking-tighter"
              >
                {t.affiliateText}
              </a>

            </div>
          ))}

        </div>

        <p className="text-center text-gray-500 mt-16 italic">
          {t.note}
        </p>

      </section>
    </div>
  );
}