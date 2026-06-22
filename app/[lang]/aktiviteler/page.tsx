import { Metadata } from "next";
import ActivityList from "./ActivityList";
import { cityMap } from "@/lib/cityMap";
import { Suspense } from 'react';
import { fetchEtkinlikData } from "@/lib/fetchEvents";


// Canlı site adresini buraya sabitledik
const BASE_SITE_URL = "https://www.waylero.com";

function slugify(text: string) {
  const charMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  return text
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .trim();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === "en" ? "en" : "tr") as "tr" | "en";

  const t = {
    tr: {
      title: "Türkiye Etkinlik Rehberi | Waylero",
      desc: "Türkiye genelindeki en güncel konserler ve etkinlikler Waylero'da."
    },
    en: {
      title: "Events in Turkey Guide | Waylero",
      desc: "Discover the latest concerts and events in Turkey on Waylero."
    }
  }[currentLang];

  const path = "/aktiviteler";
  const fullUrl = `${BASE_SITE_URL}/${currentLang}${path}`;
  const image = `${BASE_SITE_URL}/og/events.jpg`;

  return {
    metadataBase: new URL(BASE_SITE_URL),
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: fullUrl,
      languages: {
        "tr-TR": `${BASE_SITE_URL}/tr${path}`,
        "en-US": `${BASE_SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.desc,
      url: fullUrl,
      siteName: "Waylero",
      type: "website",
      locale: currentLang === "en" ? "en_US" : "tr_TR",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: t.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.desc,
      images: [image],
      creator: "@waylero",
    },
  };
}

export default async function ActivitiesPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string }>, 
  searchParams: Promise<any> 
}) {
  const { lang } = await params;
  const currentLang = (lang === "en" ? "en" : "tr") as "tr" | "en";
  
  const sParams = await searchParams;
  const citySlug = sParams.city || "";
  const startDate = sParams.start_gte || "";
  const endDate = sParams.end_lte || "";

  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), { id: value, originalName: key }])
  );

  const cityData = slugifiedCityMap[citySlug];
  const defaultCityName = currentLang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY";
  let cityNameForUI = cityData ? cityData.originalName.toLocaleUpperCase(currentLang === "tr" ? "tr-TR" : "en-US") : defaultCityName;

  let initialEvents: any[] = [];

  // 🔥 DEĞİŞEN KISIM BURASI KANKA
  try {
    const selectedCityIds = cityData 
      ? cityData.id.toString() 
      : Object.values(cityMap).join(",");

    // HTTP isteği atmıyoruz! Doğrudan sunucu fonksiyonunu tetikliyoruz.
    const data = await fetchEtkinlikData({
      cityId: selectedCityIds,
      startParam: startDate,
      endParam: endDate,
      take: "50",
      lang: currentLang
    });

    initialEvents = data.items || data.data || (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Doğrudan sunucu veri çekme hatası:", err);
    // Hata durumunda arayüzün patlamaması için boş dizi set ediyoruz
    initialEvents = []; 
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Yükleniyor...</div>}>
      <ActivityList
        initialEvents={initialEvents}
        initialCityName={cityNameForUI}
        lang={currentLang}
      />
    </Suspense>
  );
}