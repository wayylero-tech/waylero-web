import { Metadata } from "next";
import ActivityList from "./ActivityList";
import { cityMap } from "@/lib/cityMap";
import { Suspense } from 'react'; // Bunu eklemeyi unutma


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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const path = "/aktiviteler";
  const fullUrl = `${baseUrl}/${currentLang}${path}`;

  const image = `${baseUrl}/og/events.jpg`;

  return {
    title: t.title,
    description: t.desc,

    alternates: {
      canonical: fullUrl,
      languages: {
        "tr-TR": `${baseUrl}/tr${path}`,
        "en-US": `${baseUrl}/en${path}`,
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

    other: {
      "theme-color": "#000000",
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
    apiParams.append("lang", currentLang);

    // ✅ Lokalde çalıştığını algılayıp `http://localhost:3000/api/...` isteği atmasını sağlıyoruz
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}`;
    const finalUrl = `${baseUrl}/api/events?${apiParams.toString()}`;

    const res = await fetch(finalUrl, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      initialEvents = data.items || data.data || (Array.isArray(data) ? data : []);
    }
  } catch (err) {
    console.error("Lokal Fetch Hatası:", err);
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