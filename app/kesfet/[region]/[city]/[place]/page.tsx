import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import PlaceSlider from "./PlaceSlider";

import turkey from "../../../../data/turkey.json";
import europa from "../../../../data/europa.json";
import asia from "../../../../data/asia.json";

import turkeyImages from "../../../../data/images/turkey.json";
import europaImages from "../../../../data/images/europa.json";
import asiaImages from "../../../../data/images/asia.json";

import { countryToRegionMap } from "@/lib/countryToRegionMap";
import { slugify } from "@/lib/utils/slugify";
import Image from "next/image";

const DATA: any = {
  turkey,
  europa,
  asia,
};

const IMAGES: any = {
  turkey: turkeyImages,
  europa: europaImages,
  asia: asiaImages,
};

const BASE_URL = "https://www.waylero.com";

type Params = { region: string; city: string; place: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { region, city, place } = await params;
  const lang = await getLanguage();

  const mainRegion = countryToRegionMap[region] || region;
  const regionData = DATA[mainRegion];

  if (!regionData) return { title: "Waylero" };

  const cityKey = Object.keys(regionData).find(
    (k) => slugify(k) === slugify(decodeURIComponent(city))
  );

  if (!cityKey) return { title: "Waylero" };

  const found = regionData[cityKey]?.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!found) return { title: "Waylero" };

  const name = found.name?.[lang] || found.name?.tr;
  const desc = (found.description?.[lang] || found.description?.tr || "").slice(0, 160);

  const imageGroup = IMAGES[mainRegion]?.[cityKey] || {};
  const imageKey = `${slugify(cityKey)}-${slugify(found.slug)}`;
  const image = imageGroup?.[imageKey]?.[0];

  const path = `/kesfet/${region}/${city}/${place}`;
  const enPath = `/en${path}`;

  return {
    title: `${name} | Waylero`,
    description: desc,
    alternates: {
      canonical: `${BASE_URL}${lang === "en" ? enPath : path}`,
    },
    openGraph: {
      title: name,
      description: desc,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

async function getLanguage() {
  const h = await headers();
  const cookieStore = await cookies();

  const path = h.get("x-invoke-path") || "";
  if (path.startsWith("/en")) return "en";

  return (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { region, city, place } = await params;
  const lang = await getLanguage();

  const mainRegion = countryToRegionMap[region] || region;
  const regionData = DATA[mainRegion];

  if (!regionData) return notFound();

  const cityKey = Object.keys(regionData).find(
    (k) => slugify(k) === slugify(decodeURIComponent(city))
  );

  if (!cityKey) return notFound();

  const foundPlace = regionData[cityKey]?.find(
    (p: any) => slugify(p.slug) === slugify(decodeURIComponent(place))
  );

  if (!foundPlace) return notFound();

  const name = foundPlace.name?.[lang] || foundPlace.name?.tr;
  const desc = foundPlace.description?.[lang] || foundPlace.description?.tr;
  const activities = foundPlace.activities?.[lang] || foundPlace.activities?.tr || [];

  const imageGroup = IMAGES[mainRegion]?.[cityKey] || {};
  const imageKey = `${slugify(cityKey)}-${slugify(foundPlace.slug)}`;
  const images =
    imageGroup?.[imageKey] || imageGroup?.[foundPlace.slug] || [];

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

      {/* HEADER */}
      <header className="border-b pb-6">
        <h1 className="text-4xl md:text-6xl font-black">
          {name}
        </h1>
      </header>

      {/* IMAGE */}
      <section>
        {images.length > 0 ? (
          <PlaceSlider images={images} title={name} />
        ) : (
          <div className="h-[400px] flex items-center justify-center border rounded-3xl text-gray-400">
            {t.noPhoto}
          </div>
        )}
      </section>

      {/* CONTENT */}
      <div className="grid md:grid-cols-3 gap-8">

        <div className="md:col-span-2 bg-white rounded-3xl p-6 border">
          <h2 className="font-bold text-xl mb-4">{t.about}</h2>
          <p className="text-gray-600 whitespace-pre-line">{desc}</p>
        </div>

        <div className="bg-blue-50 rounded-3xl p-6 border">
          <h2 className="font-bold text-xl mb-4">{t.todo}</h2>

          <ul className="space-y-3">
            {activities.map((a: string, i: number) => (
              <li key={i} className="bg-white p-3 rounded-xl text-sm font-semibold">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MAP */}
      {foundPlace.latitude && foundPlace.longitude && (
        <section>
          <h2 className="font-bold text-xl mb-4">{t.location}</h2>

          <div className="h-[450px] rounded-3xl overflow-hidden border">
            <iframe
              src={`https://maps.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&z=15&output=embed`}
              width="100%"
              height="100%"
              loading="lazy"
            />
          </div>
        </section>
      )}
    </main>
  );
}