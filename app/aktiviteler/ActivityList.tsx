"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { cityMap } from "@/lib/cityMap";

// 🔥 Linkleri Türkçe karakterden arındıran fonksiyon
function slugify(text: string) {
  const charMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  return text
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .trim();
}

const translations = {
  tr: {
    title: "TÜRKİYE GENELİ",
    subtitle: "Waylero ile {city}{suffix} konserleri keşfet",
    buyTicket: "BİLETİ AL →",
    otherCities: "+ DİĞER ŞEHİRLER",
    liveExp: "CANLI DENEYİMLER",
    soon: "Tarih Yakında",
    noEvents: "Bu şehirde sessizlik hakim...",
    noVenue: "Mekan Belirtilmemiş",
    event: "Etkinlik",
  },
  en: {
    title: "ALL OVER TURKEY",
    subtitle: "Discover concerts in {city} with Waylero",
    buyTicket: "BUY TICKET →",
    otherCities: "+ OTHER CITIES",
    liveExp: "LIVE EXPERIENCES",
    soon: "Date Soon",
    noEvents: "Silence prevails in this city...",
    noVenue: "Venue Not Specified",
    event: "Event",
  },
};

interface ActivityListProps {
  initialEvents: any[];
  initialCityName: string;
  lang?: "tr" | "en";
}

export default function ActivityList({
  initialEvents,
  initialCityName,
  lang = "tr",
}: ActivityListProps) {
  const t = translations[lang];
  const router = useRouter();
  const pathname = usePathname();
  const [showCityList, setShowCityList] = useState(false);

  // Mevcut şehir ismini büyük harfe çevir (UI kontrolü için)
  const activeCity = initialCityName.toLocaleUpperCase("tr-TR");

  const cities = ["İSTANBUL", "ANKARA", "İZMİR", "KONYA", "ANTALYA"];
  const otherCities = Object.keys(cityMap)
    .filter((c) => !cities.includes(c))
    .sort((a, b) => a.localeCompare(b, "tr"));

  // ✅ Şehir değiştirme (Linkleri temizleyerek)
  const handleCityChange = (cityName: string) => {
    const cleanSlug = slugify(cityName);
    router.push(`${pathname}?city=${cleanSlug}`);
    setShowCityList(false);
  };

  // ✅ FORMAT EVENTS (Orijinal mantığın, hiçbir şeyi silmedim)
  const events = (initialEvents || []).map((item: any) => {
    const rawDate = item.start || item.start_date || item.baslangic;
    let eventDate: Date | null = null;

    if (rawDate) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) eventDate = d;
    }

    return {
      id: item.id || Math.random(),
      name: item.name || item.adi,
      image:
        item.poster_url ||
        item.afis ||
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000",
      date: eventDate,
      time: eventDate
        ? eventDate.toLocaleTimeString(lang === "tr" ? "tr-TR" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      venue: item.venue?.name || item.mekan?.ad || t.noVenue,
      category: item.category?.name || t.event,
      url: item.ticket_url || item.url || "#",
    };
  });

  const getCitySuffix = (cityName: string) => {
    if (lang === "en" || !cityName || cityName === t.title) return "";
    return ""; // Suffix mantığını buraya istersen ekleyebilirsin
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-12">
      <div className="max-w-[1400px] mx-auto">

        {/* HEADER */}
        <header className="flex flex-col items-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-center">
            {initialCityName}
          </h1>

          <p className="text-yellow-500 text-xs mt-2 opacity-80 text-center">
            {t.subtitle
              .replace("{city}", initialCityName)
              .replace("{suffix}", getCitySuffix(initialCityName))}
          </p>

          {/* CITY BUTTONS */}
          <div className="flex gap-2 mt-6 flex-wrap justify-center">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => handleCityChange(c)}
                className={`px-4 py-2 text-xs border rounded-xl transition-all ${
                  activeCity === c
                    ? "bg-white text-black border-white"
                    : "border-white/10 hover:border-white/40"
                }`}
              >
                {c}
              </button>
            ))}

            <button
              onClick={() => setShowCityList(!showCityList)}
              className="px-4 py-2 text-xs border border-yellow-500 text-yellow-400 rounded-xl hover:bg-yellow-500 hover:text-black transition-all"
            >
              {t.otherCities}
            </button>
          </div>
        </header>

        {/* ŞEHİR LİSTESİ */}
        {showCityList && (
          <div className="mt-6 w-full max-w-3xl mx-auto bg-[#111] border border-white/10 rounded-2xl p-4 max-h-[300px] overflow-y-auto shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {otherCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  className="text-xs px-3 py-2 rounded-lg border border-white/10 hover:border-yellow-500 hover:text-yellow-400 transition-all"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-[#121212] rounded-2xl overflow-hidden border border-white/10 flex flex-col transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl"
              >
                <div className="relative h-72">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    sizes="(max-width:768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold mb-1 line-clamp-2">
                    {event.name}
                  </h2>

                  <p className="text-xs text-gray-400 mb-3">
                    {event.venue}
                  </p>

                  <div className="text-xs text-yellow-400 mb-4">
                    {event.date ? (
                      <>
                        {event.date.toLocaleDateString(
                          lang === "tr" ? "tr-TR" : "en-US",
                          { day: "2-digit", month: "short" }
                        )}{" "}
                        • {event.time}
                      </>
                    ) : (
                      t.soon
                    )}
                  </div>

                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto bg-white text-black py-3 rounded-xl text-center font-bold"
                  >
                    {t.buyTicket}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-20">
              {t.noEvents}
            </div>
          )}
        </div>

        {/* FOOTER - ATIF BÖLÜMÜ */}
        <footer className="mt-16 text-center text-white text-xs md:text-sm opacity-80 pb-10">
          <p>
            Etkinlik verileri{" "}
            <a
              href="https://etkinlik.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 underline font-bold"
            >
              etkinlik.io
            </a>{" "}
            tarafından sağlanmaktadır.
          </p>
        </footer>

      </div>
    </main>
  );
}