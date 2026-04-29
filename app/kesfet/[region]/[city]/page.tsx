import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";
import { slugify } from "@/lib/utils/slugify";
import { Sparkles, MapPin, ChevronRight, Globe2 } from "lucide-react";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

interface Props {
  params: Promise<{ region: string; city: string }>;
}

async function getLanguage() {
  const headerList = await headers();
  const currentPath = headerList.get("x-url") || "";
  const middlewareLang = headerList.get("x-url-lang");
  if (middlewareLang === "en" || currentPath.includes("/en/")) return "en";
  return "tr";
}

const BASE_URL = "https://www.waylero.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const lang = await getLanguage();

  const cityName = city
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const t = {
    tr: {
      title: `${cityName} Gezilecek Yerler`,
      desc: `${cityName} için en iyi gezi rehberi ve keşfedilecek yerler.`,
    },
    en: {
      title: `Places to Visit in ${cityName}`,
      desc: `Discover the best travel guide and attractions in ${cityName}.`,
    },
  }[lang];

  const isEn = lang === "en";

  const canonical = `${BASE_URL}${isEn ? "/en" : ""}/kesfet/${city}`;

  return {
    title: `${t.title} | Waylero`,
    description: t.desc,

    // 🔥 CANONICAL + HREFLANG
    alternates: {
      canonical,
      languages: {
        tr: `${BASE_URL}/kesfet/${city}`,
        en: `${BASE_URL}/en/kesfet/${city}`,
      },
    },

    // 🔥 OPEN GRAPH (WhatsApp, Facebook, LinkedIn)
    openGraph: {
      title: t.title,
      description: t.desc,
      url: canonical,
      siteName: "Waylero",
      type: "website",
      locale: isEn ? "en_US" : "tr_TR",
    },

    // 🔥 TWITTER CARD
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.desc,
    },

    // 🔥 INDEX CONTROL
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { region, city } = await params;
  const lang = await getLanguage();

  const cityFilePath = path.join(process.cwd(), "app/data/ulkelerdata", region, `${city}.json`);
  if (!fs.existsSync(cityFilePath)) notFound();
  const cityPlaces = JSON.parse(fs.readFileSync(cityFilePath, "utf-8"));

  const imagesPath = path.join(process.cwd(), "app/data/ulkedataimages", `${region}.json`);
  let images: any = {};
  if (fs.existsSync(imagesPath)) images = JSON.parse(fs.readFileSync(imagesPath, "utf-8"));

  const actualCityKey = cityPlaces?.[0]?.cityName || city.replace(/-/g, " ");
  const cityImages = images[city] || images[slugify(city)] || {};

  const t = {
    tr: {
      badge: "KEŞİF ROTASI",
      suffix2: "farklı deneyim sizi bekliyor.",
      fallbackName: "Gezilecek Yer",
      exploreBtn: "Detayları Gör"
    },
    en: {
      badge: "EXPLORE ROUTE",
      suffix2: "amazing spots to discover.",
      fallbackName: "Place",
      exploreBtn: "View Details"
    }
  }[lang];

  const getLocalizedLink = (path: string) => lang === "tr" ? path : `/en${path}`;
  const exploreBase = lang === "tr" ? "/kesfet" : "/en/kesfet";

  const cityNames: Record<string, { tr: string; en: string }> = {
    istanbul: { tr: "İstanbul", en: "Istanbul" },
    ankara: { tr: "Ankara", en: "Ankara" },
    // ... diğer şehir eşleşmeleri
  };

  const cityLabel = cityNames[slugify(city)]?.[lang] || actualCityKey;
  const regionLabel = cityNames[slugify(region)]?.[lang] || region.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION: Waylero Signature Diagonal */}
      <section className="pt-24 pb-48 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          
          {/* BREADCRUMB: Modern Pill Style */}
          <nav className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/80 backdrop-blur-md rounded-full mb-10 border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href={exploreBase} className="hover:text-blue-600 transition-colors">
              {lang === "tr" ? "KEŞFET" : "EXPLORE"}
            </Link>
            <ChevronRight size={12} />
            <Link href={`${exploreBase}/${region}`} className="hover:text-blue-600 transition-colors">
              {regionLabel}
            </Link>
            <ChevronRight size={12} />
            <span className="text-blue-600">{cityLabel}</span>
          </nav>

          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-6 text-orange-600 bg-orange-50 px-4 py-1.5 rounded-xl border border-orange-100 shadow-sm">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.badge}</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tighter uppercase leading-none">
              {cityLabel}
            </h1>
            <p className="text-xl text-gray-500 font-medium italic opacity-80">
              {cityPlaces.length} {t.suffix2}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PLACES GRID: Modern Floating Cards */}
      <section className="container mx-auto px-6 -mt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {cityPlaces.map((place: any, index: number) => {
            const placeName = place.name?.[lang] || place.name?.tr || t.fallbackName;
            const imageKey = `${slugify(actualCityKey)}-${slugify(place.slug)}`;
            const coverImage = cityImages[imageKey]?.[0] || cityImages[place.slug]?.[0];

            return (
              <Link
                key={place.slug}
                href={getLocalizedLink(`/kesfet/${region}/${city}/${place.slug}`)}
                className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 transform hover:-translate-y-3"
              >
                {/* IMAGE AREA */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {coverImage ? (
                    <img
                      src={getCloudinaryUrl(coverImage, 600)}
                      alt={placeName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                      <MapPin size={48} className="text-gray-200" />
                    </div>
                  )}
                  
                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  
                
                </div>

                {/* CONTENT AREA */}
                <div className="absolute bottom-0 left-0 right-0 p-10 z-10">              
                  <h3 className="text-3xl font-serif font-bold text-white tracking-tight mb-4 group-hover:text-blue-200 transition-colors leading-tight">
                    {placeName}
                  </h3>
                  
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{t.exploreBtn}</span>
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl transform group-hover:rotate-[360deg] transition-all duration-700">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. DECORATIVE FOOTER */}
      <footer className="container mx-auto px-6 pb-24 text-center">
        <div className="max-w-4xl mx-auto py-20 bg-gray-900 rounded-[4rem] relative overflow-hidden">
          <div className="relative z-10">
            <Globe2 size={40} className="mx-auto text-blue-400 mb-6 animate-pulse" />
            <h2 className="text-3xl font-serif font-bold text-white mb-4 uppercase tracking-tighter">
              {lang === "tr" ? "Başka Rotalar Keşfet" : "Explore More Routes"}
            </h2>
            <Link 
              href={exploreBase}
              className="inline-block bg-white text-black px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
            >
              {lang === "tr" ? "Keşfet'e Dön" : "Back to Explore"}
            </Link>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2" />
        </div>
      </footer>
    </main>
  );
}
