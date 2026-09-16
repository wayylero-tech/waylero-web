"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Hotel,
  ArrowDown,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import Stay22Script from "@/components/Stay22Script";
import globalPlaces from "@/data/globalPlaces.json";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";

  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(
    /^\/+/,
    ""
  )}`;
};

type GlobalPlace = {
  country: string;
  city: string;
  slug: string;
  name_tr: string;
  name_en: string;
  lat: number;
  lng: number;
  image: string;
};

interface HotelCityData {
  id: string;
  city: string;
  image?: string;
}

interface HotelCityPageClientProps {
  city: string;
  cityHotels?: HotelCityData[];
  lang: "tr" | "en";
}

export default function HotelCityPageClient({
  city,
  cityHotels,
  lang,
}: HotelCityPageClientProps) {
  const isTR = lang === "tr";

  const citySlug = city.toLowerCase().trim();

  const cityImage =
    (globalPlaces as GlobalPlace[]).find(
      (place) =>
        place.city?.toLowerCase().trim() === citySlug &&
        place.image
    )?.image || "";

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
          .map((word) =>
            word ? word.charAt(0).toUpperCase() + word.slice(1) : ""
          )
          .join(" ");

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

  return (
    <>
      <Stay22Script />

      <div className="min-h-screen bg-white">

        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* Mevcut arka plan */}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]" />

          {/* Şehir fotoğrafı */}
          {cityImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url("${getCloudinaryUrl(
                  cityImage,
                  1600
                )}")`,
              }}
            />
          )}

          {/* HERO içeriği */}
          <div className="relative container mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
            <div className="max-w-4xl mx-auto text-center">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white shadow-sm text-sm font-bold text-gray-700 mb-6">
                <Hotel size={17} />
                {isTR ? "Konaklama Rehberi" : "Accommodation Guide"}
              </div>

              <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6">
                {isTR
                  ? `${cityName} Otelleri`
                  : `${cityName} Hotels`}
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {isTR
                  ? `${cityName} seyahatiniz için konaklama seçeneklerini keşfedin.`
                  : `Discover accommodation options for your trip to ${cityName}.`}
              </p>

              <div className="mt-10 flex justify-center">
                <a
                  href="#hotels"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-orange-500 transition-colors"
                >
                  {isTR ? "Otelleri Keşfet" : "Explore Hotels"}
                  <ArrowDown size={18} />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* KONAKLAMA */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 text-orange-500 font-bold mb-4">
              <MapPin size={18} />
              {cityName}
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              {isTR
                ? `${cityName} Konaklama`
                : `Accommodation in ${cityName}`}
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              {isTR
                ? `${cityName} ziyaretiniz sırasında konaklayabileceğiniz otelleri ve konaklama seçeneklerini keşfedin.`
                : `Explore hotels and accommodation options for your visit to ${cityName}.`}
            </p>

          </div>
        </section>

        {/* STAY22 OTEL HARİTASI */}
        <section
          id="hotels"
          className="container mx-auto px-6 pb-24"
        >
          <div className="max-w-6xl mx-auto">

            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                {isTR ? "Otelleri Keşfet" : "Explore Hotels"}
              </h2>

              <p className="text-gray-600">
                {isTR
                  ? `${cityName} bölgesindeki otelleri harita üzerinden inceleyebilirsiniz.`
                  : `Explore hotels in ${cityName} on the map.`}
              </p>
            </div>

            <div className="rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl">
              <iframe
                src={`https://www.stay22.com/embed/gm?aid=waylero&address=${encodeURIComponent(
                  cityName
                )}`}
                style={{
                  width: "100%",
                  height: "500px",
                  border: "none",
                }}
                loading="lazy"
                title={`${cityName} hotels map`}
              />
            </div>

          </div>
        </section>

        {/* OTEL SEÇERKEN */}
        <section className="bg-gray-50 py-24">
          <div className="container mx-auto px-6">

            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-10 text-center">
                {isTR
                  ? "Otel Seçerken Nelere Dikkat Etmeli?"
                  : "What to Consider When Choosing a Hotel?"}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                {[
                  isTR
                    ? "Konum ve ulaşım imkanlarını kontrol edin."
                    : "Check the location and transportation options.",

                  isTR
                    ? "Gezilecek yerlere yakınlığını değerlendirin."
                    : "Consider how close it is to attractions.",

                  isTR
                    ? "Otel yorumlarını ve puanlarını inceleyin."
                    : "Check hotel reviews and ratings.",

                  isTR
                    ? "İhtiyaçlarınıza uygun oda ve hizmetleri karşılaştırın."
                    : "Compare rooms and services that suit your needs.",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4"
                  >
                    <CheckCircle2
                      className="text-green-500 shrink-0"
                      size={22}
                    />

                    <p className="text-gray-700 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </section>

        {/* ETKİNLİKLER / TURLAR */}
        {hasEventPage && (
          <section className="container mx-auto px-6 py-24">
            <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-gray-900 text-white p-10 md:p-16 text-center">

              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-5">
                {isTR
                  ? `${cityName} Turları ve Etkinlikleri`
                  : `${cityName} Tours & Activities`}
              </h2>

              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                {isTR
                  ? `${cityName} seyahatinizde yapabileceğiniz turları, aktiviteleri ve deneyimleri keşfedin.`
                  : `Discover tours, activities and experiences to enjoy during your trip to ${cityName}.`}
              </p>

              <Link
                href={`/${lang}/etkinlikler/${citySlug}`}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-400 transition-colors"
              >
                {isTR
                  ? "Turları ve Etkinlikleri Gör"
                  : "View Tours & Activities"}

                <ArrowDown
                  size={18}
                  className="-rotate-90"
                />
              </Link>

            </div>
          </section>
        )}

        {/* ALT BİLGİ */}
        <section className="border-t border-gray-100 py-16">
          <div className="container mx-auto px-6 text-center">

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
              {isTR
                ? `${cityName} seyahatinizi planlayın`
                : `Plan your trip to ${cityName}`}
            </h2>

            <p className="text-gray-600">
              {isTR
                ? "Konaklama seçeneklerinizi inceleyin ve seyahatinizi planlamaya başlayın."
                : "Explore accommodation options and start planning your trip."}
            </p>

          </div>
        </section>

      </div>
    </>
  );
}