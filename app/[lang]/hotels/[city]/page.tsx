import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HotelCityPageClient from "./HotelCityPageClient";
import {
  HOTEL_CITIES,
  hotelCityData,
} from "./hotelCityData";

type Params = {
  lang: string;
  city: string;
};

const BASE_URL = "https://www.waylero.com";

const LANGS = ["tr", "en"] as const;


/*
|--------------------------------------------------------------------------
| ŞEHİR SAYFASI
|--------------------------------------------------------------------------
*/

function getCityContent(city: string) {
  const citySlug = city.toLowerCase();

  return hotelCityData[citySlug];
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

  const citySlug = city.toLowerCase();

  if (
    !LANGS.includes(lang as "tr" | "en") ||
    !HOTEL_CITIES.includes(
      citySlug as (typeof HOTEL_CITIES)[number]
    )
  ) {
    return {};
  }

  const content = getCityContent(citySlug);

  if (!content) {
    return {};
  }

  const isTR = lang === "tr";

  const cityName = content.name[lang as "tr" | "en"];

  const title = isTR
    ? `${cityName} Otelleri ve Konaklama Rehberi | Waylero`
    : `Best Hotels in ${cityName} | Accommodation Guide | Waylero`;

  const description = isTR
    ? `${cityName} için konaklama rehberi. Nerede kalınır, en iyi bölgeler, otel seçenekleri ve konaklama ipuçlarını keşfedin.`
    : `Accommodation guide for ${cityName}. Discover where to stay, the best areas, hotel options and useful booking tips.`;

  const path = `/${lang}/hotels/${citySlug}`;

  return {
    title,
    description,

    alternates: {
      canonical: `${BASE_URL}${path}`,

      languages: {
        "tr-TR": `${BASE_URL}/tr/hotels/${citySlug}`,
        "en-US": `${BASE_URL}/en/hotels/${citySlug}`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      type: "article",

      locale: isTR
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

  const citySlug = city.toLowerCase();

  /*
   * LANG KONTROLÜ
   */
  if (
    !LANGS.includes(lang as "tr" | "en")
  ) {
    notFound();
  }


  /*
   * ŞEHİR KONTROLÜ
   */
  if (
    !HOTEL_CITIES.includes(
      citySlug as (typeof HOTEL_CITIES)[number]
    )
  ) {
    notFound();
  }


  /*
   * ŞEHİR VERİSİ
   */
  const content = hotelCityData[citySlug];

  if (!content) {
    notFound();
  }


  const currentLang = lang as "tr" | "en";

  const cityName = content.name[currentLang];

  const isTR = currentLang === "tr";


  /*
   * ŞEHİR DATA
   *
   * HotelCard'ın mevcut yapısını bozmuyoruz.
   * Görseli ve başlığı HotelCard kendisi çözüyor.
   */
  const cityData = [
    {
      id: citySlug,
      city: citySlug,
    },
  ];


  /*
   |--------------------------------------------------------------------------
   | JSON-LD
   |--------------------------------------------------------------------------
   */

  const pageUrl =
    `${BASE_URL}/${lang}/hotels/${citySlug}`;


  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "WebPage",

    name: isTR
      ? `${cityName} Otelleri ve Konaklama Rehberi`
      : `Hotels in ${cityName} - Accommodation Guide`,

    description: isTR
      ? `${cityName} için konaklama rehberi. Nerede kalınır, en iyi bölgeler ve otel seçerken dikkat edilmesi gerekenler.`
      : `Accommodation guide for ${cityName}, including where to stay, the best areas and hotel booking tips.`,

    url: pageUrl,

    inLanguage: lang,

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

          item: `${BASE_URL}/${lang}`,
        },

        {
          "@type": "ListItem",
          position: 2,

          name: isTR
            ? "Oteller"
            : "Hotels",

          item: `${BASE_URL}/${lang}/hotels`,
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
| 13 şehir × 2 dil = 26 sayfa
|
*/

export function generateStaticParams() {

  return HOTEL_CITIES.flatMap((city) =>
    LANGS.map((lang) => ({
      lang,
      city,
    }))
  );

}