import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import fs from "fs";
import path from "path";
import { slugify } from "@/lib/utils/slugify";
import PlaceClient from "./PlaceClient";

// 🚀 1. CACHE & RUNTIME AYARLARI
export const runtime = "nodejs";
export const dynamic = "force-static"; // Tam statik render
export const revalidate = 604800;        // 1 saatlik ISR cache

const BASE_URL = "https://www.waylero.com";

interface Props {
  params: Promise<{
    lang: string;
    region: string;
    city: string;
    place: string;
  }>;
}

// 📦 2. VERİ OKUMA (FS + CACHE)
// React cache sayesinde aynı request içinde dosya sadece 1 kez okunur.
const loadCityData = cache(async (region: string, city: string) => {
  try {
    const filePath = path.join(process.cwd(), "data/ulkelerdata", region, `${city}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return null;
  }
});

const loadImages = cache(async (region: string) => {
  try {
    const filePath = path.join(process.cwd(), "data/ulkedataimages", `${region}.json`);
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return {};
  }
});

// 🌍 MESAFE HESAPLAMA (Haversine)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.25;
}

// Kelimeleri bölmeden akıllıca kırpan yardımcı fonksiyon
function smartTrim(text: string, maxLength: number = 155): string {
  if (text.length <= maxLength) return text;
  
  // Belirtilen sınırdan önceki son boşluğun indeksini bul (böylece kelime bölünmez)
  let trimmed = text.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  
  if (lastSpace > 0) {
    trimmed = trimmed.substring(0, lastSpace);
  }
  
  // Son karakter nokta veya virgül ise temizle, ardından üç nokta ekle
  return trimmed.replace(/[,.-]$/, "").trim() + "...";
}

// 🧠 3. SEO METADATA (OG + TWITTER + CANONICAL)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, region, city, place } = await params;
  const cityData = await loadCityData(region, city);
  
  if (!cityData) return { title: "Waylero" };

  const found = cityData.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!found) return { title: "Waylero" };

  const isEn = lang === "en";
  const name = found.name?.[lang] || found.name?.tr || found.slug;
  
 const title = isEn
  ? `${name} Travel Guide: How to Get There?`
  : `${name} Rehberi: Nerede ve Nasıl Gidilir?`;

  // 🎯 ESKİ HALİ: .slice(0, 160) yerine Akıllı Kırpma uyguluyoruz
  const rawDescription = found.description?.[lang] || found.description?.tr || "";
  const description = smartTrim(rawDescription, 155); 

  const pathUrl = `/kesfet/${region}/${city}/${place}`;
  const url = `${BASE_URL}/${lang}${pathUrl}`;
  const ogImageUrl = `${BASE_URL}/og/place.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr${pathUrl}`,
        "en-US": `${BASE_URL}/en${pathUrl}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

// 🧠 4. PAGE COMPONENT
// 🧠 4. PAGE COMPONENT (Optimize Edilmiş Hali)
export default async function Page({ params }: Props) {
  const { lang, region, city, place } = await params;

  const cityData = await loadCityData(region, city);
  if (!cityData) return notFound();

  const foundPlace = cityData.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!foundPlace) return notFound();

  // 🎯 OPTİMİZASYON: PlaceClient'a gitmeden önce veriyi sadece aktif dile göre küçültüyoruz
  const optimizedPlace = {
    slug: foundPlace.slug,
    latitude: foundPlace.latitude,
    longitude: foundPlace.longitude,
    categories: foundPlace.categories?.[lang] || foundPlace.categories?.tr || [],
    activities: foundPlace.activities?.[lang] || foundPlace.activities?.tr || [],
    // Sadece o anki aktif dilin ismini ve açıklamasını gönderiyoruz:
    name: foundPlace.name?.[lang] || foundPlace.name?.tr || foundPlace.slug,
    description: foundPlace.description?.[lang] || foundPlace.description?.tr || "",
  };

  const imagesData = await loadImages(region);
  const imageGroup = imagesData[city] || {};
  const imageKey = `${slugify(city)}-${slugify(foundPlace.slug)}`;
  const images = imageGroup[imageKey] || [];

  const nearbyPlaces = cityData
    .filter((p: any) => p.slug !== foundPlace.slug && p.latitude && p.longitude)
    .map((p: any) => ({
      slug: p.slug,
      latitude: p.latitude,
      longitude: p.longitude,
      name: p.name?.[lang] || p.name?.tr || p.slug, // Yakın yerlerin de sadece o anki dilini alıyoruz
      distance: getDistance(foundPlace.latitude, foundPlace.longitude, p.latitude, p.longitude),
    }))
    .sort((a: any, b: any) => a.distance - b.distance)
    .slice(0, 3);

  return (
    <PlaceClient
      lang={lang}
      region={region}
      city={city}
      place={place}
      foundPlace={optimizedPlace} // Artık sadece tek dil barındıran temiz nesne gidiyor
      images={images}
      nearbyPlaces={nearbyPlaces}
    />
  );
}