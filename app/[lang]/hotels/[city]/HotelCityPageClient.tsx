"use client";

import HotelCard from "@/components/HotelCard";
import Link from "next/link";
import { MapPin, Hotel, CheckCircle2, ArrowDown } from "lucide-react";
import { hotelCityData } from "./hotelCityData";


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
  const citySlug = city.toLowerCase();

  const content = hotelCityData[citySlug];

  // Güvenlik
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-gray-500">
          {isTR ? "Şehir bulunamadı." : "City not found."}
        </p>
      </div>
    );
  }

  const cityName = content.name[lang];
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
   * ============================================================
   * AFFILIATE LİNKLER
   * ============================================================
   */

  const cityLinks: {
    [key: string]: {
      booking?: string;
      hotels?: string;
    };
  } = {
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

  const links = cityLinks[citySlug];

  const hotel = cityHotels?.[0];

  return (
    <div className="min-h-screen bg-white">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffaf6_0%,#f8fbfc_55%,#edf7fa_100%)]">

        {/* Decorative shapes */}
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
              {cityName}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-8">
              {isTR
                ? `${cityName} için konaklama bölgelerini, otel seçeneklerini ve seyahatiniz için faydalı ipuçlarını keşfedin.`
                : `Discover the best areas to stay, hotel options and useful accommodation tips for your trip to ${cityName}.`}
            </p>

            {/* Small scroll hint */}
            <div className="mt-10 flex justify-center">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400">
                <ArrowDown size={17} />
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          ŞEHİR HAKKINDA
      ========================================================= */}

      <section className="container mx-auto px-6 py-16 md:py-20">

        <div className="max-w-5xl mx-auto">

          <div className="rounded-[2.5rem] bg-gray-50 border border-gray-100 p-8 md:p-12 lg:p-14">

            <div className="max-w-4xl">

              <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                {isTR
                  ? "Şehri Tanıyın"
                  : "Discover the City"}
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-3 mb-6">
                {isTR
                  ? `${cityName} Hakkında`
                  : `About ${cityName}`}
              </h2>

              <p className="text-gray-600 text-base md:text-lg leading-8">
                {content.intro[lang]}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          NEREDE KALINIR
      ========================================================= */}

      <section className="container mx-auto px-6 pb-16 md:pb-20">

        <div className="max-w-4xl mx-auto">

          <div className="mb-7">

            <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              {isTR
                ? "Konaklama Rehberi"
                : "Accommodation Guide"}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-3">
              {isTR
                ? `${cityName} Nerede Kalınır?`
                : `Where to Stay in ${cityName}`}
            </h2>

          </div>

          <p className="text-gray-600 text-base md:text-lg leading-8">
            {content.whereToStay[lang]}
          </p>

        </div>

      </section>


      {/* =========================================================
          BÖLGELER
      ========================================================= */}

      <section className="bg-gray-50 border-y border-gray-100">

        <div className="container mx-auto px-6 py-20 md:py-24">

          <div className="max-w-5xl mx-auto">

            <div className="mb-10">

              <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                {isTR
                  ? "Bölge Rehberi"
                  : "Area Guide"}
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-3 mb-4">
                {isTR
                  ? "Öne Çıkan Konaklama Bölgeleri"
                  : "Best Areas to Stay"}
              </h2>

              <p className="text-gray-500 max-w-3xl leading-7">
                {isTR
                  ? `${cityName} içinde konaklama seçerken değerlendirebileceğiniz başlıca bölgeler.`
                  : `The main areas to consider when choosing accommodation in ${cityName}.`}
              </p>

            </div>


            <div className="grid md:grid-cols-2 gap-6">

              {content.areas.map((area, index) => (

                <div
                  key={area.name.en}
                  className="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-7 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Big number */}
                  <div className="absolute -top-3 -right-1 text-[90px] md:text-[110px] font-serif font-bold text-gray-50 leading-none select-none pointer-events-none">
                    {String(index + 1).padStart(2, "0")}
                  </div>


                  <div className="relative">

                    <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                      <MapPin size={18} />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      {area.name[lang]}
                    </h3>

                    <p className="text-gray-600 leading-7">
                      {area.description[lang]}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          KONAKLAMA İPUÇLARI
      ========================================================= */}

      <section className="container mx-auto px-6 py-20 md:py-24">

        <div className="max-w-4xl mx-auto">

          <div className="mb-10">

            <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              {isTR
                ? "Faydalı Bilgiler"
                : "Useful Information"}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-3">
              {isTR
                ? "Konaklama İpuçları"
                : "Accommodation Tips"}
            </h2>

          </div>


          <div className="space-y-4">

            {content.tips[lang].map((tip, index) => (

              <div
                key={index}
                className="flex gap-4 md:gap-5 items-start rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
              >

                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-black">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex gap-3 pt-1">

                  <CheckCircle2
                    size={17}
                    className="flex-shrink-0 text-orange-500 mt-0.5"
                  />

                  <p className="text-gray-600 leading-7">
                    {tip}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          OTEL / AFFILIATE
      ========================================================= */}

      <section className="bg-gray-50 border-y border-gray-100">

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
                  ? `${cityName} seyahatiniz için konaklama seçeneklerini inceleyebilir ve size uygun otelleri karşılaştırabilirsiniz.`
                  : `Explore accommodation options for your ${cityName} trip and compare hotels to find a stay that suits your plans.`}
              </p>

            </div>


            {hotel ? (

              <div
                className={`
                  grid gap-8 md:gap-10 mx-auto
                  ${
                    links?.booking && links?.hotels
                      ? "grid-cols-1 lg:grid-cols-2 max-w-7xl"
                      : "grid-cols-1 max-w-4xl"
                  }
                `}
              >

                {links?.booking && (

                  <HotelCard
                    {...hotel}
                    city={city}
                    lang={lang}
                    provider="booking"
                    link={links.booking}
                  />

                )}

                {links?.hotels && (

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

              <div className="text-center text-gray-400 py-20 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white">
                {isTR
                  ? "Otel bulunamadı"
                  : "No hotel found"}
              </div>

            )}

          </div>

        </div>

      </section>
{hasEventPage && (
  <section className="container mx-auto px-6 py-16 md:py-20">
    <div className="max-w-5xl mx-auto">
      <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-8 md:p-12">
        
        <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
          {isTR ? "Şehirde Yapılacaklar" : "Things to Do"}
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
