"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { useLang } from "../context/LanguageContext";

/* 🔹 ŞEHİR VERİLERİ */
const cities = [
  {
    id: "istanbul",
    name: { tr: "İstanbul", en: "Istanbul" },
    image: "/assets/genel/istanbul.webp",
    desc: {
      tr: "Boğaz turları, tarihi yerler ve etkinlikler",
      en: "Bosphorus tours, historical places and events",
    },
  },
  {
    id: "nevsehir",
    name: { tr: "Nevşehir", en: "Nevsehir" },
    image: "/assets/genel/goreme.webp",
    desc: {
      tr: "Kapadokya balon turları ve peri bacaları",
      en: "Cappadocia hot air balloon tours and fairy chimneys",
    },
  },
  {
    id: "izmir",
    name: { tr: "İzmir", en: "Izmir" },
    image: "/assets/genel/efes.webp",
    desc: {
      tr: "Efes Antik Kenti ve Ege kıyıları",
      en: "Ephesus Ancient City and Aegean coast",
    },
  },
  {
    id: "antalya",
    name: { tr: "Antalya", en: "Antalya" },
    image: "/assets/genel/antalya.webp",
    desc: {
      tr: "Plajlar, şelaleler ve antik kentler",
      en: "Beaches, waterfalls and ancient cities",
    },
  },
];

const AFFILIATE_BASE = "https://www.getyourguide.com";

export default function EtkinliklerClient({ currentLang }: { currentLang: "en" | "tr" }) {
  // 🚩 DİKKAT: useEffect ve setLang döngüye sebep olduğu için kaldırıldı.
  // İçerik zaten 'currentLang' prop'una bağlı olduğu için SEO ve dil hatası oluşmaz.

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
            country: "TÜRKİYE"
          }
        : {
            title: "Discover Events",
            subtitle: "Choose your city and find the best events & tours.",
            popular: "Popular Cities",
            affiliateText: "View tours on GetYourGuide →",
            note: "More cities coming soon.",
            badge: "START THE FUN",
            country: "TURKEY"
          },
    [currentLang]
  );

  const getLocalizedLink = (cityId: string) => {
    const base = `/etkinlikler/${cityId}`;
    return currentLang === "tr" ? base : `/en${base}`;
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed italic">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* CITIES */}
      <section className="container mx-auto px-6 -mt-16 pb-24 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-800 italic">{t.popular}</h2>
          <div className="h-[1px] flex-grow mx-8 bg-gray-100 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cities.map((city) => (
            <div key={city.id} className="group relative">
              <Link
                href={getLocalizedLink(city.id)}
                className="block h-[400px] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
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
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors transform group-hover:rotate-[360deg] duration-700">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>

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

        <div className="mt-16 p-8 rounded-[2rem] bg-gray-50 border border-dashed text-center">
          <p className="text-gray-500 text-sm italic">
            {t.note}
          </p>
        </div>
      </section>
    </div>
  );
}