import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HotelCityPageClient from "./HotelCityPageClient";
import globalPlaces from "@/data/globalPlaces.json";

type Params = {
  lang: string;
  city: string;
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

const BASE_URL = "https://www.waylero.com";

const LANGS = ["tr", "en"] as const;

const places = globalPlaces as GlobalPlace[];

/*
|--------------------------------------------------------------------------
| GLOBAL ŞEHİR LİSTESİ
|--------------------------------------------------------------------------
|
| Artık HOTEL_CITIES kullanılmıyor.
| Şehirler doğrudan globalPlaces.json içinden geliyor.
|
*/

const HOTEL_CITY_SLUGS = Array.from(
  new Set(
    places
      .map((place) => place.city?.toLowerCase().trim())
      .filter(Boolean)
  )
);

/*
|--------------------------------------------------------------------------
| ŞEHİR ADI
|--------------------------------------------------------------------------
|
| globalPlaces.json içinde şehirlerin ayrı TR/EN isim alanı yok.
| Bu nedenle mevcut slug üzerinden okunabilir bir isim oluşturuyoruz.
|
*/

function formatCityName(city: string, lang: "tr" | "en") {
  const normalized = city.toLowerCase().trim();

  if (normalized === "nevsehir") {
    return lang === "tr" ? "Kapadokya" : "Cappadocia";
  }

  if (normalized === "londra") {
    return lang === "tr" ? "Londra" : "London";
  }

  return normalized
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/*
|--------------------------------------------------------------------------
| ŞEHİR KONTROLÜ
|--------------------------------------------------------------------------
*/

function isValidCity(city: string) {
  return HOTEL_CITY_SLUGS.includes(city.toLowerCase());
}

/*
|--------------------------------------------------------------------------
| METADATA
|--------------------------------------------------------------------------
*/

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, city } = await params;

  if (!LANGS.includes(lang as "tr" | "en")) {
    return {};
  }

  const currentLang = lang as "tr" | "en";
  const citySlug = city.toLowerCase();

  if (!isValidCity(citySlug)) {
    return {};
  }

  const cityName = formatCityName(citySlug, currentLang);

  const title =
    currentLang === "tr"
      ? `${cityName} Otelleri ve Konaklama Rehberi | Waylero`
      : `Best Hotels in ${cityName} | Accommodation Guide | Waylero`;

  const description =
    currentLang === "tr"
      ? `${cityName} için otel ve konaklama seçeneklerini keşfedin. Şehirdeki otelleri inceleyin ve konaklama seçeneklerine göz atın.`
      : `Discover hotels and accommodation options in ${cityName}. Explore hotels and find the right place to stay.`;

  const pageUrl =
    `${BASE_URL}/${currentLang}/hotels/${citySlug}`;

  return {
    metadataBase: new URL(BASE_URL),

    title,
    description,

    alternates: {
      canonical: pageUrl,

      languages: {
        "tr-TR":
          `${BASE_URL}/tr/hotels/${citySlug}`,

        "en-US":
          `${BASE_URL}/en/hotels/${citySlug}`,

        "x-default":
          `${BASE_URL}/tr/hotels/${citySlug}`,
      },
    },

    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      locale:
        currentLang === "tr"
          ? "tr_TR"
          : "en_US",
      siteName: "Waylero",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/*
|--------------------------------------------------------------------------
| SAYFA
|--------------------------------------------------------------------------
*/

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang, city } = await params;

  /*
   * LANG
   */

  if (!LANGS.includes(lang as "tr" | "en")) {
    notFound();
  }

  const currentLang = lang as "tr" | "en";
  const citySlug = city.toLowerCase();

  /*
   * ŞEHİR
   *
   * Artık HOTEL_CITIES yok.
   * globalPlaces.json'daki bütün şehirler geçerli.
   */

  if (!isValidCity(citySlug)) {
    notFound();
  }

  const cityName = formatCityName(
    citySlug,
    currentLang
  );

  const isTR = currentLang === "tr";

  /*
   |--------------------------------------------------------------------------
   | HOTEL DATA
   |--------------------------------------------------------------------------
   |
   | HotelCityPageClient artık şehir adını kullanarak
   | Booking / Hotels.com bağlantılarını oluşturuyor.
   |
   */

  const cityPlace = places.find(
  (place) =>
    place.city?.toLowerCase().trim() === citySlug &&
    place.image
);

const cityImage = cityPlace?.image
  ? `https://res.cloudinary.com/dewd42ppf/image/upload/f_auto,q_auto:eco,w_1200,c_fill/${cityPlace.image.replace(/^\/+/, "")}`
  : undefined;

const cityData = [
  {
    id: citySlug,
    city: citySlug,
    image: cityImage,
  },
];

  /*
   |--------------------------------------------------------------------------
   | JSON-LD
   |--------------------------------------------------------------------------
   */

  const pageUrl =
    `${BASE_URL}/${currentLang}/hotels/${citySlug}`;

  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "WebPage",

    name: isTR
      ? `${cityName} Otelleri`
      : `Hotels in ${cityName}`,

    description: isTR
      ? `${cityName} otelleri ve konaklama seçeneklerini keşfedin.`
      : `Discover hotels and accommodation options in ${cityName}.`,

    url: pageUrl,

    inLanguage: currentLang,

    isPartOf: {
      "@type": "WebSite",
      name: "Waylero",
      url: BASE_URL,
    },

    breadcrumb: {
      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,

          name: isTR
            ? "Anasayfa"
            : "Home",

          item:
            `${BASE_URL}/${currentLang}`,
        },

        {
          "@type": "ListItem",
          position: 2,

          name: isTR
            ? "Oteller"
            : "Hotels",

          item:
            `${BASE_URL}/${currentLang}/hotels`,
        },

        {
          "@type": "ListItem",
          position: 3,

          name: cityName,

          item: pageUrl,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <HotelCityPageClient
        city={citySlug}
        lang={currentLang}
        cityHotels={cityData}
      />
    </>
  );
}

/*
|--------------------------------------------------------------------------
| STATIC PARAMS
|--------------------------------------------------------------------------
|
| Artık sadece 13 şehir yok.
|
| globalPlaces.json içinde bulunan bütün şehirler:
|
| İstanbul
| Berlin
| Paris
| Roma
| ...
|
| TR + EN olarak oluşturulur.
|
*/

export function generateStaticParams() {
  return HOTEL_CITY_SLUGS.flatMap((city) =>
    LANGS.map((lang) => ({
      lang,
      city,
    }))
  );
}