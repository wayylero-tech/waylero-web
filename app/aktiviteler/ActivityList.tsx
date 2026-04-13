"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

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
  const searchParams = useSearchParams();

  const [isCityPanelOpen, setIsCityPanelOpen] = useState(false);

  const cityParam = searchParams.get("city");

  const selectedCityName = cityParam
    ? decodeURIComponent(cityParam)
        .normalize("NFC")
        .toLocaleUpperCase("tr-TR")
    : initialCityName || t.title;

  const activeCity = selectedCityName.toLocaleUpperCase("tr-TR");

  const cities = ["İSTANBUL", "ANKARA", "İZMİR", "KONYA", "ANTALYA"];

  // FORMAT EVENTS (ORİJİNAL KORUNDU)
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
    return "";
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-12">
      <div className="max-w-[1400px] mx-auto">

        {/* HEADER */}
        <header className="flex flex-col items-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase">
            {selectedCityName}
          </h1>

          <p className="text-yellow-500 text-xs mt-2 opacity-80 text-center">
            {t.subtitle
              .replace("{city}", selectedCityName)
              .replace("{suffix}", getCitySuffix(selectedCityName))}
          </p>

          {/* CITY BUTTONS */}
          <div className="flex gap-2 mt-6 flex-wrap justify-center">

            {cities.map((c) => (
              <button
                key={c}
                onClick={() =>
                  router.push(
                    `${pathname}?city=${encodeURIComponent(c.toLowerCase()).normalize("NFC")}`
                  )
                }
                className={`px-4 py-2 text-xs border rounded-xl transition-all ${
                  activeCity === c
                    ? "bg-white text-black border-white"
                    : "border-white/10 hover:border-white/40"
                }`}
              >
                {c}
              </button>
            ))}

            {/* OTHER CITIES */}
            <button
              onClick={() => setIsCityPanelOpen(true)}
              className="px-4 py-2 text-xs border border-yellow-500 text-yellow-400 rounded-xl hover:bg-yellow-500 hover:text-black transition-all"
            >
              {t.otherCities}
            </button>

          </div>
        </header>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <h2 className="text-lg font-bold mb-1">
                    {event.name}
                  </h2>

                  <p className="text-xs text-gray-400 mb-3">
                    {event.venue}
                  </p>

                  {/* DATE + TIME (KORUNDU) */}
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
            <div className="col-span-full text-center text-gray-500">
              {t.noEvents}
            </div>
          )}
        </div>

        {/* FOOTER (KORUNDU - ÖNEMLİ) */}
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

      {/* RIGHT DRAWER */}
      {isCityPanelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsCityPanelOpen(false)}
          />

          <div className="ml-auto w-full sm:w-[380px] h-full bg-[#0f0f0f] border-l border-white/10 p-6 relative z-10 animate-slideIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Şehir Seç</h2>
              <button
                onClick={() => setIsCityPanelOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    router.push(
                      `${pathname}?city=${encodeURIComponent(c.toLowerCase()).normalize("NFC")}`
                    );
                    setIsCityPanelOpen(false);
                  }}
                  className="px-4 py-3 rounded-xl border border-white/10 hover:border-white/40 text-left"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
