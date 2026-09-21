import CityPageClient from "./CityPageClient";
import { notFound } from "next/navigation";
import globalPlaces from "@/data/globalPlaces.json";

type Params = {
  city: string;
  lang: "tr" | "en";
};

type Place = {
  city?: string;
};

const BASE_URL = "https://www.waylero.com";

const cities = Array.from(
  new Set(
    (globalPlaces as Place[])
      .map((place) => place.city?.toLowerCase().trim())
      .filter(Boolean)
  )
);

function getCityName(citySlug: string) {
  return citySlug
    .split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function isValidCity(city: string) {
  return cities.includes(city.toLowerCase().trim());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city, lang } = await params;

  if (
    (lang !== "tr" && lang !== "en") ||
    !isValidCity(city)
  ) {
    return {};
  }

  const isTR = lang === "tr";
  const cityName = getCityName(city);

  const fullUrl = `${BASE_URL}/${lang}/etkinlikler/${city}`;

  const title = isTR
    ? `${cityName} Turları ve Deneyimleri | Waylero`
    : `${cityName} Tours & Experiences | Waylero`;

  const description = isTR
      ? `${cityName} turlarını, aktivitelerini ve seyahat deneyimlerini keşfedin. Şehirde yapılacak şeyleri ve popüler tur seçeneklerini inceleyin.`
  : `Discover tours, activities and travel experiences in ${cityName}. Explore things to do and popular tour options for your trip.`;

  return {
    title,
    description,

    alternates: {
      canonical: fullUrl,

      languages: {
        "tr-TR": `${BASE_URL}/tr/etkinlikler/${city}`,
        "en-US": `${BASE_URL}/en/etkinlikler/${city}`,
      },
    },

    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Waylero",
      type: "website",
      locale: isTR ? "tr_TR" : "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city, lang } = await params;

  if (
    (lang !== "tr" && lang !== "en") ||
    !isValidCity(city)
  ) {
    notFound();
  }

  const cityName = getCityName(city);
  const schemaUrl = `${BASE_URL}/${lang}/etkinlikler/${city}`;
  const isTR = lang === "tr";

  const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",

  name: isTR
    ? `${cityName} Turları ve Deneyimleri`
    : `${cityName} Tours & Experiences`,

  description: isTR
    ? `${cityName} turlarını, aktivitelerini ve seyahat deneyimlerini keşfedin. Şehirde yapılacak şeyleri ve popüler tur seçeneklerini inceleyin.`
    : `Discover tours, activities and travel experiences in ${cityName}. Explore things to do and popular tour options for your trip.`,

  url: schemaUrl,

  inLanguage: lang,

  publisher: {
    "@type": "Organization",
    name: "Waylero",
    url: BASE_URL,
  },

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
        name: isTR ? "Anasayfa" : "Home",
        item: `${BASE_URL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isTR ? "Turlar ve Deneyimler" : "Tours & Experiences",
        item: `${BASE_URL}/${lang}/etkinlikler`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityName,
        item: schemaUrl,
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

      <CityPageClient
        city={city}
        lang={lang}
      />
    </>
  );
}

export function generateStaticParams() {
  return cities.flatMap((city) => [
    {
      lang: "tr",
      city,
    },
    {
      lang: "en",
      city,
    },
  ]);
}