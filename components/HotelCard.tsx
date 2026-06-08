"use client";

import Image from "next/image";
import {
  MapPin,
  ArrowUpRight,
  Building2,
  Globe,
} from "lucide-react";

interface HotelCardProps {
  city: string;
  title?: string;
  image?: string;
  link: string;
  provider?: "booking" | "hotels";
  lang?: "tr" | "en";
}

export default function HotelCard({
  city,
  title,
  image,
  link,
  provider = "hotels",
  lang = "tr",
}: HotelCardProps) {
  const isTR = lang === "tr";

  const formattedCity =
    city.toLowerCase() === "nevsehir"
      ? isTR
        ? "Kapadokya"
        : "Cappadocia"
      : city.toLowerCase() === "tumsehirler"
      ? isTR
        ? "Diğer Şehirler"
        : "Other Cities"
      : city.charAt(0).toUpperCase() + city.slice(1);

  const cardTitle =
    title || (isTR ? `${formattedCity} Otelleri` : `${formattedCity} Hotels`);

  const cityImage = image || `/assets/sehir1/${city.toLowerCase()}.webp`;

  // 🔥 CTA
  const ctaText = isTR
    ? provider === "booking"
      ? "Booking'de İncele"
      : "Otelleri Gör"
    : provider === "booking"
    ? "View on Booking"
    : "View Hotels";

  // 🔥 Provider badge
  const providerConfig = {
    hotels: {
      label: "Hotels",
      color: "bg-orange-500 text-white",
      icon: <Globe size={13} />,
    },
    booking: {
      label: "Booking.com",
      color: "bg-[#003B95] text-white",
      icon: <Building2 size={13} />,
    },
  };

  const currentProvider = providerConfig[provider];

  return (
    <a
      href={link}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group block h-full"
    >
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1">

        {/* IMAGE */}
        <div className="relative h-[500px] overflow-hidden">
          <Image
            src={cityImage}
            alt={cardTitle}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {/* Provider Badge */}
          <div
            className={`absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${currentProvider.color}`}
          >
            {currentProvider.icon}
            <span>{currentProvider.label}</span>
          </div>

          {/* Arrow */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md group-hover:rotate-45 transition-transform duration-300">
            <ArrowUpRight size={18} className="text-gray-900" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 flex flex-col flex-1">

          <div className="flex items-center gap-1 text-orange-600 text-[11px] font-black mb-3 uppercase tracking-widest">
            <MapPin size={13} />
            <span>{formattedCity}</span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {cardTitle}
          </h3>

          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
            {isTR
              ? `${formattedCity} için en iyi konumdaki otelleri, yüksek puanlı tesisleri ve özel fırsatları hemen keşfet.`
              : `Discover top-rated hotels, stays and exclusive deals in ${formattedCity}.`}
          </p>

          {/* CTA */}
          <div className="mt-auto">
            <div
              className={`w-full text-white text-center py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg
              ${
                provider === "booking"
                  ? "bg-[#003B95] hover:bg-[#00224f] shadow-[#003B95]/20"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {ctaText}
            </div>
          </div>

        </div>
      </div>
    </a>
  );
}