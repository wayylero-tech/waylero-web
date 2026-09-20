import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import CityClient from "./CityClient";


export const revalidate = 86400;
export const dynamicParams = true;
export const dynamic = "force-static";


interface Props {
  params: Promise<{ lang: string; region: string; city: string }>;
}

const BASE_URL = "https://www.waylero.com";

// 🧠 SEO METADATA
// 🧠 SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, region, city } = resolvedParams;
  const isEn = lang === "en";

  const cityName = city
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const regionName = region
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

const title = isEn
  ? `Best Places to Visit in ${cityName}, ${regionName} | Travel Guide`
  : `${cityName} Gezilecek Yerler 2026 | En Güzel Yerler ve Gezi Rehberi`;

const description = isEn
  ? `Explore the best places to visit in ${cityName}, ${regionName}. Discover attractions, historical sites, museums, nature spots and travel tips with Waylero.`
  : `${cityName} gezilecek yerler rehberini keşfedin. Tarihi mekanlar, müzeler, doğal güzellikler ve görülmesi gereken yerleri Waylero ile keşfedin.`;
  
  const pathUrl = `/${lang}/kesfet/${region}/${city}`;
  const url = `${BASE_URL}${pathUrl}`;

  // -------------------------------------------------
  // 🌟 DİNAMİK ŞEHİR GÖRSELİNİ BULMA (OG İÇİN)
  // -------------------------------------------------
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

  let cityCoverImage = `${BASE_URL}/og/city.jpg`; // Fallback

  try {
    if (fs.existsSync(cityFilePath) && fs.existsSync(imagesPath)) {
      const cityPlaces = JSON.parse(fs.readFileSync(cityFilePath, "utf-8"));
      const imagesJson = JSON.parse(fs.readFileSync(imagesPath, "utf-8"));
      
      const firstPlace = cityPlaces?.[0];
      const cityImages = imagesJson[city] || imagesJson[city.toLowerCase()] || {};

      if (firstPlace) {
        const citySlug = city.toLowerCase();
        const imageKey = `${citySlug}-${firstPlace.slug}`;
        const rawImg = cityImages[imageKey]?.[0] || cityImages[Object.keys(cityImages)[0]]?.[0];

        if (rawImg) {
          cityCoverImage = `https://res.cloudinary.com/dewd42ppf/image/upload/f_auto,q_auto:eco,w_1200,c_fill/${rawImg.replace(/^\/+/, "")}`;
        }
      }
    }
  } catch (error) {
    console.error(`Şehir metadata görseli okunamadı:`, error);
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/kesfet/${region}/${city}`,
        "en-US": `${BASE_URL}/en/kesfet/${region}/${city}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
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
      title,
      description,
      images: [cityCoverImage],
    },
  };
}

// 🧠 PAGE
export default async function Page({ params }: Props) {
  // Params değerini asenkron olarak çözümlüyoruz
  const resolvedParams = await params;
  const { lang, region, city } = resolvedParams;

  // Güvenlik kontrolü (parametrelerden herhangi biri eksikse 404 sayfasına yönlendir)
  if (!region || !city) {
    notFound();
  }

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

  if (!fs.existsSync(cityFilePath)) notFound();

  const cityPlaces = JSON.parse(
    fs.readFileSync(cityFilePath, "utf-8")
  );

  let images = {};

  if (fs.existsSync(imagesPath)) {
    try {
      images = JSON.parse(
        fs.readFileSync(imagesPath, "utf-8")
      );
    } catch {}
  }

  return (
    <CityClient
      lang={lang}
      region={region}
      city={city}
      cityPlaces={cityPlaces}
      images={images}
    />
  );
}