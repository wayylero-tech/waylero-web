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
  const desc =
    (found.description?.[lang] ||
      found.description?.tr ||
      "").slice(0, 160);

  const imageGroup = IMAGES[mainRegion]?.[slugify(city)] || {};
  const imageKey = `${slugify(city)}-${slugify(found.slug)}`;
  const image =
    imageGroup?.[imageKey]?.[0] ||
    imageGroup?.[found.slug]?.[0];

  const path = `/kesfet/${region}/${city}/${place}`;
  const trUrl = `${BASE_URL}${path}`;
  const enUrl = `${BASE_URL}/en${path}`;

  return {
    title: `${name} | Waylero`,
    description: desc,
    alternates: {
      canonical: lang === "en" ? enUrl : trUrl,
      languages: {
        "tr-TR": trUrl,
        "en-US": enUrl,
        "x-default": trUrl,
      },
    },
    openGraph: {
      title: name,
      description: desc,
      url: lang === "en" ? enUrl : trUrl,
      images: image
        ? [{ url: image, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: desc,
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

  const name = foundPlace.name?.[lang] || foundPlace.name?.tr;
  const desc =
    foundPlace.description?.[lang] ||
    foundPlace.description?.tr;

  const activities =
    foundPlace.activities?.[lang] ||
    foundPlace.activities?.tr ||
    [];

  const imageGroup = IMAGES[mainRegion]?.[slugify(city)] || {};
  const imageKey = `${slugify(city)}-${slugify(foundPlace.slug)}`;
  const images =
    imageGroup?.[imageKey] ||
    imageGroup?.[foundPlace.slug] ||
    [];

  const t = {
    tr: {
      about: "Hakkında",
      todo: "Neler Yapılır?",
      location: "Konum",
      noPhoto: "Fotoğraf yok",
    },
    en: {
      about: "About",
      todo: "Things to do",
      location: "Location",
      noPhoto: "No photos",
    },
  }[lang];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header className="border-b pb-6">
        <h1 className="text-4xl md:text-6xl font-black">{name}</h1>
      </header>

      <section>
        {images.length > 0 ? (
          <PlaceSlider images={images} title={name} />
        ) : (
          <div className="h-[400px] flex items-center justify-center border rounded-3xl text-gray-400">
            {t.noPhoto}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border shadow-sm">
          <h2 className="font-bold text-xl mb-4">{t.about}</h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="bg-blue-50 rounded-3xl p-6 border shadow-sm">
          <h2 className="font-bold text-xl mb-4 text-blue-900">
            {t.todo}
          </h2>
          <ul className="space-y-3">
            {activities.map((a: string, i: number) => (
              <li
                key={i}
                className="bg-white p-4 rounded-xl text-sm font-bold text-gray-700 shadow-sm border border-blue-100"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

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