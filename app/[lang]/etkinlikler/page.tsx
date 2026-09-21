import EtkinliklerClient from "./EtkinliklerClient";
import globalPlaces from "@/data/globalPlaces.json";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang?: string }>;
};

type Place = {
  country?: string;
  city?: string;
  image?: string;
};

type City = {
  id: string;
  country: string;
  image: string;
};

const BASE_URL = "https://www.waylero.com";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";

  const isEn = lang === "en";

const title = isEn
  ? "Tours & Experiences Worldwide | Waylero"
  : "Turlar ve Deneyimler | Dünyayı Keşfet | Waylero";

const description = isEn
  ? "Discover tours, activities and travel experiences in cities and destinations around the world with Waylero."
  : "Dünyanın farklı şehir ve destinasyonlarındaki turları, aktiviteleri ve seyahat deneyimlerini Waylero ile keşfedin.";
  const url = `${BASE_URL}/${lang}/etkinlikler`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/etkinlikler`,
        "en-US": `${BASE_URL}/en/etkinlikler`,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      type: "website",
      locale: isEn ? "en_US" : "tr_TR",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}


export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";

  const cityMap = new Map<string, City>();

  for (const place of globalPlaces as Place[]) {
    const rawCity = place.city?.trim();
    const rawCountry = place.country?.trim();

    if (!rawCity || !rawCountry) continue;

    const city = rawCity.toLowerCase();
    const country = rawCountry.toLowerCase();

    const existing = cityMap.get(city);

    if (!existing) {
      cityMap.set(city, {
        id: city,
        country,
        image: place.image?.trim() || "",
      });
      continue;
    }

    if (!existing.image && place.image?.trim()) {
      existing.image = place.image.trim();
    }
  }

  const cities = Array.from(cityMap.values());

const isEn = lang === "en";

const pageUrl = `${BASE_URL}/${lang}/etkinlikler`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: isEn
    ? "Tours & Experiences Worldwide | Waylero"
    : "Turlar ve Deneyimler | Dünyayı Keşfet | Waylero",
  description: isEn
    ? "Discover tours, activities and travel experiences in cities and destinations around the world with Waylero."
    : "Dünyanın farklı şehir ve destinasyonlarındaki turları, aktiviteleri ve seyahat deneyimlerini Waylero ile keşfedin.",
  url: pageUrl,
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
        name: isEn ? "Home" : "Anasayfa",
        item: `${BASE_URL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isEn ? "Tours & Experiences" : "Turlar ve Deneyimler",
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

    <EtkinliklerClient
      currentLang={lang}
      cities={cities}
    />
  </>
);
}