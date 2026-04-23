"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLang } from "../../context/LanguageContext";
import { slugify } from "@/lib/utils/slugify";
import { Sparkles, MapPin, Globe, ChevronRight } from "lucide-react";

// ✅ Cloudinary Yapılandırması (Aynen Korundu)
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

interface RegionClientProps {
  region: string;
  lang: string;
  data: any;
  images: any;
}

const cityNameMapTR: Record<string, string> = {
  adana: "Adana", adiyaman: "Adıyaman", afyonkarahisar: "Afyonkarahisar",
  agri: "Ağrı", aksaray: "Aksaray", amasya: "Amasya", ankara: "Ankara",
  antalya: "Antalya", ardahan: "Ardahan", artvin: "Artvin", aydin: "Aydın",
  balikesir: "Balıkesir", bartin: "Bartın", batman: "Batman",
  bayburt: "Bayburt", bilecik: "Bilecik", bingol: "Bingöl",
  bitlis: "Bitlis", bolu: "Bolu", burdur: "Burdur", bursa: "Bursa",
  canakkale: "Çanakkale", cankiri: "Çankırı", corum: "Çorum", denizli: "Denizli",
  diyarbakir: "Diyarbakır", duzce: "Düzce", edirne: "Edirne", elazig: "Elazığ",
  erzincan: "Erzincan", erzurum: "Erzurum", eskisehir: "Eskişehir", gaziantep: "Gaziantep",
  giresun: "Giresun", gumushane: "Gümüşhane", hakkari: "Hakkari", hatay: "Hatay",
  igdir: "Iğdır", isparta: "Isparta", istanbul: "İstanbul", izmir: "İzmir",
  kahramanmaras: "Kahramanmaraş", karabuk: "Karabük", karaman: "Karaman", kars: "Kars",
  kastamonu: "Kastamonu", kayseri: "Kayseri", kirikkale: "Kırıkkale",
  kirsehir: "Kırşehir", kocaeli: "Kocaeli", konya: "Konya",
  kutahya: "Kütahya", malatya: "Malatya", manisa: "Manisa", mardin: "Mardin",
  mersin: "Mersin", mugla: "Muğla", mus: "Muş", nevsehir: "Nevşehir", nigde: "Niğde",
  ordu: "Ordu", osmaniye: "Osmaniye", rize: "Rize", sakarya: "Sakarya", samsun: "Samsun",
  sinop: "Sinop", sivas: "Sivas", sanliurfa: "Şanlıurfa", sirnak: "Şırnak",
  tekirdag: "Tekirdağ", tokat: "Tokat", trabzon: "Trabzon", tunceli: "Tunceli",
  usak: "Uşak", van: "Van", yalova: "Yalova", yozgat: "Yozgat", zonguldak: "Zonguldak"
};

const formatCityName = (name: string, lang: string) => {
  const normalized = name.replace(/-/g, " ").toLowerCase();
  if (lang === "tr") {
    const fixed = cityNameMapTR[normalized];
    if (fixed) return fixed;
    return normalized.replace(/\b\w/g, (l) => l.toUpperCase());
  }
  const english = normalized.replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
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
  const dataSource = data || {};

  const t = {
    tr: {
      discoverTitle: "Keşfet",
      badge: "POPÜLER ŞEHİRLER",
      placeSuffix: "GEZİLECEK YER",
      exploreText: "Hemen İncele"
    },
    en: {
      discoverTitle: "Explore",
      badge: "POPULAR CITIES",
      placeSuffix: "PLACES TO VISIT",
      exploreText: "Explore Now"
    }
  }[lang as "tr" | "en"];

  const countryCities = useMemo(() => {
    return Object.entries(dataSource)
      .map(([cityKey, places]: [string, any]) => {
        if (!places?.length) return null;
        const citySlug = slugify(cityKey);
        const regionImages = images[cityKey] || images[citySlug] || {};
        const firstPlace = places[0];
        const imageKey = `${citySlug}-${slugify(firstPlace.slug)}`;
        const coverImage = regionImages[imageKey]?.[0] || regionImages[firstPlace.slug]?.[0];

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
    lang === "tr" ? path : `/${lang}${path.startsWith("/") ? path : `/${path}`}`;

  const regionNameMap: Record<string, { tr: string; en: string }> = {
    turkiye: { tr: "Türkiye", en: "Turkey" },
    amerika: { tr: "Amerika", en: "USA" },
    fransa: { tr: "Fransa", en: "France" },
  };

  const regionTitle = regionNameMap[region]?.[lang as "tr" | "en"] || formatCityName(region, lang);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION: Diagonal Signature */}
      <section className="pt-24 pb-48 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-blue-100 shadow-sm">
            <Globe size={14} className="text-blue-500" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tight uppercase">
            {regionTitle}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            {lang === "tr"
              ? `${regionTitle}’i keşfedin. Bu ülkedeki en popüler yerleri keşfedin.`
              : `Explore ${regionTitle}. Discover the most popular places in this country.`}
          </p>
        </div>
      </section>

      {/* 2. CITY GRID: Modern Floating Cards */}
      <section className="container mx-auto px-6 -mt-24 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {countryCities.map((city: any, index: number) => (
            <Link
              key={city.slug}
              href={getLocalizedLink(`/kesfet/${region}/${city.slug}`)}
              prefetch={false}
              onClick={() => trackClick("city", city.name, `/kesfet/${region}/${city.slug}`)}
              className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 transform hover:-translate-y-3"
            >
              {/* IMAGE AREA */}
              <div className="relative aspect-[4/5] overflow-hidden">
                {city.coverImage ? (
                  <img
                    src={getCloudinaryUrl(city.coverImage, 600)}
                    alt={`${city.name}`}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center animate-pulse">
                    <MapPin size={40} className="text-gray-200" />
                  </div>
                )}
                
                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                
                {/* TOP BADGE: Place Count */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm border border-white">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      {city.placeCount} {t.placeSuffix}
                    </span>
                  </div>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 drop-shadow-sm">
                  {t.discoverTitle}
                </p>
                <h3 className="text-4xl font-serif font-bold text-white tracking-tight mb-4 group-hover:text-blue-200 transition-colors">
                  {city.name}
                </h3>
                
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{t.exploreText}</span>
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl transform group-hover:rotate-[360deg] transition-all duration-700">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. DECORATIVE FOOTER */}
      <footer className="container mx-auto px-6 pb-20">
        <div className="bg-gray-50 rounded-[3rem] p-16 text-center border border-gray-100">
          <Sparkles size={32} className="mx-auto text-orange-400 mb-6" />
          <h4 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            {lang === "tr" ? "Yeni Şehirler Yolda" : "New Cities Coming Soon"}
          </h4>
          <p className="text-gray-400 text-sm max-w-xs mx-auto uppercase tracking-widest font-bold">
            Waylero Editörleri Sizin İçin Geziyor
          </p>
        </div>
      </footer>
    </main>
  );
}