"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLang } from "../../context/LanguageContext";
import { slugify } from "@/lib/utils/slugify";

// ✅ Cloudinary Yapılandırması
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

interface RegionClientProps {
  region: string;
  lang: string;
  data: any;    // Artık page.tsx'ten gelecek
  images: any;  // Artık page.tsx'ten gelecek
}

const cityNameMapTR: Record<string, string> = {
  adana: "Adana",  adiyaman: "Adıyaman",  afyonkarahisar: "Afyonkarahisar",
  agri: "Ağrı",  aksaray: "Aksaray",  amasya: "Amasya",  ankara: "Ankara",
  antalya: "Antalya",  ardahan: "Ardahan",  artvin: "Artvin",  aydin: "Aydın",
  balikesir: "Balıkesir",  bartin: "Bartın",  batman: "Batman",
  bayburt: "Bayburt",  bilecik: "Bilecik",  bingol: "Bingöl",
  bitlis: "Bitlis",  bolu: "Bolu",  burdur: "Burdur",  bursa: "Bursa",
  canakkale: "Çanakkale",  cankiri: "Çankırı",  corum: "Çorum",  denizli: "Denizli",
  diyarbakir: "Diyarbakır",  duzce: "Düzce",  edirne: "Edirne",  elazig: "Elazığ",
  erzincan: "Erzincan",  erzurum: "Erzurum",  eskisehir: "Eskişehir",  gaziantep: "Gaziantep",
  giresun: "Giresun",  gumushane: "Gümüşhane",  hakkari: "Hakkari",  hatay: "Hatay",
  igdir: "Iğdır",  isparta: "Isparta",  istanbul: "İstanbul",  izmir: "İzmir",
  kahramanmaras: "Kahramanmaraş",  karabuk: "Karabük",  karaman: "Karaman",  kars: "Kars",
  kastamonu: "Kastamonu",  kayseri: "Kayseri",  kirikkale: "Kırıkkale",
    kirsehir: "Kırşehir",  kocaeli: "Kocaeli",  konya: "Konya",
  kutahya: "Kütahya",  malatya: "Malatya",  manisa: "Manisa",  mardin: "Mardin",
  mersin: "Mersin",  mugla: "Muğla",  mus: "Muş",  nevsehir: "Nevşehir",  nigde: "Niğde",
  ordu: "Ordu",  osmaniye: "Osmaniye",  rize: "Rize",  sakarya: "Sakarya",  samsun: "Samsun",
  sinop: "Sinop",  sivas: "Sivas",  sanliurfa: "Şanlıurfa",  sirnak: "Şırnak",
  tekirdag: "Tekirdağ",  tokat: "Tokat",  trabzon: "Trabzon",  tunceli: "Tunceli",
  usak: "Uşak",  van: "Van",  yalova: "Yalova",  yozgat: "Yozgat",  zonguldak: "Zonguldak"
};


const formatCityName = (name: string, lang: string) => {
  const normalized = name
    .replace(/-/g, " ")
    .toLowerCase();

  if (lang === "tr") {
    const fixed = cityNameMapTR[normalized];
    if (fixed) return fixed;

    return normalized.replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // EN
  const english = normalized
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

  return english.replace(/\b\w/g, (l) => l.toUpperCase());
};

const trackClick = (type: string, label: string, destination?: string) => {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "click", {
    click_type: type,
    label,
    destination,
    page: window.location.pathname,
    transport_type: "beacon",
  });
};

export default function RegionClient({ region, lang: propLang, data, images }: RegionClientProps) {
  const { lang: contextLang } = useLang();
  const lang = propLang || contextLang || "tr";

  // Veri artık prop ile doğrudan geliyor
  const dataSource = data || {};

  const t = {
    tr: {
      discoverTitle: "Keşfedin",
      countryDesc: "Bu ülkedeki en popüler şehirleri keşfedin.",
      regionDesc: "Bölgedeki şehirler.",
      placeSuffix: "GEZİLECEK YER",
      fallbackCity: "Şehir"
    },
    en: {
      discoverTitle: "Explore",
      countryDesc: "Explore the most popular cities in this country.",
      regionDesc: "Cities in this region.",
      placeSuffix: "PLACES TO VISIT",
      fallbackCity: "City"
    }
  }[lang as "tr" | "en"];

  const countryCities = useMemo(() => {
    return Object.entries(dataSource)
      .map(([cityKey, places]: [string, any]) => {
        if (!places?.length) return null;

        const citySlug = slugify(cityKey);
        
        // Görselleri prop olarak gelen 'images' içinden çekiyoruz
        const regionImages = images[cityKey] || images[citySlug] || {};

        const firstPlace = places[0];
        const imageKey = `${citySlug}-${slugify(firstPlace.slug)}`;

        const coverImage =
          regionImages[imageKey]?.[0] ||
          regionImages[firstPlace.slug]?.[0];

        return {
          name: formatCityName(cityKey, lang),
          slug: citySlug,
          placeCount: places.length,
          coverImage
        };
      })
      .filter(Boolean);
  }, [dataSource, images]);

  const getLocalizedLink = (path: string) =>
    lang === "tr"
      ? path
      : `/${lang}${path.startsWith("/") ? path : `/${path}`}`;

      const regionNameMap: Record<string, { tr: string; en: string }> = {
  turkiye: { tr: "Türkiye", en: "Turkey" },
  amerika: { tr: "Amerika", en: "USA" },
  fransa: { tr: "Fransa", en: "France" },
};

const regionTitle =
  regionNameMap[region]?.[lang as "tr" | "en"] || formatCityName(region, lang);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans">
      
   {/* HEADER */}
<div className="mb-12">

  {/* BREADCRUMB */}
  <div className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2">
    {t.discoverTitle.toUpperCase()} / {regionTitle}
  </div>

  {/* TITLE */}
  <h1 className="text-5xl font-black text-gray-900">
    {regionTitle}
  </h1>

  {/* DESCRIPTION */}
  <p className="text-gray-500 mt-3 text-lg font-medium">
    {lang === "tr"
      ? `${regionTitle}’i keşfedin. Bu ülkedeki en popüler yerleri keşfedin.`
      : `Explore ${regionTitle}. Discover the most popular places in this country.`}
  </p>

</div>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {countryCities.map((city: any, index: number) => (
          <Link
            key={city.slug}
            href={getLocalizedLink(`/kesfet/${region}/${city.slug}`)}
            prefetch={false}
            onClick={() =>
              trackClick("city", city.name, `/kesfet/${region}/${city.slug}`)
            }
            className="group relative h-96 w-full overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-200 block"
          >
            {city.coverImage ? (
              <img
                src={getCloudinaryUrl(city.coverImage, 600)}
                alt={`${city.name} ${t.fallbackCity}`}
                loading={index < 3 ? "eager" : "lazy"}
                fetchPriority={index < 3 ? "high" : "low"}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 animate-pulse" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-white text-3xl font-black mb-1">
                {city.name}
              </h3>
              <p className="text-blue-400 font-extrabold tracking-widest text-xs uppercase">
                {city.placeCount} {t.placeSuffix}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}