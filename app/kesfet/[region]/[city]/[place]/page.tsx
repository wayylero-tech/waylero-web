import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import PlaceSlider from "./PlaceSlider";
import fs from "fs";
import path from "path";
import { slugify } from "@/lib/utils/slugify";

export const runtime = "nodejs";

const BASE_URL = "https://www.waylero.com";

type Params = { region: string; city: string; place: string };

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.25;
}

// 🌍 LANGUAGE
async function getLanguage() {
  const h = await headers();
  const currentPath = h.get("x-url") || "";
  const middlewareLang = h.get("x-url-lang");

  if (middlewareLang === "en" || currentPath.includes("/en/")) return "en";

  const cookieStore = await cookies();
  return (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
}

// 📦 CITY DATA
const loadCityData = cache(async (region: string, city: string) => {
  const filePath = path.join(
    process.cwd(),
    "app/data/ulkelerdata",
    region,
    `${city}.json`
  );

  if (!fs.existsSync(filePath)) return null;

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
});

// 🖼 IMAGES
const loadImages = cache((region: string) => {
  const filePath = path.join(
    process.cwd(),
    "app/data/ulkedataimages",
    `${region}.json`
  );

  if (!fs.existsSync(filePath)) return {};

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
});

// 🔥 METADATA
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { region, city, place } = await params;
  const lang = await getLanguage();

  const cityData = await loadCityData(region, city);
  if (!cityData) return { title: "Waylero" };

  const found = cityData.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!found) return { title: "Waylero" };

  const name = found.name?.[lang] || found.name?.tr;

  const seo = {
    tr: {
      title: `${name} | Gezi Rehberi`,
      desc: `${name} hakkında bilgiler ve gezilecek yerler.`,
    },
    en: {
      title: `${name} | Travel Guide`,
      desc: `Discover ${name} and nearby places.`,
    },
  }[lang];

  const desc = (seo.desc + " " + (found.description?.[lang] || "")).slice(0, 158);

  const allImages = loadImages(region);
  const imageGroup = allImages[city] || {};

  const imageKey = `${slugify(city)}-${slugify(found.slug)}`;
  const image = imageGroup?.[imageKey]?.[0];

  const urlPath = `/kesfet/${region}/${city}/${place}`;
  const trUrl = `${BASE_URL}${urlPath}`;
  const enUrl = `${BASE_URL}/en${urlPath}`;

  return {
    title: seo.title,
    description: desc,
    robots: { index: true, follow: true },
    alternates: {
      canonical: lang === "en" ? enUrl : trUrl,
    },
    openGraph: {
      title: seo.title,
      description: desc,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

// 🔥 PAGE
export default async function Page({ params }: { params: Promise<Params> }) {
  const { region, city, place } = await params;
  const lang = await getLanguage();

  const cityData = await loadCityData(region, city);
  if (!cityData) return notFound();

  const foundPlace = cityData.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!foundPlace) return notFound();

  const imagesData = loadImages(region);
  const imageGroup = imagesData[city] || {};

  const imageKey = `${slugify(city)}-${slugify(foundPlace.slug)}`;
  const images = imageGroup[imageKey] || [];

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

  const t = {
  tr: {
    about: "Hakkında",
    todo: "Neler Yapılır?",
    nearby: "Yakındaki Yerler",
    location: "Konum",
    noPhoto: "Fotoğraf yok",
    unit: "km",
    distanceNote: "(tahmini)",
    eventsTitle: "etkinlikleri",
   eventsText: "İlindeki konserleri ve etkinlikleri keşfet →"
  },
  en: {
    about: "About",
    todo: "Things to Do",
    nearby: "Nearby",
    location: "Location",
    noPhoto: "No photos",
    unit: "km",
    distanceNote: "(estimated)",
     eventsTitle: "events",
  eventsText: "Discover concerts and events in your city →"
  },
}[lang];

  const langPrefix = lang === "en" ? "/en" : "";

  const cityName =
  city.charAt(0).toUpperCase() + city.slice(1);

 return (
  <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
    <h1 className="text-4xl font-black">{foundPlace.name?.[lang]}</h1>

    <section>
      {images.length > 0 ? (
        <PlaceSlider images={images} title={foundPlace.name?.[lang]} />
      ) : (
        <div className="h-[400px] flex items-center justify-center border rounded-3xl text-gray-400">
          {t.noPhoto}
        </div>
      )}
    </section>

    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 border rounded-3xl p-6">
        <h2 className="font-bold mb-4">{t.about}</h2>
        <p className="text-gray-600">
          {foundPlace.description?.[lang]}
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-2xl p-4">
          <h3 className="font-bold mb-2">{t.todo}</h3>
          <ul className="space-y-2">
            {(foundPlace.activities?.[lang] || []).map((a: string, i: number) => (
              <li key={i} className="text-sm">{a}</li>
            ))}
          </ul>
        </div>

        <div className="border rounded-2xl p-4">
          <h3 className="font-bold mb-2">{t.nearby}</h3>
          {nearbyPlaces.map((p: any) => (
            <a
              key={p.slug}
              href={`${langPrefix}/kesfet/${region}/${city}/${p.slug}`}
              className="block text-sm py-1"
            >
              {p.name?.[lang]} - {p.distance.toFixed(1)} km {t.distanceNote}
            </a>
          ))}
        </div>

        {/* 🟩 ETKİNLİKLER BURAYA EKLENDİ */}
        {region === "turkiye" && (
  <div className="bg-green-50 rounded-2xl p-4 border border-green-100 shadow-sm">
    <h3 className="font-bold text-green-900 mb-2">
      {cityName} {t.eventsTitle}
    </h3>

    <a
      href={`${langPrefix}/aktiviteler?city=${city}`}
      className="text-green-700 font-bold hover:underline text-sm"
    >
      {t.eventsText}
    </a>
  </div>
)}
      </div>
    </div>

    {foundPlace.latitude && foundPlace.longitude && (
      <iframe
        className="w-full h-[400px] rounded-3xl"
        src={`https://maps.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&z=15&output=embed`}
      />
    )}
  </main>
);
}