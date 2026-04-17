import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import PlaceSlider from "./PlaceSlider";

import turkeyImages from "../../../../data/images/turkey.json";
import europaImages from "../../../../data/images/europa.json";
import asiaImages from "../../../../data/images/asia.json";

import { countryToRegionMap } from "@/lib/countryToRegionMap";
import { slugify } from "@/lib/utils/slugify";

const IMAGES: any = {
  turkey: turkeyImages,
  europa: europaImages,
  asia: asiaImages,
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const BASE_URL = "https://www.waylero.com";

type Params = { region: string; city: string; place: string };


// 🌍 LANGUAGE
async function getLanguage() {
  const h = await headers();
  const currentPath = h.get("x-url") || "";
  const middlewareLang = h.get("x-url-lang");

  if (middlewareLang === "en" || currentPath.includes("/en/")) return "en";

  const cookieStore = await cookies();
  return (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
}


// 🔥 CACHE'LENMİŞ CITY DATA LOADER
const loadCityData = cache(async (regionKey: string, citySlug: string) => {
  try {
    const module = await import(
      `../../../../data/data/${regionKey}/${citySlug}.json`
    );
    return module.default;
  } catch {
    return null;
  }
});


// 🔥 METADATA
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { region, city, place } = await params;
  const lang = await getLanguage();
  const mainRegion = countryToRegionMap[region] || region;

  const cityData = await loadCityData(mainRegion, city);
  if (!cityData) return { title: "Waylero" };

  const found = cityData.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!found) return { title: "Waylero" };

  const name = found.name?.[lang] || found.name?.tr;
  
  // SEO Başlık ve Açıklama Şablonları
  const seoSettings = {
    tr: {
      title: `${name} | Gezi Rehberi, Neler Yapılır ve Konumu`,
      descPrefix: `${name} hakkında bilgiler, yapılacak aktiviteler, konumu ve yakındaki gezilecek yerler. Waylero ile keşfet!`,
    },
    en: {
      title: `${name} | Travel Guide, Things to Do & Location`,
      descPrefix: `Discover ${name}: attractions, things to do, map location, and nearby places. Explore with Waylero!`,
    }
  }[lang];

  // Description oluşturma (Verideki description + bizim SEO metnimiz)
  const rawDesc = found.description?.[lang] || found.description?.tr || "";
  const fullDesc = `${seoSettings.descPrefix} ${rawDesc}`.slice(0, 158);

  const imageGroup = IMAGES[mainRegion]?.[slugify(city)] || {};
  const imageKey = `${slugify(city)}-${slugify(found.slug)}`;
  const image = imageGroup?.[imageKey]?.[0] || imageGroup?.[found.slug]?.[0];

  const path = `/kesfet/${region}/${city}/${place}`;
  const trUrl = `${BASE_URL}${path}`;
  const enUrl = `${BASE_URL}/en${path}`;

  return {
    title: seoSettings.title,
    description: fullDesc,
    // 🔥 Önemli: Google'ın sayfayı indexlemesi için
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: lang === "en" ? enUrl : trUrl,
      languages: {
        "tr-TR": trUrl,
        "en-US": enUrl,
        "x-default": trUrl,
      },
    },
    openGraph: {
      title: seoSettings.title,
      description: fullDesc,
      url: lang === "en" ? enUrl : trUrl,
      siteName: 'Waylero',
      locale: lang === "en" ? "en_US" : "tr_TR",
      type: 'article', // Mekan sayfaları için 'article' veya 'website' uygundur
      images: image ? [{ url: image, width: 1200, height: 630, alt: name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoSettings.title,
      description: fullDesc,
      images: image ? [image] : undefined,
    },
  };
}


// 🔥 PAGE
export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { region, city, place } = await params;
  const lang = await getLanguage();

  const mainRegion = countryToRegionMap[region] || region;

  const cityData = await loadCityData(mainRegion, city);
  if (!cityData) return notFound();

  const foundPlace = cityData.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!foundPlace) return notFound();

  // YAKINDAKİ YERLER HESAPLAMA
  const nearbyPlaces = cityData
    .filter((p: any) => p.slug !== foundPlace.slug && p.latitude && p.longitude)
    .map((p: any) => ({
      ...p,
      distance: getDistance(
        foundPlace.latitude,
        foundPlace.longitude,
        p.latitude,
        p.longitude
      ),
    }))
    .sort((a: any, b: any) => a.distance - b.distance)
    .slice(0, 3);

  const name = foundPlace.name?.[lang] || foundPlace.name?.tr;
  const desc = foundPlace.description?.[lang] || foundPlace.description?.tr;
  const activities = foundPlace.activities?.[lang] || foundPlace.activities?.tr || [];

  const imageGroup = IMAGES[mainRegion]?.[slugify(city)] || {};
  const imageKey = `${slugify(city)}-${slugify(foundPlace.slug)}`;
  const images = imageGroup[imageKey] || imageGroup[foundPlace.slug] || [];

 const t = {
    tr: {
      about: "Hakkında",
      todo: "Neler Yapılır?",
      location: "Konum",
      noPhoto: "Fotoğraf yok",
      nearby: "Yakındaki Yerler",
      othersInCity: `${city} şehrindeki diğer yerler`,
      seeAll: `Tüm ${city} yerlerini gör →`,
      eventsInCity: `${city} etkinlikleri`,
      discoverEvents: `${city} konser ve etkinliklerini keşfet →`,
      unit: "km"
    },
    en: {
      about: "About",
      todo: "Things to Do",
      location: "Location",
      noPhoto: "No photos available",
      nearby: "Nearby Places",
      othersInCity: `Other places in ${city}`,
      seeAll: `See all places in ${city} →`,
      eventsInCity: `Events in ${city}`,
      discoverEvents: `Discover concerts and events in ${city} →`,
      unit: "km"
    },
  }[lang];

  // URL yapısı için dil prefix'i (en/tr kontrolü)
  const langPrefix = lang === "en" ? "/en" : "";

 return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header className="border-b pb-6">
        <h1 className="text-4xl md:text-6xl font-black">{name}</h1>
      </header>

      <section>
        {images.length > 0 ? (
          <PlaceSlider images={images} title={name} />
        ) : (
          <div className="h-[400px] flex items-center justify-center border rounded-3xl text-gray-400 bg-gray-50">
            {t.noPhoto}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* ABOUT */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border shadow-sm">
          <h2 className="font-bold text-xl mb-4">{t.about}</h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {desc}
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-3xl p-6 border shadow-sm">
            <h2 className="font-bold text-xl mb-4 text-blue-900">{t.todo}</h2>
            <ul className="space-y-3">
              {activities.map((a: string, i: number) => (
                <li key={i} className="bg-white p-4 rounded-xl text-sm font-bold text-gray-700 shadow-sm border border-blue-100">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* 🟦 YAKINDAKİ YERLER */}
          <div className="bg-white rounded-2xl p-4 border shadow-sm">
            <h3 className="font-bold text-blue-900 mb-3">{t.nearby}</h3>
            <div className="space-y-2">
              {nearbyPlaces.map((p: any) => (
                <a
                  key={p.slug}
                  href={`${langPrefix}/kesfet/${region}/${city}/${p.slug}`}
                  className="block p-3 rounded-xl border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-bold text-sm">{p.name?.[lang] || p.name?.tr}</div>
                  <div className="text-xs text-gray-500">{p.distance.toFixed(1)} {t.unit}</div>
                </a>
              ))}
            </div>
          </div>

          {/* 🟨 ŞEHİR DİĞERLERİ */}
          <div className="bg-white rounded-2xl p-4 border shadow-sm">
            <h3 className="font-bold text-blue-900 mb-3">{t.othersInCity}</h3>
            <a href={`${langPrefix}/kesfet/${region}/${city}`} className="text-blue-700 font-bold hover:underline text-sm">
              {t.seeAll}
            </a>
          </div>

          {/* 🟩 ETKİNLİKLER (Sadece Türkiye ise) */}
          {(region === "turkiye" || region === "turkey") && (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 shadow-sm">
              <h3 className="font-bold text-green-900 mb-2">{t.eventsInCity}</h3>
              <a href={`${langPrefix}/aktiviteler?city=${city}`} className="text-green-700 font-bold hover:underline text-sm">
                {t.discoverEvents}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 📍 HARİTA (Hatalı iframe URL'i düzeltildi) */}
      {foundPlace.latitude && foundPlace.longitude && (
        <section>
          <h2 className="font-bold text-xl mb-4">{t.location}</h2>
          <div className="h-[450px] rounded-[2.5rem] overflow-hidden border shadow-inner">
            <iframe
              src={`https://maps.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      )}
    </main>
);
}