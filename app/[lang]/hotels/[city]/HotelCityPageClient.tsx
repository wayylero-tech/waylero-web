"use client";

import HotelCard from "@/components/HotelCard";
import Stay22Script from "@/components/Stay22Script";
import Link from "next/link";
import {
  Hotel,
  ArrowDown,
  MapPin,
  CheckCircle2,
  Map,
} from "lucide-react";

type HotelCityData = {
  id: string;
  city: string;
  image?: string;
};

// 🌟 Props arayüzüne şehrin özel açıklamalarını ekliyoruz
interface HotelCityPageClientProps {
  city: string;
  cityHotels: HotelCityData[];
  lang: "tr" | "en";
  cityDescription?:
    | {
        tr?: string;
        en?: string;
      }
    | string;
}

export default function HotelCityPageClient({
  city,
  cityHotels,
  lang,
  cityDescription,
}: HotelCityPageClientProps) {
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
  | 🌟 DİNAMİK AÇIKLAMA ÇÖZÜCÜ
  |--------------------------------------------------------------------------
  */
  const getLocalizedDescription = () => {
    if (!cityDescription) {
      return isTR
        ? `${cityName} seyahatiniz için otel seçerken konum, ulaşım bağlantıları, tesis olanakları, misafir değerlendirmeleri ve seyahat planınıza yakınlık gibi noktaları birlikte değerlendirebilirsiniz.`
        : `When choosing a hotel in ${cityName}, consider the location, transport connections, hotel facilities, guest reviews and proximity to the places you plan to visit.`;
    }

    if (typeof cityDescription === "object") {
      return isTR 
        ? (cityDescription.tr || cityDescription.en || "") 
        : (cityDescription.en || cityDescription.tr || "");
    }

    return cityDescription;
  };

  const dynamicDescription = getLocalizedDescription();

  /*
  |--------------------------------------------------------------------------
  | SAYFA
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-white">

      <Stay22Script />

      {/* =========================================================
          HERO (Görsel Dokulu, Kompakt & Orijinal Gradientli)
      ========================================================= */}

      <section className="relative overflow-hidden">

        {/* Orijinal Gradient Zemin */}
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]" />

        {/* Saydam Fotoğraf (Doku) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/otel-hero.webp')",
          }}
        />

        {/* Ambient Blur Efektleri */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none" />

        {/* İçerik */}
        <div className="relative container mx-auto px-6 pt-20 md:pt-24 pb-10 md:pb-12">

          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-orange-100 shadow-sm text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] mb-4">

              <Hotel size={14} />

              {isTR
                ? "Konaklama Rehberi"
                : "Accommodation Guide"}

            </div>

            {/* Title */}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900 leading-tight mb-3">

              {isTR
                ? `${cityName} Otelleri`
                : `Hotels in ${cityName}`}

            </h1>

            {/* Description */}

            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">

              {isTR
                ? `${cityName} konaklama seçeneklerini keşfedin, otelleri inceleyin ve seyahatinize uygun konaklama seçeneğini bulun.`
                : `Explore accommodation options in ${cityName}, compare hotels and find a stay that suits your trip.`}

            </p>

            {/* Scroll Icon */}

            <div className="mt-5 flex justify-center">

              <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400">

                <ArrowDown size={15} />

              </div>

            </div>

          </div>

        </div>

      </section>

{/* =========================================================
    REZERVASYON VE FİYAT KARŞILAŞTIRMA SEÇENEKLERİ
========================================================= */}
<section className="bg-white border-b border-gray-100">
  <div className="container mx-auto px-6 py-10 md:py-14">
    <div className="max-w-7xl mx-auto">

      {/* ANA SEÇENEKLER BAŞLIĞI */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] mb-3">
          <Hotel size={14} />
          {isTR ? "Konaklama & Rezervasyon Seçenekleri" : "Accommodation & Booking Options"}
        </div>
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
          {isTR ? `${cityName} İçin En Uygun Oteli Bulun` : `Find the Best Stay in ${cityName}`}
        </h2>
        <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {isTR
            ? "Favori platformunuz üzerinden direkt otel arayabilir veya canlı harita üzerinden tüm firmaların fiyatlarını tek ekranda karşılaştırabilirsiniz."
            : "Search directly on your preferred platform or compare prices across all providers on the live map."}
        </p>
      </div>

      {/* 1. SEÇENEK: DİREKT ARAMA KARTLARI (BOOKING & HOTELS) */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs">1</span>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {isTR ? "Popüler Rezervasyon Siteleriyle Ara" : "Search via Popular Booking Sites"}
          </h3>
        </div>

        {hotel ? (
          <div className="grid gap-8 md:gap-10 grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
            {/* BOOKING.COM KARTI */}
            <HotelCard
              {...hotel}
              city={city}
              lang={lang}
              provider="booking"
              link={bookingLink}
            />

            {/* HOTELS.COM KARTI */}
            <HotelCard
              {...hotel}
              city={city}
              lang={lang}
              provider="hotels"
              link={hotelsLink}
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50">
            {isTR ? "Otel bağlantıları hazırlanıyor." : "Hotel links are being prepared."}
          </div>
        )}
      </div>

      {/* 2. SEÇENEK: CANLI HARİTA & TÜM FİRMALARI KARŞILAŞTIRMA */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs">2</span>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {isTR ? "Alternatif: Canlı Haritada Tüm Firmaların Fiyatlarını Karşılaştır" : "Alternative: Compare All Provider Prices on Live Map"}
          </h3>
        </div>

        <div className="bg-gray-50 rounded-[2rem] border border-gray-200 p-4 md:p-6 shadow-sm">
          {/* HARİTA ÜST BİLGİ KUTUSU */}
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Map size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">
                  {isTR ? "Tüm Platformlar Tek Haritada" : "All Platforms on One Map"}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {isTR
                    ? "Bu harita Booking, Vrbo, Agoda ve diğer sağlayıcıların canlı oda ve kiralık ev fiyatlarını gösterir. Harita üzerinden doğrudan seçip alabilirsiniz."
                    : "This map aggregates live prices from Booking, Vrbo, Agoda and more. Select and book directly from the map."}
                </p>
              </div>
            </div>

            <span className="self-start md:self-auto text-[11px] font-extrabold bg-orange-50 border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg whitespace-nowrap">
              {isTR ? "Canlı Fiyat Karşılaştırma" : "Live Price Comparison"}
            </span>
          </div>

          {/* STAY22 CANLI HARİTA WIDGET */}
          <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <iframe
              id="stay22-widget"
              width="100%"
              height="450"
              src={`https://www.stay22.com/embed/gm?aid=6aaac701544011661e5125e5&address=${encodeURIComponent(cityName)}`}
              style={{ border: 0 }}
              loading="lazy"
              title={`${cityName} Live Map`}
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
     {/* =========================================================
    KONAKLAMA (SEO VE ŞEHRE ÖZEL AÇIKLAMA DİNAMİK OLARAK BURADA)
========================================================= */}
<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
  {/* Genişlik max-w-5xl yerine max-w-[1440px] yapıldı */}
  <div className="max-w-[1320px] mx-auto">
    <div className="rounded-[2.5rem] bg-gray-50 border border-gray-100 p-8 md:p-12 lg:p-14">
      <div className="w-full">
        <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
          {isTR ? "Konaklama Rehberi" : "Accommodation Guide"}
        </span>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-3 mb-6">
          {isTR
            ? `${cityName} Nerede Kalınır?`
            : `Where to Stay in ${cityName}`}
        </h2>

        {/* Şehre Özel Özgün JSON Açıklaması */}
        <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed">
          {dynamicDescription
            .split("\n")
            .filter(Boolean)
            .map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
        </div>
      </div>
    </div>
  </div>
</section>


      {/* =========================================================
          OTEL SEÇERKEN (SADELEŞTİRİLMİŞ İPUÇLARI)
      ========================================================= */}

      <section className="bg-gray-50 border-y border-gray-100">

        <div className="container mx-auto px-6 py-12 md:py-16">

          <div className="max-w-5xl mx-auto">

            <div className="mb-8">

              <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">

                {isTR
                  ? "Otel Seçim Rehberi"
                  : "Hotel Selection Guide"}

              </span>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-2 mb-2">

                {isTR
                  ? `${cityName} Oteli Seçerken`
                  : `Choosing a Hotel in ${cityName}`}

              </h2>

              <p className="text-sm md:text-base text-gray-500 max-w-3xl leading-relaxed">

                {isTR
                  ? "Konaklama seçeneklerini değerlendirirken aşağıdaki temel noktaları kontrol edebilirsiniz."
                  : "Consider these key points when comparing accommodation options."}

              </p>

            </div>


            <div className="grid md:grid-cols-2 gap-4 md:gap-6">

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
                  className="group relative overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >

                  <div className="relative flex gap-4 items-center">

                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">

                      <CheckCircle2 size={18} />

                    </div>

                    <div>

                      <div className="text-[10px] font-black tracking-widest text-gray-400 mb-1">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <p className="text-sm md:text-base text-gray-700 font-medium leading-snug">
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
          ETKİNLİKLER / TURLAR
      ========================================================= */}

      {hasEventPage && (

        <section className="container mx-auto px-6 py-12 md:py-16">

          <div className="max-w-5xl mx-auto">

            <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-8 md:p-12">

              <span className="text-orange-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">

                {isTR
                  ? "Şehirde Yapılacaklar"
                  : "Things to Do"}

              </span>


              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-2 mb-3">

                {isTR
                  ? `${cityName} Turları ve Deneyimleri`
                  : `${cityName} Tours & Experiences`}

              </h2>


              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mb-6">

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
          ALT BİLGİ / FOOTER
      ========================================================= */}

      <section className="container mx-auto px-6 py-12 md:py-16">

        <div className="max-w-4xl mx-auto">

          <div className="border-t border-gray-100 pt-8">

            <div className="flex items-center justify-center gap-2 text-orange-500 mb-3">

              <MapPin size={15} />

              <span className="text-xs font-black uppercase tracking-widest">

                {cityName}

              </span>

            </div>

            <p className="text-xs md:text-sm text-gray-400 leading-relaxed text-center">

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