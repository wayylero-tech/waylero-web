import { Metadata } from "next";
import { cookies } from "next/headers";
import ActivityList from "./ActivityList";
import { cityMap } from "@/lib/cityMap";

export const dynamic = "force-dynamic"; // Dosyanın en üstüne ekle

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

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
  const cityParam = params.city || "";
  
  const normalizedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), key])
  );

  const originalCityName = normalizedCityMap[cityParam];
  const cityNameMeta = originalCityName 
    ? originalCityName.toLocaleUpperCase("tr-TR") 
    : (lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY");

  return {
    title: `${cityNameMeta} Konserleri ve Etkinlikleri | Waylero`,
    description: `${cityNameMeta} şehrindeki en güncel konserler Waylero'da.`,
  };
}

export default async function ActivitiesPage({ searchParams }: any) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";

  const citySlug = params.city || "";
  // 🔥 Yeni: URL'den gelen tarihleri yakalıyoruz
  const startDate = params.start || "";
  const endDate = params.end || "";
  
  const slugifiedCityMap = Object.fromEntries(
    Object.entries(cityMap).map(([key, value]) => [slugify(key), { id: value, originalName: key }])
  );

  const cityData = slugifiedCityMap[citySlug];
  const defaultCityName = lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY";
  let cityNameForUI = cityData ? cityData.originalName.toLocaleUpperCase("tr-TR") : defaultCityName;
  
  let initialEvents: any[] = [];

  try {
    const apiParams = new URLSearchParams();
    
    // Şehir Parametresi
    if (cityData) {
      apiParams.append("city_ids", cityData.id.toString());
    } else {
      const allCityIds = Object.values(cityMap).join(",");
      apiParams.append("city_ids", allCityIds);
    }

    // 🔥 KRİTİK GÜNCELLEME: Tarih parametrelerini API'ye ekle
    if (startDate) apiParams.append("start", startDate);
    if (endDate) apiParams.append("end", endDate);
    
    // İstanbul gibi yoğun illerde 50 sınırı olduğu için limiti yüksek tutmayı deniyoruz 
    // (Route dosyasında bu değeri kullanacağız)
    apiParams.append("limit", "100"); 

    const domain = "www.waylero.com";
    const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : `https://${domain}`;

    // Kendi API route'umuza istek atıyoruz
    const res = await fetch(`${baseUrl}/api/events?${apiParams.toString()}`, {
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const data = await res.json();
      initialEvents = data.items || [];
      
      if (initialEvents.length === 0 && data.data) {
        initialEvents = data.data; 
      }
    } else {
      console.error("API Hatası:", res.status);
    }
  } catch (err) {
    console.error("Fetch hatası:", err);
  }

  return (
    <ActivityList
      initialEvents={initialEvents}
      initialCityName={cityNameForUI}
      lang={lang}
    />
  );
}