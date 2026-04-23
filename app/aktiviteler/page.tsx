import { Metadata } from "next";
import { headers } from "next/headers"; // 🔥 Cookies yerine headers
import ActivityList from "./ActivityList";
import { cityMap } from "@/lib/cityMap";


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

// 🌍 Güvenli Dil Yakalama
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
  
  // 🌍 SEO Metinleri (TR/EN)
  const t = {
    tr: {
      defaultCity: "TÜRKİYE GENELİ",
      suffix: "Konserleri ve Etkinlikleri",
      desc: "şehrindeki en güncel konserler ve etkinlikler Waylero'da."
    },
    en: {
      defaultCity: "ALL OVER TURKEY",
      suffix: "Concerts and Events",
      desc: "Discover the latest concerts and events in"
    }
  }[lang];

  const cityNameMeta = originalCityName 
    ? originalCityName.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US") 
    : t.defaultCity;

  const title = `${cityNameMeta} ${t.suffix} | Waylero`;
  const description = lang === "tr" 
    ? `${cityNameMeta} ${t.desc}`
    : `${t.desc} ${cityNameMeta} on Waylero.`;

return {
    title,
    description,
    alternates: {
      canonical: `https://www.waylero.com${lang === "en" ? "/en" : ""}/etkinlikler${cityParam ? `?city=${cityParam}` : ""}`,
      languages: {
        "tr-TR": `https://www.waylero.com/etkinlikler${cityParam ? `?city=${cityParam}` : ""}`,
        "en-US": `https://www.waylero.com/en/etkinlikler${cityParam ? `?city=${cityParam}` : ""}`,
        "x-default": `https://www.waylero.com/etkinlikler${cityParam ? `?city=${cityParam}` : ""}`,
      },
    },
  };
} // 👈 BU EKSİK!

export default async function ActivitiesPage({ searchParams }: any) {
  const params = await searchParams;
  const lang = await getLanguage();

  // =========================
  // 1. CITY SLUG (SAFE)
  // =========================
  const citySlugRaw = params.city || "";

  const citySlug = decodeURIComponent(
    citySlugRaw.toString().trim().toLowerCase()
  );

  console.log("🔥 CITY SLUG RAW:", citySlugRaw);
  console.log("🔥 CITY SLUG CLEAN:", citySlug);

  const startDate = params.start_gte || params.start || "";
  const endDate = params.end_lte || params.end || "";

  // =========================
  // 2. CITY MAP NORMALIZATION
  // =========================
  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [
      slugify(key),
      { id: value, originalName: key }
    ])
  );

  console.log("🧭 AVAILABLE CITY KEYS:", Object.keys(slugifiedCityMap));

  const cityData = slugifiedCityMap[citySlug];

  console.log("📍 MATCHED CITY DATA:", cityData);

  const defaultCityName =
    lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY";

  const cityNameForUI = cityData
    ? cityData.originalName.toLocaleUpperCase(
        lang === "tr" ? "tr-TR" : "en-US"
      )
    : defaultCityName;

  console.log("🏷️ CITY NAME UI:", cityNameForUI);

  // =========================
  // 3. API PARAMS
  // =========================
  const apiParams = new URLSearchParams();

  if (cityData?.id) {
    apiParams.append("city_ids", String(cityData.id));
    console.log("✅ CITY FILTER ID:", cityData.id);
  } else {
    const allCityIds = Object.values(cityMap).join(",");
    apiParams.append("city_ids", allCityIds);
    console.log("⚠️ FALLBACK: ALL CITIES USED");
  }

  if (startDate) apiParams.append("start_gte", startDate);
  if (endDate) apiParams.append("end_lte", endDate);

  apiParams.append("take", "50");
  apiParams.append("skip", "0");

  console.log("📡 API PARAMS:", apiParams.toString());

  // =========================
  // 4. FETCH EVENTS
  // =========================
  let initialEvents: any[] = [];

  try {
    const domain = "www.waylero.com";
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : `https://${domain}`;

    const url = `${baseUrl}/api/events?${apiParams.toString()}`;

    console.log("🚀 FETCH URL:", url);

    const res = await fetch(url, {
      next: { revalidate: 900 },
    });

    console.log("📥 API STATUS:", res.status);

    if (res.ok) {
      const data = await res.json();
      initialEvents = data.items || data.data || [];

      console.log("🎯 EVENTS COUNT:", initialEvents.length);
    } else {
      console.log("❌ API FAILED");
    }
  } catch (err) {
    console.error("💥 FETCH ERROR:", err);
  }

  // =========================
  // 5. RENDER
  // =========================
  return (
    <ActivityList
      initialEvents={initialEvents}
      initialCityName={cityNameForUI}
      lang={lang}
    />
  );
}