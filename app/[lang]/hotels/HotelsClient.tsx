"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";


  const cities = [
    {
  id: "tumsehirler",
  name: {     tr: "Diğer Şehirler",     en: "Other Cities" 
  },
  image: "/assets/sehir/tumsehirler.webp", // Genel bir seyahat görseli
  desc: {
    tr: "Dünyanın dört bir yanındaki lüks durakları keşfedin",
    en: "Discover luxury destinations all around the world",
  },
},
  {
    id: "istanbul",
    name: { tr: "İstanbul", en: "Istanbul" },
    image: "/assets/sehir/istanbul.webp",
    desc: {
      tr: "Boğaz manzaralı lüks oteller",
      en: "Luxury hotels with Bosphorus views",
    },
  },
  {
    id: "nevsehir",
    name: { tr: "Kapadokya", en: "Cappadocia" },
    image: "/assets/sehir/nevsehir.webp",
    desc: {
      tr: "Mağara otelleri ve eşsiz manzaralar",
      en: "Cave hotels and unique landscapes",
    },
  },
  {
    id: "antalya",
    name: { tr: "Antalya", en: "Antalya" },
    image: "/assets/sehir/antalya.webp",
    desc: {
      tr: "Resort ve tatil otelleri",
      en: "Resort and holiday hotels",
    },
  },
  {
    id: "izmir",
    name: { tr: "İzmir", en: "Izmir" },
    image: "/assets/sehir/izmir.webp",
    desc: {
      tr: "Sahil otelleri ve şehir kaçamakları",
      en: "Coastal hotels and city escapes",
    },
  },
  {
    id: "mugla",
    name: { tr: "Muğla", en: "Mugla" },
    image: "/assets/sehir/mugla.webp",
    desc: {
      tr: "Bodrum ve Fethiye’de tatil keyfi",
      en: "Holiday escapes in Bodrum and Fethiye",
    },
  },
  {
    id: "aydin",
    name: { tr: "Aydın", en: "Aydin" },
    image: "/assets/sehir/aydin.webp",
    desc: {
      tr: "Kuşadası ve deniz manzaralı oteller",
      en: "Sea-view hotels in Kusadasi",
    },
  },
  {
    id: "trabzon",
    name: { tr: "Trabzon", en: "Trabzon" },
    image: "/assets/sehir/trabzon.webp",
    desc: {
      tr: "Doğa ile iç içe Karadeniz otelleri",
      en: "Black Sea hotels surrounded by nature",
    },
  },
  {
    id: "bangkok",
    name: { tr: "Bangkok", en: "Bangkok" },
    image: "/assets/sehir/bangkok.webp",
    desc: {
      tr: "Modern şehir otelleri ve rooftop deneyimleri",
      en: "Modern city hotels and rooftop experiences",
    },
  },
  {
    id: "paris",
    name: { tr: "Paris", en: "Paris" },
    image: "/assets/sehir/paris.webp",
    desc: {
      tr: "Romantik ve tarihi lüks oteller",
      en: "Romantic and historical luxury hotels",
    },
  },
  {
    id: "londra",
    name: { tr: "Londra", en: "London" },
    image: "/assets/sehir/londra.webp",
    desc: {
      tr: "İkonik bölgelerde premium konaklama",
      en: "Premium stays in iconic districts",
    },
  },
  {
    id: "dubai",
    name: { tr: "Dubai", en: "Dubai" },
    image: "/assets/sehir/dubai.webp",
    desc: {
      tr: "Ultra lüks gökdelen otelleri",
      en: "Ultra luxury skyscraper hotels",
    },
  },
  {
    id: "roma",
    name: { tr: "Roma", en: "Rome" },
    image: "/assets/sehir/roma.webp",
    desc: {
      tr: "Klasik mimari ve butik konaklama",
      en: "Classical architecture and boutique stays",
    },
  },
];

export default function HotelsClient({
  currentLang,
}: {
  currentLang: "tr" | "en";
}) {
  const t =
    currentLang === "tr"
      ? {
          title: "Otelleri Keşfet",
          subtitle: "Şehrini seç ve en iyi otelleri incele.",
        }
      : {
          title: "Discover Hotels",
          subtitle: "Choose your city and explore the best hotels.",
        };

  const getLocalizedLink = (cityId: string) => {
    const base = `/hotels/${cityId}`;
    return currentLang === "tr" ? base : `/en${base}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-40 pb-60 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            {t.title}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24 relative z-10">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {cities.map((city) => (
      <Link
        key={city.id}
        href={getLocalizedLink(city.id)}
        className="group block h-[420px] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative"
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
            <span>{city.name[currentLang]}</span>
          </div>

          <h3 className="text-white text-3xl font-black mb-3">
            {city.name[currentLang]}
          </h3>

          <p className="text-white/70 text-sm mb-5">
            {city.desc[currentLang]}
          </p>

          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-all duration-700">
            <ChevronRight size={20} />
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>
    </div>
  );
}