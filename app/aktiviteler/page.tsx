import { Metadata } from 'next';
import { cookies } from "next/headers";
import ActivityList from './ActivityList';
import { cityMap } from "@/lib/cityMap";

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
  
  const cityParam = params.city;
  const cityName = cityParam 
    ? decodeURIComponent(cityParam).replace(/-/g, " ").toLocaleUpperCase("tr-TR") 
    : (lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY");

  const metaData = {
    tr: {
      title: cityName === "TÜRKİYE GENELİ" ? "Türkiye’de Tüm Konserler | Waylero" : `${cityName}’daki Etkinlikler ve Konserler | Waylero`,
      description: `${cityName} şehrindeki en güncel konserler, festivaller ve etkinlikler Waylero'da. Güvenli biletinizi hemen alın.`
    },
    en: {
      title: cityName === "ALL OVER TURKEY" ? "All Concerts in Turkey | Waylero" : `Events and Concerts in ${cityName} | Waylero`,
      description: `The most up-to-date concerts, festivals, and events in ${cityName} on Waylero. Buy your secure ticket now.`
    }
  }[lang] || { title: "Waylero Events", description: "Explore events." };

  return {
    title: metaData.title,
    description: metaData.description,
    alternates: {
      canonical: lang === "en" 
        ? `https://www.waylero.com/en/aktiviteler${cityParam ? `?city=${cityParam}` : ''}`
        : `https://www.waylero.com/aktiviteler${cityParam ? `?city=${cityParam}` : ''}`,
      languages: {
        "tr-TR": `https://www.waylero.com/aktiviteler${cityParam ? `?city=${cityParam}` : ''}`,
        "en-US": `https://www.waylero.com/en/aktiviteler${cityParam ? `?city=${cityParam}` : ''}`,
      }
    }
  };
}

export default async function ActivitiesPage({ searchParams }: any) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";

  const citySlug = params.city || "";
  const decodedSlug = decodeURIComponent(citySlug).trim();

  const cityName = decodedSlug
    .replace(/-/g, " ")
    .toLocaleUpperCase("tr-TR")
    .trim();

  const cityId = cityMap[cityName];
  const defaultCityName = lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY";

  let initialEvents = [];

  try {
    const apiParams = new URLSearchParams();
    if (cityId) {
      apiParams.append("city_ids", cityId.toString());
    } else if (decodedSlug) {
      // İstanbul gibi kelimelerdeki karakter sorununu normalize ile çözüyoruz
      apiParams.append("q", decodedSlug.normalize("NFC"));
    }

    // BASE URL AYARI: Kendi domainini buraya ekle ki hata payı kalmasın
    const domain = "www.waylero.com"; // Kendi asıl domainini yaz
    const baseUrl = process.env.NODE_ENV === "development" 
      ? "http://localhost:3000" 
      : `https://${domain}`;

    const res = await fetch(
      `${baseUrl}/api/events?${apiParams.toString()}`,
      {
        next: { revalidate: 1800 },
      }
    );

    // Gelen cevap JSON değilse (HTML ise) patlamasın diye kontrol
    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      const data = await res.json();
      initialEvents = data.items || [];
    } else {
      console.error("API JSON döndürmedi. Status:", res.status);
    }

  } catch (err) {
    console.error("SSR Fetch Error:", err);
  }

  return (
    <ActivityList
      initialEvents={initialEvents}
      initialCityName={cityName || defaultCityName}
      lang={lang}
    />
  );
}
