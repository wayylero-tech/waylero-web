import { Metadata } from "next";
import ActivityList from "../ActivityList"; // Bir üst klasördeki bileşeni kullanıyoruz
import { cityMap } from "@/lib/cityMap";
import { Suspense } from 'react';

const BASE_SITE_URL = "https://www.waylero.com";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; city: string }>
}): Promise<Metadata> {
  const { lang, city: citySlug } = await params;
  const currentLang = (lang === "en" ? "en" : "tr") as "tr" | "en";

  // Şehir ismini düzgünce bulalım (Ankara -> ankara slug'ından geri dönüyoruz)
  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), { id: value, originalName: key }])
  );
  
  const cityData = slugifiedCityMap[citySlug];
  const cityName = cityData ? cityData.originalName : citySlug;

  const t = {
    tr: {
      title: `${cityName} Etkinlikleri ve Konser Rehberi | Waylero`,
      desc: `${cityName} şehrindeki en güncel konserler, tiyatrolar ve tüm etkinlikler Waylero'da. Biletleri incele ve yerini ayırt.`,
    },
    en: {
      title: `Events & Concerts in ${cityName} Guide | Waylero`,
      desc: `Discover the latest concerts and events in ${cityName} on Waylero. Buy your tickets online.`,
    }
  }[currentLang];

  const path = `/aktiviteler/${citySlug}`;
  const fullUrl = `${BASE_SITE_URL}/${currentLang}${path}`;

  return {
    metadataBase: new URL(BASE_SITE_URL),
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: fullUrl,
      // 🌍 HREFLANG BURADA: Google'a diğer dillerdeki karşılığını söylüyoruz
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
      images: [{ url: `${BASE_SITE_URL}/og/events.jpg` }], // Her şehre özel görselin varsa buraya koyabilirsin
    },
  };
}


function slugify(text: string) {
  const charMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  return text.split('').map(char => charMap[char] || char).join('').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').trim();
}

export default async function CityActivitiesPage({ 
  params,
  searchParams // 👈 Burayı ekledik
}: { 
  params: Promise<{ lang: string; city: string }>,
  searchParams: Promise<{ start_gte?: string; end_lte?: string }> // 👈 Tipini belirledik
}) {
  const { lang, city: citySlug } = await params;
  const sParams = await searchParams; // 👈 Tarih parametrelerini bekliyoruz
  
  const currentLang = (lang === "en" ? "en" : "tr") as "tr" | "en";
  const startDate = sParams.start_gte || ""; // 👈 Tarihi aldık
  const endDate = sParams.end_lte || "";     // 👈 Tarihi aldık

  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), { id: value, originalName: key }])
  );

  const cityData = slugifiedCityMap[citySlug];
  
  if (!cityData) {
     return <div className="min-h-screen flex items-center justify-center">Şehir bulunamadı.</div>; 
  }

  const cityNameForUI = cityData.originalName.toLocaleUpperCase(currentLang === "tr" ? "tr-TR" : "en-US");
  let initialEvents: any[] = [];

  try {
    const apiParams = new URLSearchParams();
    apiParams.append("city_ids", cityData.id.toString());
    
    // 🗓️ TARİH FİLTRELERİNİ API'YE EKLE
    if (startDate) apiParams.append("start_gte", startDate);
    if (endDate) apiParams.append("end_lte", endDate);
    
    apiParams.append("take", "50");
    apiParams.append("lang", currentLang);

    const finalUrl = `${BASE_SITE_URL}/api/events?${apiParams.toString()}`;
    const res = await fetch(finalUrl, {
  next: { revalidate: 3600 },
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

    if (res.ok) {
      const data = await res.json();
      initialEvents = data.items || data.data || (Array.isArray(data) ? data : []);
    }
  } catch (err) {
    console.error("Fetch Hatası:", err);
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
