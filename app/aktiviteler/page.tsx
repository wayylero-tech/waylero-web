import { Metadata } from "next";
import { headers } from "next/headers";
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

// 🔥 TEK DOĞRU URL OKUMA
async function getQueryParams() {
  const h = await headers();
  const currentUrl = h.get("x-url") || "";

  const url = new URL("http://dummy.com" + currentUrl);

  return {
    city: url.searchParams.get("city") || "",
    start: url.searchParams.get("start") || "",
    end: url.searchParams.get("end") || "",
  };
}

// 🌍 Dil
async function getLanguage() {
  const h = await headers();
  const currentPath = h.get("x-url") || "";
  const middlewareLang = h.get("x-url-lang");

  if (middlewareLang === "en" || currentPath.includes("/en/")) return "en";
  return "tr";
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const { city } = await getQueryParams();

  const normalizedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key]) => [slugify(key), key])
  );

  const originalCityName = normalizedCityMap[city];

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

  return {
    title: `${cityNameMeta} ${t.suffix} | Waylero`,
    description:
      lang === "tr"
        ? `${cityNameMeta} ${t.desc}`
        : `${t.desc} ${cityNameMeta} on Waylero.`,
  };
}

export default async function ActivitiesPage() {
  const lang = await getLanguage();
  const { city, start, end } = await getQueryParams();

  // =========================
  // 1. CITY
  // =========================
  const citySlug = decodeURIComponent(city.toLowerCase().trim());

  console.log("🔥 CITY:", citySlug);

  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [
      slugify(key),
      { id: value, originalName: key }
    ])
  );

  const cityData = slugifiedCityMap[citySlug];

  const defaultCityName =
    lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY";

  const cityNameForUI = cityData
    ? cityData.originalName.toLocaleUpperCase(
        lang === "tr" ? "tr-TR" : "en-US"
      )
    : defaultCityName;

  // =========================
  // 2. API PARAMS
  // =========================
  const apiParams = new URLSearchParams();

  if (cityData?.id) {
    apiParams.append("city_ids", String(cityData.id));
  } else {
    apiParams.append("city_ids", Object.values(cityMap).join(","));
  }

  if (start) apiParams.append("start_gte", start);
  if (end) apiParams.append("end_lte", end);

  apiParams.append("take", "50");
  apiParams.append("skip", "0");

  // =========================
  // 3. FETCH
  // =========================
  let initialEvents: any[] = [];

  try {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://www.waylero.com";

    const url = `${baseUrl}/api/events?${apiParams.toString()}`;

    const res = await fetch(url, {
      next: { revalidate: 900 },
    });

    if (res.ok) {
      const data = await res.json();
      initialEvents = data.items || data.data || [];
    }
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }

  return (
    <ActivityList
      initialEvents={initialEvents}
      initialCityName={cityNameForUI}
      lang={lang}
    />
  );
}