"use client";

import HotelCard from "@/components/HotelCard";
import Stay22Script from "@/components/Stay22Script";
import Link from "next/link";
import {
  Hotel,
  ArrowDown,
  MapPin,
  CheckCircle2,
} from "lucide-react";

type HotelCityData = {
  id: string;
  city: string;
  image?: string;
};

export default function HotelCityPageClient({
  city,
  cityHotels,
  lang,
}: {
  city: string;
  cityHotels: HotelCityData[];
  lang: "tr" | "en";
}) {
  const isTR = lang === "tr";
  const citySlug = city.toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | ŞEHİR ADI
  |--------------------------------------------------------------------------
  */

  const cityName =
    citySlug === "nevsehir"
      ? isTR
        ? "Kapadokya"
        : "Cappadocia"
      : citySlug === "londra"
      ? isTR
        ? "Londra"
        : "London"
      : citySlug
          .replace(/[-_]+/g, " ")
          .split(" ")
          .filter(Boolean)
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(" ");

  /*
  |--------------------------------------------------------------------------
  | ETKİNLİK / TUR SAYFASI
  |--------------------------------------------------------------------------
  |
  | Bu sistem şimdilik ayrı tutuluyor.
  | Otel şehirlerini sınırlamaz.
  |
  */

  const eventCities = [
    "istanbul",
    "nevsehir",
    "antalya",
    "izmir",
    "mugla",
    "aydin",
    "trabzon",
    "roma",
    "paris",
    "dubai",
    "bangkok",
  ];

  const hasEventPage = eventCities.includes(citySlug);

  /*
  |--------------------------------------------------------------------------
  | OTEL LİNKLERİ
  |--------------------------------------------------------------------------
  |
  | Travelpayouts tamamen kaldırıldı.
  |
  | Stay22 scripti bu standart Booking.com / Hotels.com
  | bağlantılarını affiliate bağlantılarına dönüştürecek.
  |
  */

  const bookingLink =
    `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
      cityName
    )}`;

  const hotelsLink =
    `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(
      cityName
    )}`;

  /*
  |--------------------------------------------------------------------------
  | HOTEL DATA
  |--------------------------------------------------------------------------
  */

  const hotel = cityHotels?.[0];

  /*
  |--------------------------------------------------------------------------
  | SAYFA
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-white">

        <Stay22Script />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">

        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="relative container mx-auto px-6 pt-32 md:pt-40 pb-24 md:pb-28">

          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-orange-100 shadow-sm text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] mb-7">

              <Hotel size={14} />

              {isTR
                ? "Konaklama Rehberi"
                : "Accommodation Guide"}

            </div>

            {/* Title */}

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-gray-900 leading-[0.95] mb-7">

              {isTR
                ? `${cityName} Otelleri`
                : `Hotels in ${cityName}`}

            </h1>

            {/* Description */}

            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-8">

              {isTR
                ? `${cityName} konaklama seçeneklerini keşfedin, otelleri inceleyin ve seyahatinize uygun konaklama seçeneğini bulun.`
                : `Explore accommodation options in ${cityName}, compare hotels and find a stay that suits your trip.`}

            </p>

            {/* Scroll */}

            <div className="mt-10 flex justify-center">

              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400">

                <ArrowDown size={17} />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          KONAKLAMA
      ========================================================= */}

      <section className="container mx-auto px-6 py-16 md:py-20">

        <div className="max-w-5xl mx-auto">

          <div className="rounded-[2.5rem] bg-gray-50 border border-gray-100 p-8 md:p-12 lg:p-14">

            <div className="max-w-4xl">

              <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">

                {isTR
                  ? "Konaklama Rehberi"
                  : "Accommodation Guide"}

              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-3 mb-6">

                {isTR
                  ? `${cityName} Nerede Kalınır?`
                  : `Where to Stay in ${cityName}`}

              </h2>

              <p className="text-gray-600 text-base md:text-lg leading-8">

                {isTR
                  ? `${cityName} seyahatiniz için otel seçerken konum, ulaşım bağlantıları, tesis olanakları, misafir değerlendirmeleri ve seyahat planınıza yakınlık gibi noktaları birlikte değerlendirebilirsiniz.`
                  : `When choosing a hotel in ${cityName}, consider the location, transport connections, hotel facilities, guest reviews and proximity to the places you plan to visit.`}

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          OTEL SEÇERKEN
      ========================================================= */}

      <section className="bg-gray-50 border-y border-gray-100">

        <div className="container mx-auto px-6 py-20 md:py-24">

          <div className="max-w-5xl mx-auto">

            <div className="mb-10">

              <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">

                {isTR
                  ? "Otel Seçim Rehberi"
                  : "Hotel Selection Guide"}

              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-3 mb-4">

                {isTR
                  ? `${cityName} Oteli Seçerken`
                  : `Choosing a Hotel in ${cityName}`}

              </h2>

              <p className="text-gray-500 max-w-3xl leading-7">

                {isTR
                  ? "Konaklama seçeneklerini değerlendirirken aşağıdaki temel noktaları kontrol edebilirsiniz."
                  : "Consider these key points when comparing accommodation options."}

              </p>

            </div>


            <div className="grid md:grid-cols-2 gap-6">

              {[
                {
                  tr: "Konum ve ulaşım bağlantılarını kontrol edin.",
                  en: "Check the location and transport connections.",
                },
                {
                  tr: "Misafir yorumlarını ve güncel değerlendirmeleri inceleyin.",
                  en: "Review recent guest ratings and reviews.",
                },
                {
                  tr: "Otelin sunduğu olanakları ve oda seçeneklerini karşılaştırın.",
                  en: "Compare hotel facilities and room options.",
                },
                {
                  tr: "Seyahat planınızdaki önemli noktalara olan mesafeyi değerlendirin.",
                  en: "Consider the distance to the places on your itinerary.",
                },
              ].map((tip, index) => (

                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-7 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  <div className="relative flex gap-4">

                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">

                      <CheckCircle2 size={18} />

                    </div>

                    <div>

                      <div className="text-[10px] font-black tracking-widest text-gray-400 mb-2">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <p className="text-gray-700 leading-7">
                        {isTR ? tip.tr : tip.en}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          OTELLER
      ========================================================= */}

      <section className="bg-white">

        <div className="container mx-auto px-6 py-20 md:py-24">

          <div className="max-w-7xl mx-auto">

            <div className="text-center mb-12 md:mb-14">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] mb-5">

                <Hotel size={14} />

                {isTR
                  ? "Konaklama Seçenekleri"
                  : "Accommodation Options"}

              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-5">

                {isTR
                  ? `${cityName} Otelleri`
                  : `Hotels in ${cityName}`}

              </h2>

              <p className="text-gray-500 max-w-2xl mx-auto leading-7">

                {isTR
                  ? `${cityName} için farklı konaklama seçeneklerini inceleyebilir ve size uygun otelleri karşılaştırabilirsiniz.`
                  : `Explore accommodation options in ${cityName} and compare hotels to find a stay that suits your plans.`}

              </p>

            </div>


            {hotel ? (

              <div className="grid gap-8 md:gap-10 grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">

                {/* BOOKING.COM */}

                <HotelCard
                  {...hotel}
                  city={city}
                  lang={lang}
                  provider="booking"
                  link={bookingLink}
                />


                {/* HOTELS.COM */}

                <HotelCard
                  {...hotel}
                  city={city}
                  lang={lang}
                  provider="hotels"
                  link={hotelsLink}
                />

              </div>

            ) : (

              <div className="text-center text-gray-400 py-20 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50">

                {isTR
                  ? "Otel bağlantıları hazırlanıyor."
                  : "Hotel links are being prepared."}

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =========================================================
          ETKİNLİKLER / TURLAR
      ========================================================= */}

      {hasEventPage && (

        <section className="container mx-auto px-6 py-16 md:py-20">

          <div className="max-w-5xl mx-auto">

            <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-8 md:p-12">

              <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">

                {isTR
                  ? "Şehirde Yapılacaklar"
                  : "Things to Do"}

              </span>


              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">

                {isTR
                  ? `${cityName} Turları ve Deneyimleri`
                  : `${cityName} Tours & Experiences`}

              </h2>


              <p className="text-gray-600 leading-7 max-w-3xl mb-7">

                {isTR
                  ? `${cityName} konaklamanızı planlarken şehirde yapabileceğiniz turları, aktiviteleri ve deneyimleri de keşfedin.`
                  : `While planning your stay in ${cityName}, explore tours, activities and experiences you can enjoy in the city.`}

              </p>


              <Link
                href={`/${lang}/etkinlikler/${citySlug}`}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-orange-600 transition-colors duration-300"
              >

                {isTR
                  ? `${cityName} Turlarını ve Deneyimlerini Keşfet →`
                  : `Explore ${cityName} Tours & Experiences →`}

              </Link>

            </div>

          </div>

        </section>

      )}


      {/* =========================================================
          ALT BİLGİ
      ========================================================= */}

      <section className="container mx-auto px-6 py-16 md:py-20">

        <div className="max-w-4xl mx-auto">

          <div className="border-t border-gray-100 pt-10">

            <div className="flex items-center justify-center gap-2 text-orange-500 mb-4">

              <MapPin size={15} />

              <span className="text-xs font-black uppercase tracking-widest">

                {cityName}

              </span>

            </div>

            <p className="text-sm text-gray-400 leading-7 text-center">

              {isTR
                ? `${cityName} konaklama seçeneklerini değerlendirirken otelin konumu, ulaşım bağlantıları, misafir yorumları ve seyahat planınıza yakınlığı birlikte değerlendirmeniz önerilir.`
                : `When choosing accommodation in ${cityName}, consider the hotel's location, transport connections, guest reviews and proximity to the places you plan to visit.`}

            </p>

          </div>

        </div>

      </section>

    </div>
  );
}