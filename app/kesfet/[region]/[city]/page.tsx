import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers"; // 🔥 Cookies yerine headers

// Data
import turkey from "../../../data/turkey.json";
import europa from "../../../data/europa.json";
import asia from "../../../data/asia.json";

import turkeyImages from "../../../data/images/turkey.json";
import europaImages from "../../../data/images/europa.json";
import asiaImages from "../../../data/images/asia.json";

import { countryToRegionMap } from "@/lib/countryToRegionMap";
import { slugify } from "@/lib/utils/slugify";

interface Props {
  params: Promise<{ region: string; city: string }>;
}

// 🌍 Güvenli Dil Yakalama (URL Tabanlı)
async function getLanguage() {
  const headerList = await headers();
  const currentPath = headerList.get("x-url") || "";
  const middlewareLang = headerList.get("x-url-lang");
  
  if (middlewareLang === "en" || currentPath.includes("/en/")) {
    return "en";
  }
  return "tr";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, city } = await params;
  const lang = await getLanguage();
  const baseUrl = "https://www.waylero.com";

  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const t = {
    tr: {
      title: `${cityName} Gezilecek Yerler | En İyi ${cityName} Rotaları`,
      desc: `${cityName} seyahatiniz için görülmesi gereken yerler ve şehir rehberi.`,
    },
    en: {
      title: `Places to Visit in ${cityName} | Best ${cityName} Routes`,
      desc: `Discover the best places to visit and city guide for your trip to ${cityName}.`,
    },
  }[lang];

  const path = `/kesfet/${region}/${city}`;

  return {
    title: `${t.title} - Waylero`,
    description: t.desc,
    alternates: {
      canonical: lang === "tr" ? `${baseUrl}${path}` : `${baseUrl}/en${path}`,
      languages: {
        "tr-TR": `${baseUrl}${path}`,
        "en-US": `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}${path}`,
      },
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { region, city } = await params;
  const lang = await getLanguage();

  const targetDataKey = countryToRegionMap[region.toLowerCase()];
  if (!targetDataKey) notFound();

  const allData: Record<string, any> = { turkey, europa, asia };
  const allImages: Record<string, any> = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };

  const regionData = allData[targetDataKey];
  if (!regionData) notFound();

  const actualCityKey = Object.keys(regionData).find(
    (key) => slugify(key) === city.toLowerCase()
  );

  const cityPlaces = actualCityKey ? regionData[actualCityKey] : null;
  if (!cityPlaces) notFound();

  const cityImages = allImages[targetDataKey]?.[actualCityKey || ""] || {};

  const t = {
    tr: {
      suffix: "şehrinde keşfedilmeyi bekleyen",
      suffix2: "harika durak var.",
      details: "DETAYLARI GÖR",
      fallbackName: "Gezilecek Yer",
    },
    en: {
      suffix: "There are",
      suffix2: "amazing stops waiting to be discovered in",
      details: "VIEW DETAILS",
      fallbackName: "Place to Visit",
    },
  }[lang];

  const getLocalizedLink = (path: string) =>
    lang === "tr" ? path : `/en${path}`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans">

      {/* Breadcrumb */}
      <nav className="flex text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">
        <Link href={getLocalizedLink("/kesfet")} className="hover:text-blue-600">
          EXPLORE
        </Link>
        <span className="mx-3 opacity-30">/</span>
        <Link href={getLocalizedLink(`/kesfet/${region}`)} className="hover:text-blue-600">
          {region.replace("-", " ")}
        </Link>
        <span className="mx-3 opacity-30">/</span>
        <span className="text-blue-600">{actualCityKey}</span>
      </nav>

      {/* Title */}
      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 capitalize mb-6 tracking-tighter">
          {actualCityKey}
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl">
          {lang === "tr" ? (
            <>{actualCityKey} {t.suffix} <strong>{cityPlaces.length} {t.suffix2}</strong></>
          ) : (
            <>{t.suffix} <strong>{cityPlaces.length} {t.suffix2}</strong> {actualCityKey}.</>
          )}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {cityPlaces.map((place: any, index: number) => {
          if (!place) return null;
          const placeName = place.name?.[lang] || place.name?.tr || t.fallbackName;
          const imageKey = `${slugify(actualCityKey || "")}-${slugify(place.slug)}`;
          const coverImage = cityImages[imageKey]?.[0] || cityImages[place.slug]?.[0];

          return (
            <Link
              key={place.slug || index}
              href={getLocalizedLink(`/kesfet/${region}/${city}/${place.slug}`)}
              className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 block"
            >
              <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={`${actualCityKey} ${placeName}`}
                    loading={index < 3 ? "eager" : "lazy"}
                    fetchPriority={index < 3 ? "high" : "low"}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">🏛️</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-2xl font-black text-white mb-2">{placeName}</h3>
                  <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{t.details} →</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}