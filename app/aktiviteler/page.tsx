import { Metadata } from "next";
import { headers } from "next/headers";
import ActivityList from "./ActivityList";
import { cityMap } from "@/lib/cityMap";

// --- HELPERS ---
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

// --- SCHEMA GENERATOR ---
function generateEventSchema(events: any[], lang: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": lang === "tr" ? "Etkinlik Listesi" : "Event List",
    "itemListElement": events.map((event, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": event.category?.name === "Konser" ? "MusicEvent" : "Event",
        "name": event.name,
        "startDate": event.start,
        "location": {
          "@type": "Place",
          "name": event.venue?.name || "Mekan",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": event.venue?.city?.name || "Türkiye",
            "addressCountry": "TR"
          }
        },
        "image": event.poster_url || event.image_url,
        "description": `${event.name} etkinliği Waylero güvencesiyle.`,
        "offers": {
  "@type": "Offer",
  // /etkinlik/ yerine /aktivite/ (veya senin detay sayfa route adın neyse o)
  "url": `https://www.waylero.com${lang === "en" ? "/en" : ""}/aktivite/${event.slug}`,
  "priceCurrency": "TRY",
  "availability": "https://schema.org/InStock"
}
      }
    }))
  };
}

// --- METADATA ---
export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const lang = await getLanguage();
  const cityParam = params.city || "";
  const typeParam = params.type || ""; // 🔥 Konser/Tiyatro ayrımı için

  const normalizedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), key])
  );

  const originalCityName = normalizedCityMap[cityParam];

  const t = {
    tr: {
      defaultCity: "TÜRKİYE GENELİ",
      suffix: typeParam === "concert" ? "Konserleri" : "Etkinlikleri",
      desc: "şehrindeki en güncel konserler ve etkinlikler Waylero'da."
    },
    en: {
      defaultCity: "ALL OVER TURKEY",
      suffix: typeParam === "concert" ? "Concerts" : "Events",
      desc: "Discover the latest concerts and events in"
    }
  }[lang as "tr" | "en"];

  const cityNameMeta = originalCityName
    ? originalCityName.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US")
    : t.defaultCity;

  const title = `${cityNameMeta} ${t.suffix} | Waylero`;
  const description = lang === "tr"
    ? `${cityNameMeta} ${t.desc}`
    : `${t.desc} ${cityNameMeta} on Waylero.`;

  // 🔥 URL DUZELTME: /etkinlikler yerine /aktiviteler kullanıyoruz
  const searchQueries = new URLSearchParams();
  if (cityParam) searchQueries.append("city", cityParam);
  if (typeParam) searchQueries.append("type", typeParam);
  const queryStr = searchQueries.toString() ? `?${searchQueries.toString()}` : "";

  const baseUrl = "https://www.waylero.com";
  const path = "/aktiviteler"; // 👈 Sayfanın gerçek yolu
  const fullUrl = `${baseUrl}${lang === "en" ? "/en" : ""}${path}${queryStr}`;

  return {
    title,
    description,
    alternates: {
      canonical: fullUrl,
      languages: {
        "tr-TR": `${baseUrl}${path}${queryStr}`,
        "en-US": `${baseUrl}/en${path}${queryStr}`,
        "x-default": `${baseUrl}${path}${queryStr}`,
      },
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Waylero",
      images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630 }],
      locale: lang === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}

// --- PAGE COMPONENT ---
export default async function ActivitiesPage({ searchParams }: any) {
  const params = await searchParams;
  const lang = await getLanguage();

  const citySlug = params.city || "";
  const type = params.type || ""; // 🔥 UI tarafında filtreleme için gerekebilir
  const startDate = params.start_gte || params.start || "";
  const endDate = params.end_lte || params.end || "";

  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), { id: value, originalName: key }])
  );

  const cityData = slugifiedCityMap[citySlug];
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
    
    // 🔥 Eğer sadece konser isteniyorsa API'ye ona göre parametre ekleyebilirsin
    // if (type === "concert") apiParams.append("category_ids", "1"); // Etkinlik.io'daki ID neyse

    apiParams.append("take", "50");
    apiParams.append("skip", "0");

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.waylero.com";
    const res = await fetch(`${baseUrl}/api/events?${apiParams.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      initialEvents = data.items || data.data || [];
    }
  } catch (err) {
    console.error("Fetch hatası:", err);
  }

  const jsonLd = generateEventSchema(initialEvents, lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ActivityList
        initialEvents={initialEvents}
        initialCityName={cityNameForUI}
        lang={lang}
      />
    </>
  );
}