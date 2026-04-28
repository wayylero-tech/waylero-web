import HomeClient from "./HomeClient";
import toursData from "@/data/tours.json";
import { wayleroLiveVideos } from "@/videos";
import type { Metadata } from "next";
import { headers } from "next/headers";

// 🛡️ METADATA DÜZELTMESİ
export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") || "tr";
  const isEn = lang === "en";

  return {
    title: isEn ? "Waylero | Create Travel Plan, Explore Events" : "Waylero | Gezi Planı Oluştur, Etkinlikleri Keşfet",
    description: isEn 
      ? "Explore cities, find events and easily create travel plans with Waylero. Istanbul, Paris, Dubai and more await you."
      : "Waylero ile şehirleri keşfet, etkinlikleri bul ve kolayca gezi planı oluştur.",
    alternates: {
      canonical: isEn ? "https://waylero.com/en" : "https://waylero.com",
      languages: {
        tr: "https://waylero.com",
        en: "https://waylero.com/en",
        "x-default": "https://waylero.com",
      },
    },
    openGraph: {
      locale: isEn ? "en_US" : "tr_TR",
    }
  };
}

export default async function Page() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") || "tr";
  const isEn = lang === "en";

  // 🔴 LOG: Terminalde (VsCode altında) gör diye

  const featuredCitiesRaw = [
    { name: { tr: "İstanbul", en: "Istanbul" }, slug: "istanbul", country: "turkiye", image: "/assets/genel/istanbul.webp" },
    { name: { tr: "Viyana", en: "Vienna" }, slug: "viyana", country: "avusturya", image: "/assets/genel/viyana.webp" },
    { name: { tr: "Dubai", en: "Dubai" }, slug: "dubai", country: "bae", image: "/assets/genel/dubai.webp" },
    { name: { tr: "New York", en: "New York" }, slug: "newyork", country: "amerika", image: "/assets/genel/new.webp" },
    { name: { tr: "Pekin", en: "Beijing" }, slug: "pekin", country: "cin", image: "/assets/genel/pekin.webp" },
    { name: { tr: "Paris", en: "Paris" }, slug: "paris", country: "fransa", image: "/assets/genel/paris.webp" },
    { name: { tr: "Londra", en: "London" }, slug: "londra", country: "ingiltere", image: "/assets/genel/londra.webp" },
    { name: { tr: "Antalya", en: "Antalya" }, slug: "antalya", country: "turkiye", image: "/assets/genel/antalya.webp" },
    { name: { tr: "Tokyo", en: "Tokyo" }, slug: "tokyo", country: "japonya", image: "/assets/genel/tokyo.webp" },
    { name: { tr: "Hong Kong", en: "Hong Kong" }, slug: "hongkong", country: "cin", image: "/assets/genel/hongkong.webp" },
    { name: { tr: "Bangkok", en: "Bangkok" }, slug: "bangkok", country: "tayland", image: "/assets/genel/bangkok.webp" },
    { name: { tr: "Singapur", en: "Singapore" }, slug: "singapur", country: "singapur", image: "/assets/genel/singapur.webp" },
    { name: { tr: "Barselona", en: "Barcelona" }, slug: "barselona", country: "ispanya", image: "/assets/genel/barcelona.webp" },
    { name: { tr: "Roma", en: "Rome" }, slug: "roma", country: "italya", image: "/assets/genel/roma.webp" },
    { name: { tr: "Mekke", en: "Mecca" }, slug: "mekke", country: "suudi-arabistan", image: "/assets/genel/mekke.webp" },
  ];

  // 🟢 2. ŞEHİR İSİMLERİNİ DİNAMİK YAP (Burası eksikti)
 // 🔴 HATANIN KAYNAĞI BURASIYDI:
  // Objeyi string'e çevirmemiz lazım ki React "Objects are not valid" demesin.
  const featuredCities = featuredCitiesRaw.map(city => ({
    ...city,
    name: isEn ? city.name.en : city.name.tr // Obje olan name'i string'e (metne) çevirdik ✅
  }));

  const targetCities = ["istanbul", "antalya", "izmir", "nevsehir"];
  const featuredTours = targetCities
    .map(city => toursData.find(t => t.city?.toLowerCase() === city))
    .filter(Boolean);

  const videos = wayleroLiveVideos.slice(0, 6);

  // 🟢 3. API'YE DİLİ GEÇ (API'n destekliyorsa datayı da İngilizce çeker)
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

const res = await fetch(
  `${baseUrl}/api/events?take=4&city_ids=40&lang=${lang}`,
  {
    next: { revalidate: 3600 },
  }
);

  const data = await res.json();
  const events = data?.items || [];

  return (
    <HomeClient
      lang={lang} // Bunu göndermeyi unutma
      events={events}
      featuredTours={featuredTours}
      videos={videos}
      featuredCities={featuredCities} // Artık buradaki name bir string!
    />
  );
}