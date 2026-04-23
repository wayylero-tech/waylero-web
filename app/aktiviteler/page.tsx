import { Metadata } from "next";
import { headers } from "next/headers";
import ActivityList from "./ActivityList";
import { cityMap } from "@/lib/cityMap";

// 1. Her zaman dinamik çalışması için zorluyoruz (Prod hatası çözümü)
export const dynamic = 'force-dynamic';

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

async function getLanguage() {
  const h = await headers();
  const currentPath = h.get("x-url") || "";
  const middlewareLang = h.get("x-url-lang");
  if (middlewareLang === "en" || currentPath.includes("/en/")) return "en";
  return "tr";
}

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const lang = await getLanguage();
  const cityParam = params.city || "";
  
  const normalizedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), key])
  );

  const originalCityName = normalizedCityMap[cityParam];
  const t = {
    tr: { defaultCity: "TÜRKİYE GENELİ", suffix: "Konserleri ve Etkinlikleri", desc: "şehrindeki en güncel konserler ve etkinlikler Waylero'da." },
    en: { defaultCity: "ALL OVER TURKEY", suffix: "Concerts and Events", desc: "Discover the latest concerts and events in" }
  }[lang];

  const cityNameMeta = originalCityName 
    ? originalCityName.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US") 
    : t.defaultCity;

  return {
    title: `${cityNameMeta} ${t.suffix} | Waylero`,
    description: lang === "tr" ? `${cityNameMeta} ${t.desc}` : `${t.desc} ${cityNameMeta} on Waylero.`,
  };
}

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams; // Promise'i burada çözüyoruz
  const lang = await getLanguage();

  const citySlug = params.city || "";
  const startDate = params.start_gte || params.start || ""; 
  const endDate = params.end_lte || params.end || "";
  
  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), { id: value, originalName: key }])
  );

  const cityData = slugifiedCityMap[citySlug];
  
  // Debug logu - Vercel logs kısmında bunu görebilirsin
  console.log("Gelen Şehir Slug'ı:", citySlug);

  const defaultCityName = lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY";
  let cityNameForUI = cityData ? cityData.originalName.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US") : defaultCityName;
  
  let initialEvents: any[] = [];

  try {
    const apiParams = new URLSearchParams();
    
    if (cityData) {
      apiParams.append("city_ids", cityData.id.toString());
    } else {
      const allCityIds = Object.values(cityMap).join(",");
      apiParams.append("city_ids", allCityIds);
    }

    if (startDate) apiParams.append("start_gte", startDate);
    if (endDate) apiParams.append("end_lte", endDate);
    
    apiParams.append("take", "50"); 
    apiParams.append("skip", "0"); 

    const domain = "www.waylero.com";
    const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : `https://${domain}`;

    const res = await fetch(`${baseUrl}/api/events?${apiParams.toString()}`, {
      cache: 'no-store', // Veriyi önbelleğe alma
    });

    if (res.ok) {
      const data = await res.json();
      initialEvents = data.items || data.data || [];
    }
  } catch (err) {
    console.error("Fetch hatası:", err);
  }

  return (
    <ActivityList
      key={citySlug || 'all'} // 🔥 KRİTİK: Bu key, şehir değişince bileşeni sıfırlar
      initialEvents={initialEvents}
      initialCityName={cityNameForUI}
      lang={lang}
    />
  );
}