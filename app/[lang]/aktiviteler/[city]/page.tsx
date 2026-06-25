import { Metadata } from "next";
import ActivityList from "../ActivityList";
import { cityMap } from "@/lib/cityMap";
import { Suspense } from "react";
import Link from "next/link"; 
import { notFound } from "next/navigation"; // 🚀 GERÇEK 404 İÇİN EKLEDİK
import { fetchEtkinlikData } from "@/lib/fetchEvents";

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
  
  // 🚀 Şehir sistemde yoksa botlar taramasın
  if (!cityData) return { title: "Waylero" };

  const cityName = cityData.name || city;

  // 🚀 ÖNEMLİ: Etkinlik var mı yok mu metadata içinde de kontrol ediyoruz!
  let hasEvents = true;
  try {
    const data = await fetchEtkinlikData({
      cityId: cityData.id.toString(),
      lang: currentLang,
      take: "1" // Sadece etkinlik var mı yok mu anlamak için 1 tane çekiyoruz
    });
    const events = data.items || data.data || (Array.isArray(data) ? data : []);
    if (events.length === 0) hasEvents = false;
  } catch {
    hasEvents = false;
  }

  const t = {
    tr: {
      title: `${cityName} Etkinlikleri | Waylero`,
      desc: `${cityName} konser, tiyatro ve kültür sanat etkinlikleri.`,
    },
    en: {
      title: `Events in ${cityName} | Waylero`,
      desc: `Discover concerts, theaters and cultural events in ${cityName}.`,
    },
  }[currentLang];

  return {
    metadataBase: new URL(BASE_SITE_URL),
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: `${BASE_SITE_URL}/${currentLang}/aktiviteler/${citySlug}`,
    },
    // 🎯 EĞER ETKİNLİK YOKSA: Google'a "Bu sayfayı dizine ekleme (noindex)" talimatı veriyoruz.
    // Böylece Soft 404 hatasından tamamen kurtuluyorsun.
    robots: hasEvents ? null : { index: false, follow: true }
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

  const slugMap = Object.fromEntries(
    Object.entries(cityMap).map(([k, v]) => [slugify(k), { id: v, name: k }])
  );

  const cityData = slugMap[citySlug];

  // 🚀 DEĞİŞİKLİK: "Şehir bulunamadı" divi yerine GERÇEK 404 HTTP kodu fırlatıyoruz
  if (!cityData) return notFound();

  let cityEvents: any[] = [];
  try {
    const data = await fetchEtkinlikData({
      cityId: cityData.id.toString(),
      lang: currentLang,
      startParam: s.start_gte || undefined,
      endParam: s.end_lte || undefined,
      take: "50"
    });
    
    cityEvents = data.items || data.data || (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Şehir sayfası doğrudan veri çekme hatası:", err);
    cityEvents = [];
  }

  const cityName = cityData.name.toUpperCase();

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
        
        {cityEvents.length === 0 && (
          <div className="bg-amber-50/60 border-b p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="font-bold text-2xl text-amber-900 mb-2">{cityName}</h1>
            <p className="text-gray-600 mb-6 max-w-md">
              {currentLang === "tr"
                ? `${cityData.name} şehri için şu an güncel bir etkinlik bulunamadı. Dilerseniz çevre illerdeki popüler etkinliklere ve konserlere göz atabilirsiniz.`
                : `No upcoming events found for ${cityData.name}. You can check out events in neighboring cities.`}
            </p>

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