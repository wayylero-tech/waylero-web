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
  ? `Best Places to Visit in ${cityName} (${regionName}) | Travel Guide`
  : `${cityName} Gezilecek Yerler 2026 | En Güzel Yerler ve Gezi Rehberi`;

const description = isEn
  ? `Discover the best places to visit in ${cityName}. Attractions, museums, nature spots, travel tips and local guides.`
  : `${cityName} gezilecek yerler rehberi. Tarihi mekanlar, doğal güzellikler, müzeler ve keşfedilecek en güzel noktaları inceleyin.`;

  const pathUrl = `/${lang}/kesfet/${region}/${city}`;
  const url = `${BASE_URL}${pathUrl}`;

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
          url: `${BASE_URL}/og/city.jpg`,
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
      images: [`${BASE_URL}/og/city.jpg`],
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