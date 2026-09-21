import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { cache } from "react";
import CityClient from "./CityClient";

export const revalidate = 86400;
export const dynamicParams = true;
export const dynamic = "force-static";

interface Props {
  params: Promise<{ lang: string; region: string; city: string }>;
}

const BASE_URL = "https://www.waylero.com";

// 🧠 1. VERİ OKUMA YARDIMCISI (React Cache ile tek seferlik okuma)
const getCityData = cache((region: string, city: string) => {
  const cityFilePath = path.join(
    process.cwd(),
    "data/ulkelerdata",
    region,
    `${city}.json`
  );

  const imagesPath = path.join(
    process.cwd(),
    "data/ulkedataimages",
    `${region}.json`
  );

  if (!fs.existsSync(cityFilePath)) {
    return null;
  }

  try {
    const cityPlaces = JSON.parse(fs.readFileSync(cityFilePath, "utf-8"));
    let images = {};

    if (fs.existsSync(imagesPath)) {
      try {
        images = JSON.parse(fs.readFileSync(imagesPath, "utf-8"));
      } catch (err) {
        console.error(`Görsel JSON dosyası okunamadı: ${imagesPath}`, err);
      }
    }

    return { cityPlaces, images };
  } catch (error) {
    console.error(`Şehir verisi okunurken hata oluştu (${city}):`, error);
    return null;
  }
});

// 🧠 2. DİL VE SLUG YARDIMCI FONKSİYONU
function formatTitleCase(str: string, lang: string): string {
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase(locale) + word.slice(1))
    .join(" ");
}

// 🧠 3. SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, region, city } = await params;
  const isEn = lang === "en";

  const data = getCityData(region, city);
  if (!data) return {};

  const { cityPlaces, images } = data;

  const cityName = formatTitleCase(city, lang);
  const regionName = formatTitleCase(region, lang);

  const title = isEn
    ? `Best Places to Visit in ${cityName}, ${regionName} | Travel Guide`
    : `${cityName} Gezilecek Yerler 2026 | En Güzel Yerler ve Gezi Rehberi`;

  const description = isEn
    ? `Explore the best places to visit in ${cityName}, ${regionName}. Discover attractions, historical sites, museums, nature spots and travel tips with Waylero.`
    : `${cityName} gezilecek yerler rehberini keşfedin. Tarihi mekanlar, müzeler, doğal güzellikler ve görülmesi gereken yerleri Waylero ile keşfedin.`;

  const pathUrl = `/${lang}/kesfet/${region}/${city}`;
  const url = `${BASE_URL}${pathUrl}`;

  // DİNAMİK ŞEHİR GÖRSELİNİ BULMA (OG İÇİN)
  let cityCoverImage = `${BASE_URL}/og/city.jpg`; // Fallback

  const firstPlace = cityPlaces?.[0];
  const citySlug = city.toLowerCase();
  const cityImages = (images as Record<string, any>)[citySlug] || (images as Record<string, any>)[city] || {};

  if (firstPlace) {
    const imageKey = `${citySlug}-${firstPlace.slug}`;
    const rawImg = cityImages[imageKey]?.[0] || cityImages[Object.keys(cityImages)[0]]?.[0];

    if (rawImg) {
      cityCoverImage = `https://res.cloudinary.com/dewd42ppf/image/upload/f_auto,q_auto:eco,w_1200,c_fill/${rawImg.replace(/^\/+/, "")}`;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/kesfet/${region}/${city}`,
        "en-US": `${BASE_URL}/en/kesfet/${region}/${city}`,
        "x-default": `${BASE_URL}/tr/kesfet/${region}/${city}`,
      },
    },
    openGraph: {
      title: `${title} | Waylero`,
      description,
      url,
      siteName: "Waylero",
      locale: isEn ? "en_US" : "tr_TR",
      type: "website",
      images: [
        {
          url: cityCoverImage,
          width: 1200,
          height: 630,
          alt: cityName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Waylero`,
      description,
      images: [cityCoverImage],
    },
  };
}

// 🧠 4. PAGE COMPONENT
export default async function Page({ params }: Props) {
  const { lang, region, city } = await params;
  const isEn = lang === "en";

  if (!region || !city) {
    notFound();
  }

  const data = getCityData(region, city);

  if (!data) {
    notFound();
  }

  const cityName = formatTitleCase(city, lang);
  const regionName = formatTitleCase(region, lang);

  // 1. ItemList JSON-LD Şeması
  const cityItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isEn
      ? `Places to Visit in ${cityName}, ${regionName}`
      : `${cityName} Gezilecek Yerler ve Turistik Mekanlar`,
    "description": isEn
      ? `Comprehensive list of attractions and top places to visit in ${cityName}.`
      : `${cityName} şehrinde mutlaka gezilmesi ve görülmesi gereken yerlerin listesi.`,
    "url": `${BASE_URL}/${lang}/kesfet/${region}/${city}`,
    "itemListElement": (data.cityPlaces || []).map((place: any, index: number) => {
      const placeName = place.name?.[isEn ? "en" : "tr"] || place.name?.tr || place.name?.en || place.slug;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": placeName,
        "url": `${BASE_URL}/${lang}/kesfet/${region}/${city}/${place.slug}`,
      };
    }),
  };

  // 2. BreadcrumbList JSON-LD Şeması (YENİ EKLENDİ)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isEn ? "Explore" : "Keşfet",
        "item": `${BASE_URL}/${lang}/kesfet`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": regionName,
        "item": `${BASE_URL}/${lang}/kesfet/${region}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": cityName,
        "item": `${BASE_URL}/${lang}/kesfet/${region}/${city}`,
      },
    ],
  };

  // 3. İlk Kart Görseli (LCP) İçin Preload Hesabı
  const firstPlace = data.cityPlaces?.[0];
  const citySlug = city.toLowerCase();
  const cityImages = (data.images as Record<string, any>)[citySlug] || (data.images as Record<string, any>)[city] || {};
  let lcpImagePreloadUrl = "";

  if (firstPlace) {
    const imageKey = `${citySlug}-${firstPlace.slug}`;
    const rawImg = cityImages[imageKey]?.[0] || cityImages[firstPlace.slug]?.[0];
    if (rawImg) {
      lcpImagePreloadUrl = `https://res.cloudinary.com/dewd42ppf/image/upload/f_auto,q_auto:eco,w_400,c_fill/${rawImg.replace(/^\/+/, "")}`;
    }
  }

  return (
    <>
      {/* LCP Görseli Ön Yükleme (Preload) */}
      {lcpImagePreloadUrl && (
        <link
          rel="preload"
          as="image"
          href={lcpImagePreloadUrl}
          fetchPriority="high"
        />
      )}

      {/* Google ve AI Botları İçin JSON-LD Şemaları */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityItemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CityClient
        lang={lang}
        region={region}
        city={city}
        cityPlaces={data.cityPlaces}
        images={data.images}
      />
    </>
  );
}