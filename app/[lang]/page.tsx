import HomeClient from "./HomeClient";
import toursData from "@/data/tours.json";
import { wayleroLiveVideos } from "@/videos";
import type { Metadata } from "next";

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
    { name: { tr: "İstanbul", en: "Istanbul" }, slug: "istanbul", country: "turkiye", image: "/assets/sehir/istanbul.webp" },
    { name: { tr: "Viyana", en: "Vienna" }, slug: "viyana", country: "avusturya", image: "/assets/sehir/viyana.webp" },
    { name: { tr: "Dubai", en: "Dubai" }, slug: "dubai", country: "bae", image: "/assets/sehir/dubai.webp" },
    { name: { tr: "New York", en: "New York" }, slug: "newyork", country: "amerika", image: "/assets/sehir/new.webp" },
    { name: { tr: "Pekin", en: "Beijing" }, slug: "pekin", country: "cin", image: "/assets/sehir/pekin.webp" },
    { name: { tr: "Paris", en: "Paris" }, slug: "paris", country: "fransa", image: "/assets/sehir/paris.webp" },
    { name: { tr: "Londra", en: "London" }, slug: "londra", country: "ingiltere", image: "/assets/sehir/londra.webp" },
    { name: { tr: "Antalya", en: "Antalya" }, slug: "antalya", country: "turkiye", image: "/assets/sehir/antalya.webp" },
    { name: { tr: "Tokyo", en: "Tokyo" }, slug: "tokyo", country: "japonya", image: "/assets/sehir/tokyo.webp" },
    { name: { tr: "Hong Kong", en: "Hong Kong" }, slug: "hongkong", country: "cin", image: "/assets/sehir/hongkong.webp" },
    { name: { tr: "Bangkok", en: "Bangkok" }, slug: "bangkok", country: "tayland", image: "/assets/sehir/bangkok.webp" },
    { name: { tr: "Singapur", en: "Singapore" }, slug: "singapur", country: "singapur", image: "/assets/sehir/singapur.webp" },
    { name: { tr: "Barselona", en: "Barcelona" }, slug: "barselona", country: "ispanya", image: "/assets/sehir/barselona.webp" },
    { name: { tr: "Roma", en: "Rome" }, slug: "roma", country: "italya", image: "/assets/sehir/roma.webp" },
    { name: { tr: "Mekke", en: "Mecca" }, slug: "mekke", country: "suudi-arabistan", image: "/assets/sehir/mekke.webp" },
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
    // API isteğini direkt baseUrl üzerinden atıyoruz
    const res = await fetch(
      `${baseUrl}/api/events?take=4&city_ids=40&lang=${lang}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      events = data?.items || [];
    }
  } catch (err) {
    console.error("EVENT FETCH ERROR:", err);
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