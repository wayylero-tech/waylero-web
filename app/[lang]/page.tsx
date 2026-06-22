// app/[lang]/page.tsx (Dosyanın Tam ve Eksiksiz Hali)

import HomeClient from "./HomeClient";
import toursData from "@/data/tours.json";
import { wayleroLiveVideos } from "@/videos";
import type { Metadata } from "next";
import { fetchEtkinlikData } from "@/lib/fetchEvents"; // Ortak fonksiyonu import ettik

// 1. Metadata artık direkt params'tan dili alıyor
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  const title = isEn
    ? "Waylero | Explore Cities, Events & Travel Experiences Worldwide"
    : "Waylero | Şehirleri, Etkinlikleri ve Seyahat Deneyimlerini Keşfet";

  const description = isEn
    ? "Discover 40+ countries including Turkey, Spain and USA. Explore 300+ cities like Paris, Istanbul and New York, and 2000+ iconic places such as Eiffel Tower, Kız Kulesi and Giza Pyramids. Find concerts, events, tickets, and tours, and plan your trip easily. Read travel blogs and get inspired for your next journey."
    : "Türkiye, İspanya ve Amerika dahil 40+ ülkeyi keşfet. Paris, İstanbul ve New York gibi 300+ şehri gez, Eyfel Kulesi, Kız Kulesi ve Giza Piramitleri gibi 2000+ ikonik yeri keşfet. Konserleri ve etkinlikleri bul, bilet al, turları keşfet ve seyahatini kolayca planla. Blog yazılarıyla ilham al ve bir sonraki yolculuğunu planla.";

  const url = `https://waylero.com/${lang}`;

  return {
    metadataBase: new URL("https://waylero.com"),

    title,
    description,

    keywords: [
      "travel",
      "gezi",
      "seyahat",
      "cities",
      "events",
      "concerts",
      "tours",
      "travel planner",
      "explore cities",
      "trip planning",
      "world travel",
      "waylero",
    ],

    alternates: {
      canonical: url,
      languages: {
        tr: "https://waylero.com/tr",
        en: "https://waylero.com/en",
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      type: "website",
      locale: isEn ? "en_US" : "tr_TR",
      images: [
        {
          url: "https://waylero.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Waylero Travel Platform",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://waylero.com/og-image.jpg"],
      creator: "@waylero",
      site: "@waylero",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page(
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const isEn = lang === "en";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.waylero.com";

  const featuredCitiesRaw = [
    { name: { tr: "İstanbul", en: "Istanbul" }, slug: "istanbul", country: "turkiye", image: "/assets/sehir1/istanbul.webp" },
    { name: { tr: "Viyana", en: "Vienna" }, slug: "viyana", country: "avusturya", image: "/assets/sehir1/viyana.webp" },
    { name: { tr: "Dubai", en: "Dubai" }, slug: "dubai", country: "bae", image: "/assets/sehir1/dubai.webp" },
    { name: { tr: "New York", en: "New York" }, slug: "newyork", country: "amerika", image: "/assets/sehir1/new.webp" },
    { name: { tr: "Pekin", en: "Beijing" }, slug: "pekin", country: "cin", image: "/assets/sehir1/pekin.webp" },
    { name: { tr: "Paris", en: "Paris" }, slug: "paris", country: "fransa", image: "/assets/sehir1/paris.webp" },
    { name: { tr: "Londra", en: "London" }, slug: "londra", country: "ingiltere", image: "/assets/sehir1/londra.webp" },
    { name: { tr: "Antalya", en: "Antalya" }, slug: "antalya", country: "turkiye", image: "/assets/sehir1/antalya.webp" },
    { name: { tr: "Tokyo", en: "Tokyo" }, slug: "tokyo", country: "japonya", image: "/assets/sehir1/tokyo.webp" },
    { name: { tr: "Hong Kong", en: "Hong Kong" }, slug: "hongkong", country: "cin", image: "/assets/sehir1/hongkong.webp" },
    { name: { tr: "Bangkok", en: "Bangkok" }, slug: "bangkok", country: "tayland", image: "/assets/sehir1/bangkok.webp" },
    { name: { tr: "Singapur", en: "Singapore" }, slug: "singapur", country: "singapur", image: "/assets/sehir1/singapur.webp" },
    { name: { tr: "Barselona", en: "Barcelona" }, slug: "barselona", country: "ispanya", image: "/assets/sehir1/barselona.webp" },
    { name: { tr: "Roma", en: "Rome" }, slug: "roma", country: "italya", image: "/assets/sehir1/roma.webp" },
    { name: { tr: "Mekke", en: "Mecca" }, slug: "mekke", country: "suudi-arabistan", image: "/assets/sehir1/mekke.webp" },
  ];

  const featuredCities = featuredCitiesRaw.map(city => ({
    ...city,
    name: isEn ? city.name.en : city.name.tr
  }));

  const targetCities = ["istanbul", "antalya", "izmir", "nevsehir"];
  const featuredTours = targetCities
    .map(city => toursData.find(t => t.city?.toLowerCase() === city))
    .filter(Boolean);

  const videos = wayleroLiveVideos.slice(0, 6);

  let events: any[] = [];
  
  try {
    // HTTP fetch isteğini tamamen uçurduk, doğrudan sunucu katmanından çekiyoruz
    const data = await fetchEtkinlikData({
      take: "4",
      cityId: "40", // İstanbul (veya belirlediğin city_id) korundu
      lang: lang
    });

    events = data?.items || [];
  } catch (err) {
    console.error("Ana sayfa doğrudan veri çekme hatası:", err);
    events = []; // Hata durumunda boş dizi kalsın ki skeleton çalışsın veya sayfa çökmesin
  }

  return (
    <HomeClient
      lang={lang}
      events={events}
      featuredTours={featuredTours}
      videos={videos}
      featuredCities={featuredCities}
    />
  );
}