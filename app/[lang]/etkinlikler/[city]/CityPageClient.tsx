"use client";

import { MapPin } from "lucide-react";

// Şehir verileri
const citiesData = [
  {
    id: "tumsehirler",
    name: { tr: "Diğer Şehirler", en: "Other Cities" },
    image: "/assets/sehir/tumsehirler.webp",
    desc: {
      tr: "Dünyanın dört bir yanındaki turları ve aktiviteleri keşfet",
      en: "Discover tours and activities from all around the world",
    },
  },
  {
    id: "istanbul",
    name: { tr: "İstanbul", en: "Istanbul" },
    image: "/assets/sehir/istanbul.webp",
    desc: {
      tr: "Boğaz turları, tarihi yerler ve etkinlikler",
      en: "Bosphorus tours, historical places and events",
    },
  },
  {
    id: "nevsehir",
    name: { tr: "Nevşehir", en: "Nevsehir" },
    image: "/assets/sehir/nevsehir.webp",
    desc: {
      tr: "Kapadokya balon turları ve peri bacaları",
      en: "Cappadocia hot air balloon tours and fairy chimneys",
    },
  },
  {
    id: "antalya",
    name: { tr: "Antalya", en: "Antalya" },
    image: "/assets/sehir/antalya.webp",
    desc: {
      tr: "Plajlar, şelaleler ve antik kentler",
      en: "Beaches, waterfalls and ancient cities",
    },
  },
  {
    id: "izmir",
    name: { tr: "İzmir", en: "Izmir" },
    image: "/assets/sehir/izmir.webp",
    desc: {
      tr: "Efes Antik Kenti ve Ege kıyıları",
      en: "Ephesus Ancient City and Aegean coast",
    },
  },
  {
    id: "mugla",
    name: { tr: "Muğla", en: "Mugla" },
    image: "/assets/sehir/mugla.webp",
    desc: {
      tr: "Bodrum, Marmaris ve Fethiye'nin eşsiz koyları",
      en: "Unique bays of Bodrum, Marmaris and Fethiye",
    },
  },
  {
    id: "aydin",
    name: { tr: "Aydın", en: "Aydin" },
    image: "/assets/sehir/aydin.webp",
    desc: {
      tr: "Kuşadası ve Didim plajları, antik kalıntılar",
      en: "Kusadasi and Didim beaches, ancient ruins",
    },
  },
  {
    id: "trabzon",
    name: { tr: "Trabzon", en: "Trabzon" },
    image: "/assets/sehir/trabzon.webp",
    desc: {
      tr: "Sümela Manastırı ve Karadeniz yaylaları",
      en: "Sumela Monastery and Black Sea plateaus",
    },
  },
  {
    id: "viyana",
    name: { tr: "Viyana", en: "Vienna" },
    image: "/assets/sehir/viyana.webp",
    desc: {
      tr: "Klasik müzik, saraylar ve sanat galerileri",
      en: "Classical music, palaces and art galleries",
    },
  },
  {
    id: "roma",
    name: { tr: "Roma", en: "Rome" },
    image: "/assets/sehir/roma.webp",
    desc: {
      tr: "Kolezyum, Vatikan ve tarihi meydanlar",
      en: "Colosseum, Vatican and historical squares",
    },
  },
  {
    id: "paris",
    name: { tr: "Paris", en: "Paris" },
    image: "/assets/sehir/paris.webp",
    desc: {
      tr: "Eyfel Kulesi, Louvre Müzesi ve romantik sokaklar",
      en: "Eiffel Tower, Louvre Museum and romantic streets",
    },
  },
  {
    id: "dubai",
    name: { tr: "Dubai", en: "Dubai" },
    image: "/assets/sehir/dubai.webp",
    desc: {
      tr: "Gökdelenler, lüks alışveriş ve çöl safarisi",
      en: "Skyscrapers, luxury shopping and desert safari",
    },
  },
  {
    id: "bangkok",
    name: { tr: "Bangkok", en: "Bangkok" },
    image: "/assets/sehir/bangkok.webp",
    desc: {
      tr: "Tapınaklar, sokak lezzetleri ve gece hayatı",
      en: "Temples, street food and nightlife",
    },
  },
];

// 🔥 LINK MAP (EN TEMİZ HAL)
const cityLinks: Record<string, string> = {
  istanbul: "https://getyourguide.tp.st/nTBcXECr",
  nevsehir: "https://getyourguide.tp.st/jf5oS4u4",
  antalya: "https://getyourguide.tp.st/hwXRhIEO",
  izmir: "https://getyourguide.tp.st/Zcv1aMld",
  mugla: "https://getyourguide.tp.st/lzZDpwcu",
  aydin: "https://getyourguide.tp.st/hkZDFUO7",
  trabzon: "https://getyourguide.tp.st/fSiK9Sbq",
  viyana: "https://getyourguide.tp.st/Y1byIa5k",
  roma: "https://getyourguide.tp.st/VfYfG5ft",
  paris: "https://getyourguide.tp.st/bGcMEFlD",
  dubai: "https://getyourguide.tp.st/ZkaT4ETm",
  bangkok: "https://getyourguide.tp.st/rCKN04Sa",
  tumsehirler: "https://getyourguide.tp.st/7WLVJEal",
};

export default function CityPageClient({
  city,
  lang,
}: {
  city: string;
  lang: "tr" | "en";
}) {
  const isTR = lang === "tr";

  const cityInfo = citiesData.find((c) => c.id === city.toLowerCase());

  const t = {
    guide: isTR ? "Destinasyon Rehberi" : "Destination Guide",
    experiences: isTR ? "Deneyim" : "Experiences",
    avgRating: isTR ? "Ort. Puan" : "Avg. Rating",
    reserve: isTR ? "İncele ve Rezervasyon Yap" : "View and Book Now",
  };

  if (!cityInfo)
    return (
      <div className="p-20 text-center font-serif text-2xl">
        Şehir bulunamadı.
      </div>
    );

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="pt-20 pb-24 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 text-blue-600 text-xs font-bold rounded-full shadow-sm border border-blue-50">
            <MapPin size={14} />
            <span>{t.guide}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900">
            {cityInfo.name[lang]}
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto text-lg italic">
            {cityInfo.desc[lang]}
          </p>
        </div>
      </section>

      {/* CARD */}
      <section className="container mx-auto px-6 py-16 -mt-10">
        <div className="max-w-5xl mx-auto">
          <a
            href={cityLinks[city.toLowerCase()] || cityLinks.tumsehirler}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="group flex flex-col md:flex-row bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-blue-100 transition-all"
          >
            {/* IMAGE */}
            <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
              <img
                src={cityInfo.image}
                alt={cityInfo.name[lang]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* CONTENT */}
            <div className="p-10 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50/30">
              <h2 className="text-4xl font-serif font-bold mb-6">
                {cityInfo.name[lang]} {isTR ? "Sizi Bekliyor" : "Is Waiting"}
              </h2>

              <p className="text-gray-500 mb-10">
                {cityInfo.desc[lang]}
              </p>

              <div className="w-fit px-10 py-4 bg-orange-600 text-white font-bold rounded-2xl">
                {t.reserve}
              </div>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}