"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ChevronRight, Globe2 } from "lucide-react";

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

type HotelCity = {
  id: string;
  country: string;
  name: {
    tr: string;
    en: string;
  };
  image: string;
};

/*
 * globalPlaces.json içinden TÜM şehirleri oluşturuyoruz.
 *
 * - Aynı şehir tek kart olur.
 * - Image şartı yoktur.
 * - Şehrin kayıtları içerisindeki ilk dolu image kullanılır.
 */
const cities: HotelCity[] = Array.from(
  new Map(
    (globalPlaces as GlobalPlace[])
      .filter((place) => place.city && place.country)
      .map((place) => {
        const cityId = place.city.toLowerCase().trim();

        return [
          cityId,
          {
            id: cityId,
            country: place.country.toLowerCase().trim(),
            name: {
              tr: cityId,
              en: cityId,
            },
            image: "",
          },
        ];
      })
  ).values()
).map((city) => {
  const firstImage = (globalPlaces as GlobalPlace[]).find(
    (place) =>
      place.city &&
      place.city.toLowerCase().trim() === city.id &&
      place.image
  );

  return {
    ...city,
    image: firstImage?.image || "",
  };
});

const formatName = (value: string) => {
  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((word) => {
      if (!word) return "";

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export default function HotelsClient({
  currentLang,
}: {
  currentLang: "tr" | "en";
}) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const t =
    currentLang === "tr"
      ? {
          title: "Otelleri Keşfet",
          subtitle: "Ülke veya şehir seçerek otelleri keşfet.",
          country: "Ülke Seç",
          city: "Şehir Seç",
          allCountries: "Tüm Ülkeler",
          allCities: "Tüm Şehirler",
          noResults: "Bu seçime uygun şehir bulunamadı.",
        }
      : {
          title: "Discover Hotels",
          subtitle: "Choose a country or city to explore hotels.",
          country: "Select Country",
          city: "Select City",
          allCountries: "All Countries",
          allCities: "All Cities",
          noResults: "No cities found for this selection.",
        };

  /*
   * Ülkeleri globalPlaces.json'dan otomatik çıkarıyoruz.
   */
  const countries = useMemo(() => {
    return Array.from(
      new Set(
        cities
          .map((city) => city.country)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      formatName(a).localeCompare(
        formatName(b),
        currentLang === "tr" ? "tr-TR" : "en-US"
      )
    );
  }, [currentLang]);

  /*
   * Ülke seçildiyse sadece o ülkenin şehirlerini göster.
   */
  const availableCities = useMemo(() => {
    return cities
      .filter(
        (city) =>
          !selectedCountry || city.country === selectedCountry
      )
      .sort((a, b) =>
        formatName(a.name[currentLang]).localeCompare(
          formatName(b.name[currentLang]),
          currentLang === "tr" ? "tr-TR" : "en-US"
        )
      );
  }, [selectedCountry, currentLang]);

  /*
   * Filtrelenmiş şehirler.
   */
  const filteredCities = useMemo(() => {
    return cities
      .filter((city) => {
        const countryMatch =
          !selectedCountry || city.country === selectedCountry;

        const cityMatch =
          !selectedCity || city.id === selectedCity;

        return countryMatch && cityMatch;
      })
      .sort((a, b) =>
        formatName(a.name[currentLang]).localeCompare(
          formatName(b.name[currentLang]),
          currentLang === "tr" ? "tr-TR" : "en-US"
        )
      );
  }, [selectedCountry, selectedCity, currentLang]);

  const getLocalizedLink = (cityId: string) => {
    return `/${currentLang}/hotels/${cityId}`;
  };

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const country = event.target.value;

    setSelectedCountry(country);
    setSelectedCity("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
     <section className="relative overflow-hidden pt-32 pb-32">
  {/* Mevcut zemin */}
  <div className="absolute inset-0 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]" />

  {/* Saydam fotoğraf */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-20"
    style={{
      backgroundImage: "url('/assets/otel-hero.webp')",
    }}
  />

  {/* İçerik */}
  <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            {t.title}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            {t.subtitle}
          </p>

          {/* FILTER */}
          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* COUNTRY */}
              <div className="relative text-left">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 px-2">
                  <Globe2 size={17} />
                  {t.country}
                </label>

                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-800 font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    {t.allCountries}
                  </option>

                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {formatName(country)}
                    </option>
                  ))}
                </select>
              </div>

              {/* CITY */}
              <div className="relative text-left">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 px-2">
                  <MapPin size={17} />
                  {t.city}
                </label>

                <select
                  value={selectedCity}
                  onChange={(event) =>
                    setSelectedCity(event.target.value)
                  }
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-800 font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    {t.allCities}
                  </option>

                  {availableCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {formatName(city.name[currentLang])}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITY CARDS */}
      <section className="container mx-auto px-6 py-24 relative z-10">
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCities.map((city) => {
              const cityName = formatName(city.name[currentLang]);

              return (
                <Link
                  key={city.id}
                  href={getLocalizedLink(city.id)}
                  className="group block h-[420px] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative"
                >
                  {city.image ? (
                    <img
                      src={getCloudinaryUrl(city.image, 800)}
                      alt={
                        currentLang === "tr"
                          ? `${cityName} otelleri`
                          : `${cityName} hotels`
                      }
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MapPin
                        size={48}
                        className="text-gray-400"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex items-center gap-2 mb-2 text-blue-300 text-[10px] uppercase tracking-widest font-black">
                      <MapPin size={12} />
                      <span>{cityName}</span>
                    </div>

                    <h2 className="text-white text-3xl font-black mb-3">
                      {cityName}
                    </h2>

                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-all duration-700">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin
              size={42}
              className="mx-auto mb-4 text-gray-300"
            />

            <p className="text-lg font-semibold text-gray-500">
              {t.noResults}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}