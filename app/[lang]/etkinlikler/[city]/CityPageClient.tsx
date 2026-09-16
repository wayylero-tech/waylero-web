
"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  ChevronDown,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import Link from "next/link";

import globalPlaces from "@/data/globalPlaces.json";

type Lang = "tr" | "en";

type Place = {
  country?: string;
  city?: string;
  slug?: string;
  name_tr?: string;
  name_en?: string;
  image?: string;
};

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width = 1600) => {
  if (!path) return "";

  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(
    /^\/+/,
    ""
  )}`;
};

/* =========================================================
   STAY22
   ========================================================= */

const STAY22_AID = "waylero";

const getStay22Link = (
  provider: "getyourguide",
  cityName: string
) => {
  const getYourGuideUrl =
    "https://www.getyourguide.com/destinations/nevsehir-l121020/";

  return `https://www.stay22.com/allez/${provider}?aid=${STAY22_AID}&link=${encodeURIComponent(
    getYourGuideUrl
  )}`;
};

/* =========================================================
   ŞEHİR İSMİ
   ========================================================= */




const getCityName = (citySlug: string, lang: Lang) => {
  const slug = citySlug.toLowerCase().trim();

  const place = (globalPlaces as Place[]).find(
    (item) =>
      item.city?.toLowerCase().trim() === slug
  );

  const name = place?.city || citySlug;

  return name
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function EtkinliklerCityClient({
  city,
  lang,
}: {
  city: string;
  lang: Lang;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isTR = lang === "tr";

  /* =======================================================
     ŞEHİR
     ======================================================= */

  const cityInfo = useMemo(() => {
    const places = globalPlaces as Place[];

    const cityPlaces = places.filter(
      (item) =>
        item.city?.toLowerCase().trim() ===
        city.toLowerCase().trim()
    );

    const firstPlace = cityPlaces[0];

    if (!firstPlace) return null;

    return {
      id: city.toLowerCase().trim(),
      image:
        cityPlaces.find((item) => item.image)?.image || "",
      places: cityPlaces,
    };
  }, [city]);

  /* =======================================================
     ŞEHİR BULUNAMADI
     ======================================================= */

  if (!cityInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <MapPin
            size={48}
            className="mx-auto mb-5 text-gray-300"
          />

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isTR
              ? "Şehir bulunamadı"
              : "City not found"}
          </h1>

          <Link
            href={`/${lang}/etkinlikler`}
            className="inline-flex px-6 py-3 rounded-2xl bg-gray-900 text-white font-bold"
          >
            {isTR
              ? "Etkinliklere Dön"
              : "Back to Experiences"}
          </Link>
        </div>
      </div>
    );
  }

  /* =======================================================
     ŞEHİR İSMİ
     ======================================================= */

  const cityName = getCityName(
    cityInfo.id,
    lang
  );

  const stay22CityName = `${getCityName(
    cityInfo.id,
    "en"
  )}, Turkey`;

  /* =======================================================
     STAY22 / GETYOURGUIDE
     ======================================================= */

  const getYourGuideLink = getStay22Link(
    "getyourguide",
    stay22CityName
  );

  /* =======================================================
     RETURN
     ======================================================= */

  return (
    <div className="min-h-screen bg-white">

      {/* =====================================================
    HERO
===================================================== */}

<section className="relative overflow-hidden pt-32 pb-32">

  {/* Zemin */}
  <div className="absolute inset-0 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]" />

  {/* Şehir görseli */}
  {cityInfo.image && (
    <div
      className="absolute inset-0 bg-cover bg-center opacity-20"
      style={{
        backgroundImage: `url("${getCloudinaryUrl(
          cityInfo.image,
          1600
        )}")`,
      }}
    />
  )}

  <div className="relative container mx-auto px-6 text-center">

    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">

      <Compass size={14} />

      {isTR
        ? "Turlar ve Deneyimler"
        : "Tours & Experiences"}

    </div>

    <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6">

      {isTR
        ? `${cityName} Turları ve Deneyimleri`
        : `${cityName} Tours & Experiences`}

    </h1>

    <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-8">

      {isTR
        ? `${cityName} şehrindeki turları, aktiviteleri ve deneyimleri keşfedin. Farklı seçenekleri inceleyerek seyahatinize uygun etkinlikleri bulun.`
        : `Discover tours, activities and experiences in ${cityName}. Explore different options and find experiences that fit your trip.`}

    </p>

  </div>

</section>

      {/* =====================================================
          TUR VE AKTİVİTELER
      ===================================================== */}

      <section className="container mx-auto px-6 py-20">

        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">

            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              {isTR
                ? "Şehrini Keşfet"
                : "Explore the City"}
            </span>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-5">

              {isTR
                ? `${cityName} Turları ve Aktiviteleri`
                : `${cityName} Tours & Activities`}

            </h2>

            <p className="max-w-2xl mx-auto text-gray-500 leading-7">

              {isTR
                ? `${cityName} için farklı tur, aktivite ve deneyim seçeneklerini aşağıdaki platformda inceleyebilirsiniz.`
                : `Browse different tours, activities and experiences in ${cityName} through the platform below.`}

            </p>

          </div>

          {/* =================================================
              GETYOURGUIDE
          ================================================= */}

          <div className="max-w-xl mx-auto">

            <a
              href={getYourGuideLink}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="group block rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              <div className="flex items-start justify-between gap-5 mb-7">

                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Compass size={25} />
                </div>

                <ArrowUpRight
                  size={22}
                  className="text-gray-300 group-hover:text-orange-600 transition"
                />

              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                GetYourGuide
              </h3>

              <p className="text-gray-500 leading-7 mb-7">

                {isTR
                  ? `${cityName} içindeki turları, aktiviteleri ve deneyimleri keşfedin.`
                  : `Discover tours, activities and experiences in ${cityName}.`}

              </p>

              <span className="inline-flex items-center gap-2 font-bold text-orange-600">

                {isTR
                  ? "Turları İncele"
                  : "Explore Tours"}

                <ArrowUpRight size={17} />

              </span>

            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          STAY22
      ===================================================== */}

      <section className="bg-gray-900 py-20">

        <div className="container mx-auto px-6">

          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-widest mb-6">

              {isTR
                ? "Şehrindeki Deneyimleri Keşfet"
                : "Discover Experiences"}

            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-5">

              {isTR
                ? `${cityName} için Daha Fazla Aktivite`
                : `More Things to Do in ${cityName}`}

            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto mb-9 leading-7">

              {isTR
                ? `${cityName} için farklı tur ve deneyim seçeneklerini inceleyerek seyahat planınıza uygun aktiviteleri keşfedebilirsiniz.`
                : `Explore more tours and experiences in ${cityName} and find activities that fit your travel plans.`}

            </p>

            <div className="flex justify-center">

              <a
                href={getYourGuideLink}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition"
              >
                GetYourGuide
                <ArrowUpRight size={18} />
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="container mx-auto px-6 py-20">

        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-10">

            {isTR
              ? `${cityName} Turları Hakkında Sık Sorulan Sorular`
              : `Frequently Asked Questions About ${cityName} Tours`}

          </h2>

          <div className="space-y-4">

            {[
              {
                tr: `${cityName}'da hangi turlar yapılabilir?`,
                en: `What tours can you take in ${cityName}?`,
                trA: `${cityName} için şehir turları, günlük geziler, aktiviteler ve farklı deneyim seçenekleri bulunabilir.`,
                enA: `You can find city tours, day trips, activities and different experiences in ${cityName}.`,
              },
              {
                tr: `${cityName}'da tur ve aktivite nereden bulunur?`,
                en: `Where can you find tours and activities in ${cityName}?`,
                trA: `${cityName} için GetYourGuide üzerinden mevcut tur ve deneyim seçeneklerini inceleyebilirsiniz.`,
                enA: `You can explore available tours and experiences in ${cityName} through GetYourGuide.`,
              },
            ].map((item, index) => {

              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl overflow-hidden"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 p-6 text-left font-bold text-gray-900"
                  >

                    <span>
                      {isTR
                        ? item.tr
                        : item.en}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 transition-transform ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-gray-600 leading-7">
                      {isTR
                        ? item.trA
                        : item.enA}
                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </section>

    </div>
  );
}
