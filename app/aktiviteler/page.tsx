import { Metadata } from 'next';
import { cookies } from "next/headers";
import ActivityList from './ActivityList';

const cityMap: { [key: string]: number } = {
  "ADANA": 1, "ADIYAMAN": 2, "AFYON": 3, "AFYONKARAHİSAR": 85, "AĞRI": 4, "AKSARAY": 5, "AMASYA": 6, 
  "ANKARA": 7, "ANTALYA": 8, "ARDAHAN": 9, "ARTVİN": 10, "AYDIN": 11, "BALIKESİR": 12, "BARTIN": 13, 
  "BATMAN": 14, "BAYBURT": 15, "BİLECİK": 16, "BİNGÖL": 17, "BİTLİS": 18, "BOLU": 19, "BURDUR": 20, 
  "BURSA": 21, "ÇANAKKALE": 22, "ÇANKIRI": 23, "ÇORUM": 24, "DENİZLİ": 25, "DİYARBAKIR": 26, "DÜZCE": 27, 
  "EDİRNE": 28, "ELAZIĞ": 29, "ERZİNCAN": 30, "ERZURUM": 31, "ESKİŞEHİR": 32, "GAZİANTEP": 33, "GİRESUN": 34, 
  "GÜMÜŞHANE": 35, "HAKKARİ": 36, "HATAY": 37, "IĞDIR": 38, "ISPARTA": 39, "İSTANBUL": 40, "İZMİR": 41, 
  "KAHRAMANMARAŞ": 42, "KARABÜK": 43, "KARAMAN": 44, "KARS": 45, "KASTAMONU": 46, "KAYSERİ": 47, "KİLİS": 51, 
  "KIRIKKALE": 48, "KIRKLARELİ": 49, "KIRŞEHİR": 50, "KKTC": 84, "KOCAELİ": 52, "KONYA": 53, "KÜTAHYA": 54, 
  "LEFKOŞA": 83, "MALATYA": 55, "MANİSA": 56, "MARDİN": 57, "MERSİN": 58, "MUĞLA": 59, "MUŞ": 60, "NEVŞEHİR": 61, 
  "NİĞDE": 62, "ORDU": 63, "OSMANİYE": 64, "RİZE": 65, "SAKARYA": 66, "SAMSUN": 67, "ŞANLIURFA": 71, "SİİRT": 68, 
  "SİNOP": 69, "ŞIRNAK": 72, "SİVAS": 70, "TEKİRDAĞ": 73, "TOKAT": 74, "TRABZON": 75, "TUNCELİ": 76, 
  "UŞAK": 77, "VAN": 78, "YALOVA": 79, "YOZGAT": 80, "ZONGULDAK": 81
};

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
  const cityName = decodedSlug.replace(/-/g, " ").toLocaleUpperCase("tr-TR").trim();
  const cityId = cityMap[cityName];

  // Dile göre varsayılan başlık
  const defaultCityName = lang === "tr" ? "TÜRKİYE GENELİ" : "ALL OVER TURKEY";

  let initialEvents = [];
  try {
    const apiParams = new URLSearchParams();
    if (cityId) apiParams.append("city_ids", cityId.toString());
    else if (citySlug) apiParams.append("q", decodedSlug);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/events?${apiParams.toString()}`, { cache: 'no-store' });
    const data = await res.json();
    initialEvents = data.items || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("SSR Fetch Error:", error);
  }

  return (
    <ActivityList 
      initialEvents={initialEvents} 
      initialCityName={cityName || defaultCityName} 
      lang={lang}
    />
  );
}