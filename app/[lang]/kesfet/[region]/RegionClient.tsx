"use client";

import { useMemo } from "react";

import Link from "next/link";

import { slugify } from "@/lib/utils/slugify";

import {
  Globe,
  ChevronRight,
  MapPin,
} from "lucide-react";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (
  imagePath: string,
  width: number
) => {
  if (!imagePath) return "";

  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${imagePath.replace(
    /^\/+/,
    ""
  )}`;
};

/*
 * -------------------------------------------------------
 * TÜRKÇE ŞEHİR İSİMLERİ
 * -------------------------------------------------------
 */

const cityNameMapTR: Record<string, string> = {
  adana: "Adana",
  adiyaman: "Adıyaman",
  afyonkarahisar: "Afyonkarahisar",
  agri: "Ağrı",
  amasya: "Amasya",
  ankara: "Ankara",
  antalya: "Antalya",
  artvin: "Artvin",
  aydin: "Aydın",
  balikesir: "Balıkesir",
  bilecik: "Bilecik",
  bingol: "Bingöl",
  bitlis: "Bitlis",
  bolu: "Bolu",
  burdur: "Burdur",
  bursa: "Bursa",
  canakkale: "Çanakkale",
  cankiri: "Çankırı",
  corum: "Çorum",
  denizli: "Denizli",
  diyarbakir: "Diyarbakır",
  edirne: "Edirne",
  elazig: "Elazığ",
  erzincan: "Erzincan",
  erzurum: "Erzurum",
  eskisehir: "Eskişehir",
  gaziantep: "Gaziantep",
  giresun: "Giresun",
  gumushane: "Gümüşhane",
  hakkari: "Hakkari",
  hatay: "Hatay",
  isparta: "Isparta",
  mersin: "Mersin",
  istanbul: "İstanbul",
  izmir: "İzmir",
  kars: "Kars",
  kastamonu: "Kastamonu",
  kayseri: "Kayseri",
  kirklareli: "Kırklareli",
  kirsehir: "Kırşehir",
  kocaeli: "Kocaeli",
  konya: "Konya",
  kutahya: "Kütahya",
  malatya: "Malatya",
  manisa: "Manisa",
  kahramanmaras: "Kahramanmaraş",
  mardin: "Mardin",
  mugla: "Muğla",
  mus: "Muş",
  nevsehir: "Nevşehir",
  nigde: "Niğde",
  ordu: "Ordu",
  rize: "Rize",
  sakarya: "Sakarya",
  samsun: "Samsun",
  siirt: "Siirt",
  sinop: "Sinop",
  sivas: "Sivas",
  tekirdag: "Tekirdağ",
  tokat: "Tokat",
  trabzon: "Trabzon",
  tunceli: "Tunceli",
  sanliurfa: "Şanlıurfa",
  usak: "Uşak",
  van: "Van",
  yozgat: "Yozgat",
  zonguldak: "Zonguldak",
  aksaray: "Aksaray",
  bayburt: "Bayburt",
  karaman: "Karaman",
  kirikkale: "Kırıkkale",
  batman: "Batman",
  sirnak: "Şırnak",
  bartin: "Bartın",
  ardahan: "Ardahan",
  igdir: "Iğdır",
  yalova: "Yalova",
  karabuk: "Karabük",
  kilis: "Kilis",
  osmaniye: "Osmaniye",
  duzce: "Düzce",
};

const formatCityName = (
  name: string,
  lang: string
) => {
  const normalized = name
    .replace(/-/g, " ")
    .toLowerCase();

  if (lang === "tr") {
    return (
      cityNameMapTR[normalized] ||
      normalized.replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
    );
  }

  return normalized
    .replace(/[ğüşıöç]/g, (char) =>
      (
        {
          ğ: "g",
          ü: "u",
          ş: "s",
          ı: "i",
          ö: "o",
          ç: "c",
        } as Record<string, string>
      )[char] || char
    )
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

/*
 * -------------------------------------------------------
 * YER TİPİ
 * -------------------------------------------------------
 */

type Place = {
  slug?: string;

  name?: {
    tr?: string;
    en?: string;
    [key: string]: string | undefined;
  };

  description?: {
    tr?: string;
    en?: string;
    [key: string]: string | undefined;
  };
};

type City = {
  name: string;
  slug: string;
  placeCount: number;
  coverImage?: string;
  places: Place[];
};

/*
 * -------------------------------------------------------
 * İLK PARAGRAFI AL
 *
 * description içinde:
 *
 * Sabancı Merkez Camii...
 *
 * **Nasıl Gidilir:** ...
 *
 * olduğu için sadece ilk paragrafı alıyoruz.
 * -------------------------------------------------------
 */

const getShortDescription = (
  description: string | undefined,
  maxLength = 190
) => {
  if (!description) return "";

  /*
   * Markdown başlıklarından önceki bölüm
   */
  const beforeHeading = description.split(
    /\n\s*\*\*/
  )[0];

  /*
   * Gereksiz boşlukları temizle
   */
  const clean = beforeHeading
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) {
    return clean;
  }

  /*
   * Kelimenin ortasında kesmemek için
   */
  const shortened = clean.slice(0, maxLength);

  const lastSpace = shortened.lastIndexOf(" ");

  if (lastSpace > 80) {
    return `${shortened.slice(0, lastSpace)}...`;
  }

  return `${shortened}...`;
};

/*
 * -------------------------------------------------------
 * COMPONENT
 * -------------------------------------------------------
 */

export default function RegionClient({
  region,
  regionName,
  lang,
  data,
  images,
}: {
  region: string;
  regionName: string;
  lang: string;
  data: Record<string, Place[]>;
  images: Record<string, any>;
}) {
  const isEn = lang === "en";

  const t = isEn
    ? {
        discoverTitle: "Explore",
        badge: "POPULAR CITIES",
        placeSuffix: "PLACES TO VISIT",
        exploreText: "Explore Now",
        placesTitle: "Places to Visit in",
        viewAll: "View all places",
      }
    : {
        discoverTitle: "Keşfet",
        badge: "POPÜLER ŞEHİRLER",
        placeSuffix: "GEZİLECEK YER",
        exploreText: "Hemen İncele",
        placesTitle: "Gezilecek Yerler",
        viewAll: "Tüm yerleri gör",
      };

  /*
   * -------------------------------------------------------
   * ŞEHİRLERİ HAZIRLA
   * -------------------------------------------------------
   */

  const countryCities = useMemo(() => {
  if (!data) return [];

  return Object.entries(data)
    .map(([cityKey, places]) => {
      if (!places?.length) {
        return null;
      }

      const citySlug = slugify(cityKey);

      const cityImages =
        images?.[cityKey] ||
        images?.[citySlug] ||
        {};

      const firstPlace = places[0];

      const imageKey = firstPlace?.slug
        ? `${citySlug}-${slugify(firstPlace.slug)}`
        : "";

      const coverImage =
        cityImages?.[imageKey]?.[0] ||
        cityImages?.[
          Object.keys(cityImages)[0]
        ]?.[0];

      const selectedPlaces = places
        .filter(Boolean)
        .slice(0, 5);

      return {
        name: formatCityName(cityKey, lang),
        slug: citySlug,
        placeCount: places.length,
        coverImage,
        places: selectedPlaces,
      };
    })
    .filter((city) => city !== null);
}, [data, images, lang]);

  /*
   * -------------------------------------------------------
   * DİLİ URL'YE EKLE
   * -------------------------------------------------------
   */

  const getLocalizedLink = (
    urlPath: string
  ) => {
    return isEn
      ? `/en${urlPath}`
      : `/tr${urlPath}`;
  };

  /*
   * -------------------------------------------------------
   * ANA SAYFA
   * -------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-white">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="pt-24 pb-48 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-blue-700 text-[10px] font-black uppercase rounded-full mb-8 border border-blue-100 shadow-sm">
            <Globe
              size={14}
              className="text-blue-500"
            />

            <span>{t.badge}</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tight uppercase">
            {regionName}
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
           {isEn
  ? `Explore ${regionName}. Discover the most popular places.`
  : `${regionName}’yi keşfedin. En popüler yerleri görün.`}
          </p>
        </div>
      </section>

      {/* ==================================================
          CITY GRID
      ================================================== */}

      <section className="container mx-auto px-6 -mt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {countryCities.map(
            (city, index) => (
              <Link
                key={city.slug}
                href={getLocalizedLink(
                  `/kesfet/${region}/${city.slug}`
                )}
                className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                {/* ==================================================
                    CITY IMAGE
                ================================================== */}

                <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
                  {city.coverImage ? (
                    <img
                      src={getCloudinaryUrl(
                        city.coverImage,
                        600
                      )}
                      alt={city.name}
                      loading={
                        index < 3
                          ? "eager"
                          : "lazy"
                      }
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <>
                      <img
                        src="/images/waylero-placeholder.jpg"
                        alt={city.name}
                        loading={
                          index < 3
                            ? "eager"
                            : "lazy"
                        }
                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0" />
                    </>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 z-[1]" />

                  {/* YER SAYISI */}

                  <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-2xl text-[10px] font-black text-gray-900 border border-white z-10">
                    {city.placeCount}{" "}
                    {t.placeSuffix}
                  </div>

                  {/* ŞEHİR BAŞLIĞI */}

                  <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                      {t.discoverTitle}
                    </p>

                    <h2 className="text-4xl font-serif font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                      {city.name}
                    </h2>

                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                        {t.exploreText}
                      </span>

                      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                        <ChevronRight
                          size={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    CITY PLACES
                ================================================== */}

                <div className="bg-white px-8 md:px-10 pt-8 pb-10">
                  <div className="flex items-center gap-2 mb-7">
                    <MapPin
                      size={17}
                      className="text-blue-500"
                    />

                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      {city.name}{" "}
                      {t.placesTitle}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {city.places.map(
                      (place, placeIndex) => {
                        const placeName =
                          place.name?.[
                            isEn
                              ? "en"
                              : "tr"
                          ] ||
                          place.name?.tr ||
                          place.name?.en ||
                          place.slug ||
                          "";

                        const description =
                          place.description?.[
                            isEn
                              ? "en"
                              : "tr"
                          ] ||
                          place.description?.tr ||
                          place.description?.en ||
                          "";

                        const shortDescription =
                          getShortDescription(
                            description
                          );

                        return (
                          <div
                            key={
                              place.slug ||
                              placeIndex
                            }
                            className="relative pl-5 border-l-2 border-gray-100 group/place"
                          >
                            <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500" />

                            <h4 className="text-[15px] md:text-base font-bold text-gray-900 leading-snug">
                              {placeName}
                            </h4>

                            {shortDescription && (
                              <p className="mt-2 text-sm text-gray-500 leading-6">
                                {
                                  shortDescription
                                }
                              </p>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* ALT CTA */}

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <span className="inline-flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-wide">
                      {t.viewAll}

                      <ChevronRight
                        size={15}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </section>
    </main>
  );
}