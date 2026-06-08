"use client";

import HotelCard from "@/components/HotelCard";
import { MapPin } from "lucide-react";

export default function HotelCityPageClient({
  city,
  cityHotels,
  lang,
}: {
  city: string;
  cityHotels: any[];
  lang: "tr" | "en";
}) {
  const isTR = lang === "tr";

  // 🔥 Şehirlere özel linkler
  const cityLinks: {
    [key: string]: {
      booking?: string;
      hotels?: string;
    };
  } = {
    tumsehirler: {
      booking: "https://booking.tp.st/Zaseqksp",
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    istanbul: {
      booking: "https://booking.tp.st/ZtWXbtwj",
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    nevsehir: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    antalya: {
      booking: "https://booking.tp.st/3YML2Z43",
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    izmir: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    mugla: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    aydin: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    trabzon: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    edirne: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    bangkok: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    paris: {
      booking: "https://booking.tp.st/JoXA9ovm",
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    londra: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    dubai: {
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },

    roma: {
      booking: "https://booking.tp.st/vs4oDzlc",
      hotels: "https://hotels.tp.st/QM5SvNxc",
    },
  };

  const cityName =
    city.toLowerCase() === "nevsehir"
      ? isTR
        ? "Kapadokya"
        : "Cappadocia"
      : city.toLowerCase() === "tumsehirler"
      ? isTR
        ? "Diğer Şehirler"
        : "Other Cities"
      : city.charAt(0).toUpperCase() + city.slice(1);

  const hotel = cityHotels?.[0];
  const links = cityLinks[city.toLowerCase()] || {};

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="pt-40 pb-24 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-orange-200 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6">
            <MapPin size={12} />
            {isTR ? "Şehir Rehberi" : "City Guide"}
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 capitalize">
            {cityName}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {isTR
              ? `${cityName} için en iyi konaklama seçenekleri`
              : `Best stays for ${cityName}`}
          </p>
        </div>
      </section>

      {/* HOTEL CARDS */}
      <section className="container mx-auto px-6 py-24">
        {hotel ? (
          <div
            className={`
              grid gap-10 mx-auto
              ${
                links.booking && links.hotels
                  ? "grid-cols-1 lg:grid-cols-2 max-w-7xl"
                  : "grid-cols-1 max-w-4xl"
              }
            `}
          >
            {/* BOOKING CARD */}
            {links.booking && (
              <HotelCard
                {...hotel}
                city={city}
                lang={lang}
                provider="booking"
                link={links.booking}
              />
            )}

            {/* HOTELS CARD */}
            {links.hotels && (
              <HotelCard
                {...hotel}
                city={city}
                lang={lang}
                provider="hotels"
                link={links.hotels}
              />
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
            {isTR ? "Otel bulunamadı" : "No hotel found"}
          </div>
        )}
      </section>
    </div>
  );
}