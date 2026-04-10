import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies, headers } from "next/headers";

// Veri yolları
import turkey from "../../../data/turkey.json";
import europa from "../../../data/europa.json";
import asia from "../../../data/asia.json";
import turkeyImages from "../../../data/images/turkey.json";
import europaImages from "../../../data/images/europa.json";
import asiaImages from "../../../data/images/asia.json";

const countryToRegionMap: Record<string, string> = {
  turkiye: "turkey", fransa: "europa", almanya: "europa", italya: "europa", kktc: "europa",
  ispanya: "europa", ingiltere: "europa", hollanda: "europa", 
  avusturya: "europa", yunanistan: "europa", "cek-cumhuriyeti": "europa", rusya: "europa",
  portekiz: "europa", romanya: "europa", danimarka: "europa", urdun: "asia",
  isvec: "europa", norvec: "europa", isvicre: "europa", endonezya: "europa", 
  irlanda: "europa", "bosna-hersek": "europa", avustralya: "europa", 
  gurcistan: "europa", iskocya: "europa", galler: "europa", malezya: "europa", 
  cin: "asia", hindistan: "asia", tayland: "asia", "guney-kore": "europa", filipinler: "europa", 
  japonya: "asia", "sri-lanka": "asia", singapur: "europa", amerika: "europa", umman: "europa", 
  "suudi-arabistan": "europa", misir: "europa", belarus: "europa"
};

interface Props {
  params: Promise<{ region: string; city: string; }>;
}

// 🌍 DİL ÇÖZÜCÜ
async function getLanguage() {
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || ""; 
  if (pathname.startsWith("/en") || (headerList.get("referer")?.includes("/en/"))) {
    return "en";
  }
  const cookieStore = await cookies();
  return (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
}

function slugify(text: string) {
  if (!text) return "";
  const trMap: any = { ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u", Ç: "C", Ğ: "G", İ: "I", I: "i", Ö: "O", Ş: "S", Ü: "U" };
  return text.toString().replace(/[çğışüöÇĞİŞÜÖ]/g, (m) => trMap[m]).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, city } = await params;
  const lang = await getLanguage();
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const t = {
    tr: {
      title: `${cityName} Gezilecek Yerler | En İyi ${cityName} Rotaları`,
      desc: `${cityName} seyahatiniz için görülmesi gereken yerler ve şehir rehberi.`,
    },
    en: {
      title: `Places to Visit in ${cityName} | Best ${cityName} Routes`,
      desc: `Discover the best places to visit and city guide for your trip to ${cityName}.`,
    }
  }[lang];

  return {
    title: `${t.title} - Waylero`,
    description: t.desc,
    alternates: {
      canonical: `https://www.waylero.com${lang === "en" ? "/en" : ""}/kesfet/${region}/${city}`,
    }
  };
}

export default async function CityPage({ params }: Props) {
  const { region, city } = await params;
  const lang = await getLanguage();
  
  const targetDataKey = countryToRegionMap[region.toLowerCase()];
  if (!targetDataKey) notFound();

  const allData: any = { turkey, europa, asia };
  const allImages: any = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };
  const regionData = allData[targetDataKey];

  const actualCityKey = Object.keys(regionData).find(key => slugify(key) === city.toLowerCase());
  const cityPlaces = actualCityKey ? regionData[actualCityKey] : null;

  if (!cityPlaces) notFound();

  const cityImages = allImages[targetDataKey]?.[actualCityKey || ""] || {};

  // 🌍 DİL SÖZLÜĞÜ
  const t = {
    tr: {
      explore: "KEŞFET",
      suffix: "şehrinde keşfedilmeyi bekleyen",
      suffix2: "harika durak var.",
      details: "DETAYLARI GÖR",
      fallbackName: "Gezilecek Yer"
    },
    en: {
      explore: "EXPLORE",
      suffix: "There are",
      suffix2: "amazing stops waiting to be discovered in",
      details: "VIEW DETAILS",
      fallbackName: "Place to Visit"
    }
  }[lang];

  const getLocalizedLink = (path: string) => (lang === "tr" ? path : `/en${path}`);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans">
      {/* Breadcrumb */}
      <nav className="flex text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">
        <Link href={getLocalizedLink("/kesfet")} className="hover:text-blue-600 transition-colors">{t.explore}</Link>
        <span className="mx-3 opacity-30">/</span>
        <Link href={getLocalizedLink(`/kesfet/${region}`)} className="hover:text-blue-600 transition-colors">{region.replace("-", " ")}</Link>
        <span className="mx-3 opacity-30">/</span>
        <span className="text-blue-600">{actualCityKey}</span>
      </nav>

      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 capitalize mb-6 tracking-tighter italic">
          {actualCityKey}
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
          {lang === "tr" ? (
            <>{actualCityKey} {t.suffix} <strong>{cityPlaces.length} {t.suffix2}</strong></>
          ) : (
            <>{t.suffix} <strong>{cityPlaces.length} {t.suffix2}</strong> {actualCityKey}.</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {cityPlaces.map((place: any, index: number) => {
          const placeName = place.name?.[lang] || place.name?.tr || t.fallbackName;
          const targetImageKey = `${slugify(actualCityKey || "")}-${slugify(place.slug)}`;
          const coverImage = cityImages[targetImageKey]?.[0] || cityImages[place.slug]?.[0];

          return (
            <Link 
              key={index}
              href={getLocalizedLink(`/kesfet/${region}/${city}/${place.slug}`)}
              className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 block"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                {coverImage ? (
                  <img 
                    src={coverImage} 
                    alt={`${actualCityKey} ${placeName}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">🏛️</div>
                )}
                
                <div className="absolute top-6 left-6">
                   <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-xl border-2 border-white/20 backdrop-blur-md">
                     {index + 1}
                   </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                      {placeName}
                    </h3>
                    <div className="flex items-center text-blue-400 text-[10px] font-black tracking-widest uppercase">
                      {t.details} <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                    </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}