import { Metadata } from "next";
import ActivityList from "../ActivityList";
import { cityMap } from "@/lib/cityMap";
import { Suspense } from "react";
import Link from "next/link"; // Butonlar için Link ekledik

const BASE_SITE_URL = "https://www.waylero.com";

const NEIGHBOR_CITIES: { [key: string]: string[] } = {
  gumushane: ["trabzon", "rize", "erzurum"],
  bayburt: ["trabzon", "erzurum", "rize"],
  bartin: ["zonguldak", "karabuk", "bolu"],
  cankiri: ["ankara", "kirikkale", "bolu"],
  kirikkale: ["ankara", "cankiri", "eskisehir"],
  duzce: ["bolu", "sakarya", "zonguldak"],
  adiyaman: ["gaziantep", "sanliurfa", "malatya"],
  tunceli: ["elazig", "erzincan", "malatya"],
  bingol: ["diyarbakir", "elazig", "mus"],
  hakkari: ["van", "bitlis", "mus"],
  ardahan: ["kars", "erzurum", "artvin"],
  agri: ["erzurum", "van", "kars"],
  siirt: ["diyarbakir", "batman", "mardin"],
  igdir: ["erzurum", "kars", "van"],
  bitlis: ["van", "mus", "diyarbakir"],
  sirnak: ["mardin", "diyarbakir", "van"],
  kilis: ["gaziantep", "hatay", "adana"],
  karaman: ["konya", "mersin", "antalya"],
  kirsehir: ["ankara", "nevsehir", "kayseri"],
  osmaniye: ["adana", "gaziantep", "mersin"],
  bilecik: ["eskisehir", "bursa", "sakarya"],
  lefkosa: ["girne", "gazimagusa"],
  kktc: ["girne", "gazimagusa"],
  istanbul: ["kocaeli", "tekirdag", "sakarya", "bursa"],
ankara: ["eskisehir", "konya", "kirikkale", "bolu"],
izmir: ["manisa", "aydin", "mugla", "balikesir"],
antalya: ["mersin", "mugla", "konya", "burdur"],
bursa: ["istanbul", "kocaeli", "balikesir", "eskisehir"],
konya: ["ankara", "antalya", "kayseri", "mersin"],
adana: ["mersin", "gaziantep", "hatay", "osmaniye"],
trabzon: ["rize", "ordu", "samsun", "erzurum"]
};

function slugify(text: string) {
  const charMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "C", Ğ: "G", İ: "I", Ö: "O", Ş: "S", Ü: "U"
  };

  return text
    .split("")
    .map((c) => charMap[c] || c)
    .join("")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .trim();
}

async function fetchEvents(
  cityId: number,
  lang: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const params = new URLSearchParams();

    params.append("city_ids", cityId.toString());

    if (startDate) params.append("start_gte", startDate);
    if (endDate) params.append("end_lte", endDate);

    params.append("take", "50");
    params.append("lang", lang);

    const finalUrl = `${BASE_SITE_URL}/api/events?${params.toString()}`;

    const res = await fetch(finalUrl, {
      next: { revalidate: 21600 },
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      console.error("API Hatası:", res.status, finalUrl);
      return [];
    }

    const data = await res.json();

    return data.items || data.data || (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Fetch Hatası:", err);
    return [];
  }
}

/* ---------------- SEO ---------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { lang, city } = await params;
  const currentLang = lang === "en" ? "en" : "tr";
  const citySlug = slugify(city);

  const slugMap = Object.fromEntries(
    Object.entries(cityMap).map(([k, v]) => [slugify(k), { id: v, name: k }])
  );

  const cityData = slugMap[citySlug];
  const cityName = cityData?.name || city;

  const t = {
    tr: {
      title: `${cityName} Etkinlikleri | Waylero`,
      desc: `${cityName} konser, tiyatro ve etkinlikleri.`,
    },
    en: {
      title: `Events in ${cityName} | Waylero`,
      desc: `Discover events in ${cityName}.`,
    },
  }[currentLang];

  return {
    metadataBase: new URL(BASE_SITE_URL),
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: `${BASE_SITE_URL}/${currentLang}/aktiviteler/${citySlug}`,
    },
  };
}

/* ---------------- PAGE ---------------- */

export default async function CityActivitiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; city: string }>;
  searchParams: Promise<{ start_gte?: string; end_lte?: string }>;
}) {
  const { lang, city } = await params;
  const s = await searchParams;
  const currentLang = lang === "en" ? "en" : "tr";
  const citySlug = slugify(city);

  // Şehir haritasını tersine çevirip slug -> id/name yapıyoruz
  const slugMap = Object.fromEntries(
    Object.entries(cityMap).map(([k, v]) => [slugify(k), { id: v, name: k }])
  );

  const cityData = slugMap[citySlug];

  if (!cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Şehir bulunamadı
      </div>
    );
  }

  // Sadece ilgili şehrin etkinliklerini çekiyoruz (Tek bir fetch, tertemiz!)
  const cityEvents = await fetchEvents(
    cityData.id,
    currentLang,
    s.start_gte || "",
    s.end_lte || ""
  );

  const cityName = cityData.name.toUpperCase();

  // Etkinlik yoksa buton olarak gösterilecek komşu şehirleri hazırlıyoruz
  let displayNeighbors: { name: string; slug: string }[] = [];
  
  if (cityEvents.length === 0) {
    const neighborSlugs = NEIGHBOR_CITIES[citySlug] || [];
    
    displayNeighbors = neighborSlugs
      .map((slug) => {
        const nData = slugMap[slug];
        return nData ? { name: nData.name, slug } : null;
      })
      .filter(Boolean) as { name: string; slug: string }[];
  }

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <div className="w-full">
        
        {/* ETKİNLİK BULUNAMADI VE KOMŞU ŞEHİR BUTONLARI */}
        {cityEvents.length === 0 && (
          <div className="bg-amber-50/60 border-b p-8 text-center flex flex-col items-center justify-center">
            <h1 className="font-bold text-2xl text-amber-900 mb-2">{cityName}</h1>
            <p className="text-gray-600 mb-6">
              {currentLang === "tr"
                ? `${cityData.name} için güncel bir etkinlik bulunamadı.`
                : `No upcoming events found for ${cityData.name}.`}
            </p>

            {/* Komşu Şehir Buton Blokları */}
            {displayNeighbors.length > 0 && (
              <div className="w-full max-w-md">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                  {currentLang === "tr" ? "YAKINDAKİ ŞEHİRLERE GÖZ ATIN" : "EXPLORE NEARBY CITIES"}
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {displayNeighbors.map((neighbor) => (
                    <Link
                      key={neighbor.slug}
                      href={`/${currentLang}/aktiviteler/${neighbor.slug}`}
                      className="px-4 py-2 bg-white border border-gray-200 hover:border-amber-500 hover:text-amber-600 rounded-full text-sm font-medium transition-all shadow-sm"
                    >
                      📍 {neighbor.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANA LİSTE (Eğer etkinlik varsa çalışır, yoksa boş array paslarız ActivityList kendi içinde handle eder) */}
        {cityEvents.length > 0 && (
          <ActivityList
            initialEvents={cityEvents}
            initialCityName={cityName}
            lang={currentLang}
          />
        )}
      </div>
    </Suspense>
  );
} 