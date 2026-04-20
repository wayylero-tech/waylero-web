import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import Head from "next/head";
import fs from "fs";
import path from "path";

import { slugify } from "@/lib/utils/slugify";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(
    /^\/+/,
    ""
  )}`;
};

interface Props {
  params: Promise<{ region: string; city: string }>;
}

// 🌍 language
async function getLanguage() {
  const headerList = await headers();
  const currentPath = headerList.get("x-url") || "";
  const middlewareLang = headerList.get("x-url-lang");

  if (middlewareLang === "en" || currentPath.includes("/en/")) {
    return "en";
  }
  return "tr";
}

// SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const lang = await getLanguage();

  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const t = {
    tr: {
      title: `${cityName} Gezilecek Yerler`,
      desc: `${cityName} için en iyi gezi rehberi.`,
    },
    en: {
      title: `Places to Visit in ${cityName}`,
      desc: `Best travel guide for ${cityName}.`,
    },
  }[lang];

  return {
    title: `${t.title} | Waylero`,
    description: t.desc,
  };
}

export default async function CityPage({ params }: Props) {
  const { region, city } = await params;
  const lang = await getLanguage();

  // DATA PATH
  const cityFilePath = path.join(
    process.cwd(),
    "app/data/ulkelerdata",
    region,
    `${city}.json`
  );

  if (!fs.existsSync(cityFilePath)) notFound();

  const cityPlaces = JSON.parse(fs.readFileSync(cityFilePath, "utf-8"));

  // IMAGES
  const imagesPath = path.join(
    process.cwd(),
    "app/data/ulkedataimages",
    `${region}.json`
  );

  let images: any = {};
  if (fs.existsSync(imagesPath)) {
    images = JSON.parse(fs.readFileSync(imagesPath, "utf-8"));
  }

  const actualCityKey =
    cityPlaces?.[0]?.cityName || city.replace(/-/g, " ");

  const cityImages =
    images[city] || images[slugify(city)] || {};

  const t = {
    tr: {
      suffix2: "harika durak var.",
      fallbackName: "Gezilecek Yer",
    },
    en: {
      suffix2: "amazing places.",
      fallbackName: "Place",
    },
  }[lang];

  const getLocalizedLink = (path: string) =>
    lang === "tr" ? path : `/en${path}`;

  // 🔥 breadcrumb base
  const exploreBase = lang === "tr" ? "/kesfet" : "/en/kesfet";

  // 🔥 city names map
  const cityNames: Record<string, { tr: string; en: string }> = {
    adana: { tr: "Adana", en: "Adana" }, adiyaman: { tr: "Adıyaman", en: "Adiyaman" }, afyonkarahisar: { tr: "Afyonkarahisar", en: "Afyonkarahisar" }, agri: { tr: "Ağrı", en: "Agri" }, aksaray: { tr: "Aksaray", en: "Aksaray" }, amasya: { tr: "Amasya", en: "Amasya" }, ankara: { tr: "Ankara", en: "Ankara" }, antalya: { tr: "Antalya", en: "Antalya" }, ardahan: { tr: "Ardahan", en: "Ardahan" }, artvin: { tr: "Artvin", en: "Artvin" }, aydin: { tr: "Aydın", en: "Aydin" }, balikesir: { tr: "Balıkesir", en: "Balikesir" }, bartin: { tr: "Bartın", en: "Bartin" }, batman: { tr: "Batman", en: "Batman" }, bayburt: { tr: "Bayburt", en: "Bayburt" }, bilecik: { tr: "Bilecik", en: "Bilecik" }, bingol: { tr: "Bingöl", en: "Bingol" }, bitlis: { tr: "Bitlis", en: "Bitlis" }, bolu: { tr: "Bolu", en: "Bolu" }, burdur: { tr: "Burdur", en: "Burdur" }, bursa: { tr: "Bursa", en: "Bursa" }, canakkale: { tr: "Çanakkale", en: "Canakkale" }, cankiri: { tr: "Çankırı", en: "Cankiri" }, corum: { tr: "Çorum", en: "Corum" }, denizli: { tr: "Denizli", en: "Denizli" }, diyarbakir: { tr: "Diyarbakır", en: "Diyarbakir" }, edirne: { tr: "Edirne", en: "Edirne" }, elazig: { tr: "Elazığ", en: "Elazig" }, erzincan: { tr: "Erzincan", en: "Erzincan" }, erzurum: { tr: "Erzurum", en: "Erzurum" }, eskisehir: { tr: "Eskişehir", en: "Eskisehir" }, gaziantep: { tr: "Gaziantep", en: "Gaziantep" }, giresun: { tr: "Giresun", en: "Giresun" }, gumushane: { tr: "Gümüşhane", en: "Gumushane" }, hakkari: { tr: "Hakkari", en: "Hakkari" }, hatay: { tr: "Hatay", en: "Hatay" }, igdir: { tr: "Iğdır", en: "Igdir" }, isparta: { tr: "Isparta", en: "Isparta" }, istanbul: { tr: "İstanbul", en: "Istanbul" }, izmir: { tr: "İzmir", en: "Izmir" }, kahramanmaras: { tr: "Kahramanmaraş", en: "Kahramanmaras" }, karabuk: { tr: "Karabük", en: "Karabuk" }, karaman: { tr: "Karaman", en: "Karaman" }, kars: { tr: "Kars", en: "Kars" }, kastamonu: { tr: "Kastamonu", en: "Kastamonu" }, kayseri: { tr: "Kayseri", en: "Kayseri" }, kirikkale: { tr: "Kırıkkale", en: "Kirikkale" }, kirsehir: { tr: "Kırşehir", en: "Kirsehir" }, kocaeli: { tr: "Kocaeli", en: "Kocaeli" }, konya: { tr: "Konya", en: "Konya" }, kutahya: { tr: "Kütahya", en: "Kutahya" }, malatya: { tr: "Malatya", en: "Malatya" }, manisa: { tr: "Manisa", en: "Manisa" }, mardin: { tr: "Mardin", en: "Mardin" }, mersin: { tr: "Mersin", en: "Mersin" }, mugla: { tr: "Muğla", en: "Mugla" }, mus: { tr: "Muş", en: "Mus" }, nevsehir: { tr: "Nevşehir", en: "Nevsehir" }, nigde: { tr: "Niğde", en: "Nigde" }, ordu: { tr: "Ordu", en: "Ordu" }, osmaniye: { tr: "Osmaniye", en: "Osmaniye" }, rize: { tr: "Rize", en: "Rize" }, sakarya: { tr: "Sakarya", en: "Sakarya" }, samsun: { tr: "Samsun", en: "Samsun" }, siirt: { tr: "Siirt", en: "Siirt" }, sinop: { tr: "Sinop", en: "Sinop" }, sivas: { tr: "Sivas", en: "Sivas" }, sanliurfa: { tr: "Şanlıurfa", en: "Sanliurfa" }, tekirdag: { tr: "Tekirdağ", en: "Tekirdag" }, tokat: { tr: "Tokat", en: "Tokat" }, trabzon: { tr: "Trabzon", en: "Trabzon" }, tunceli: { tr: "Tunceli", en: "Tunceli" }, usak: { tr: "Uşak", en: "Usak" }, van: { tr: "Van", en: "Van" }, yalova: { tr: "Yalova", en: "Yalova" }, yozgat: { tr: "Yozgat", en: "Yozgat" }, zonguldak: { tr: "Zonguldak", en: "Zonguldak" } };

  const cityLabel =
    cityNames[slugify(city)]?.[lang] || actualCityKey;

  const regionLabel =
    cityNames[slugify(region)]?.[lang] || region.replace(/-/g, " ");

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* 🔥 BREADCRUMB */}
        <div className="text-blue-600 font-bold text-sm uppercase mb-6 flex items-center gap-2">

          <Link href={exploreBase} className="hover:underline">
            {lang === "tr" ? "KEŞFET" : "EXPLORE"}
          </Link>

          <span>/</span>

          <Link href={`${exploreBase}/${region}`} className="hover:underline">
            {regionLabel}
          </Link>

          <span>/</span>

          <span className="text-blue-600">
            {cityLabel}
          </span>

        </div>

        {/* TITLE */}
        <h1 className="text-6xl font-black mb-4">
          {cityLabel}
        </h1>

        <p className="text-gray-500 mb-12">
          {cityPlaces.length} {t.suffix2}
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cityPlaces.map((place: any) => {
            const placeName =
              place.name?.[lang] || place.name?.tr || t.fallbackName;

            const imageKey = `${slugify(actualCityKey)}-${slugify(place.slug)}`;

            const coverImage =
              cityImages[imageKey]?.[0] ||
              cityImages[place.slug]?.[0];

            return (
              <Link
                key={place.slug}
                href={getLocalizedLink(
                  `/kesfet/${region}/${city}/${place.slug}`
                )}
                className="block"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-gray-100">
                  {coverImage ? (
                    <img
                      src={getCloudinaryUrl(coverImage, 600)}
                      alt={placeName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      🏛️
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-xl">
                  {placeName}
                </h3>
              </Link>
            );
          })}
        </div>

      </main>
    </>
  );
}