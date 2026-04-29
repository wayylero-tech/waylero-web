import { Suspense } from "react";
import { headers } from "next/headers";
import KesfetClient from "./KesfetClient";
import { Metadata } from "next";

// Ülke isimleri sözlüğü - SEO için İngilizce sayfada İngilizce isimler şart kanka
const countryNames: Record<string, { tr: string; en: string }> = {
  "turkiye": { tr: "Türkiye", en: "Turkey" },
  "fransa": { tr: "Fransa", en: "France" },
  "almanya": { tr: "Almanya", en: "Germany" },
  "italya": { tr: "İtalya", en: "Italy" },
  "ispanya": { tr: "İspanya", en: "Spain" },
  "ingiltere": { tr: "İngiltere", en: "United Kingdom" },
  "hollanda": { tr: "Hollanda", en: "Netherlands" },
  "avusturya": { tr: "Avusturya", en: "Austria" },
  "yunanistan": { tr: "Yunanistan", en: "Greece" },
  "cek-cumhuriyeti": { tr: "Çek Cumhuriyeti", en: "Czech Republic" },
  "rusya": { tr: "Rusya", en: "Russia" },
  "portekiz": { tr: "Portekiz", en: "Portugal" },
  "romanya": { tr: "Romanya", en: "Romania" },
  "danimarka": { tr: "Danimarka", en: "Denmark" },
  "isvec": { tr: "İsveç", en: "Sweden" },
  "norvec": { tr: "Norveç", en: "Norway" },
  "isvicre": { tr: "İsviçre", en: "Switzerland" },
  "amerika": { tr: "Amerika", en: "United States" },
  "japonya": { tr: "Japonya", en: "Japan" },
  "guney-kore": { tr: "Güney Kore", en: "South Korea" },
  "kktc": { tr: "KKTC", en: "TRNC" },
  "urdun": { tr: "Ürdün", en: "Jordan" },
  "endonezya": { tr: "Endonezya", en: "Indonesia" },
  "irlanda": { tr: "İrlanda", en: "Ireland" },
  "bosna-hersek": { tr: "Bosna Hersek", en: "Bosnia and Herzegovina" },
  "avustralya": { tr: "Avustralya", en: "Australia" },
  "gurcistan": { tr: "Gürcistan", en: "Georgia" },
  "iskocya": { tr: "İskoçya", en: "Scotland" },
  "galler": { tr: "Galler", en: "Wales" },
  "malezya": { tr: "Malezya", en: "Malaysia" },
  "cin": { tr: "Çin", en: "China" },
  "hindistan": { tr: "Hindistan", en: "India" },
  "tayland": { tr: "Tayland", en: "Thailand" },
  "sri-lanka": { tr: "Sri Lanka", en: "Sri Lanka" },
  "singapur": { tr: "Singapur", en: "Singapore" },
  "umman": { tr: "Umman", en: "Oman" },
  "suudi-arabistan": { tr: "Suudi Arabistan", en: "Saudi Arabia" },
  "misir": { tr: "Mısır", en: "Egypt" },
  "belarus": { tr: "Belarus", en: "Belarus" },
  " bae": { tr: "BAE", en: "UAE" },
"peru": { tr: "Peru", en: "Peru" },
};

const countries = Object.keys(countryNames);

// Dinamik SEO ayarları


const BASE_URL = "https://www.waylero.com";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") || "tr";
  const isEn = lang === "en";

  const t = {
    tr: {
      title: "Dünyayı Keşfet | Popüler Ülke ve Şehir Rehberleri - Waylero",
      desc: "Türkiye, Fransa, İtalya, Almanya ve daha fazlası... 2000'den fazla popüler noktayı Waylero ile keşfedin.",
    },
    en: {
      title: "Explore the World | Popular Country & City Guides - Waylero",
      desc: "Explore Turkey, France, Italy, Germany and more... Discover over 2000+ popular destinations with Waylero.",
    },
  }[isEn ? "en" : "tr"];

  const canonical = isEn ? `${BASE_URL}/en/kesfet` : `${BASE_URL}/kesfet`;

  return {
    title: t.title,
    description: t.desc,

    // 🔥 SEO: Canonical & Hreflang
    alternates: {
      canonical,
      languages: {
        "tr-TR": `${BASE_URL}/kesfet`,
        "en-US": `${BASE_URL}/en/kesfet`,
      },
    },

    // 🔥 OPEN GRAPH (WhatsApp, Facebook, LinkedIn için "Zengin Önizleme")
    openGraph: {
      title: t.title,
      description: t.desc,
      url: canonical,
      siteName: "Waylero",
      type: "website",
      locale: isEn ? "en_US" : "tr_TR",
      images: [
        {
          url: `${BASE_URL}/og-image-explore.jpg`, // Buraya güzel bir kapak görseli koymalısın
          width: 1200,
          height: 630,
          alt: "Waylero Discovery",
        },
      ],
    },

    // 🔥 TWITTER CARD (Twitter paylaşımları için "Büyük Görsel" formatı)
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.desc,
      site: "@waylero", // Varsa Twitter hesabın
      images: [`${BASE_URL}/og-image-explore.jpg`],
    },

    // 🔥 ROBOTS (Arama motorlarına "bu sayfayı dizine ekle" emri)
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function KesfetPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  
  const headerList = await headers();
  const lang = headerList.get('x-url-lang') || 'tr';
  const isEn = lang === 'en';
  const langPath = isEn ? "/en" : "";

  return (
    <div className="min-h-screen">
      {/* 🚀 SEO KATMANI: Artık hem başlıklar hem ülke isimleri dile duyarlı */}
      <div className="sr-only" aria-hidden="true">
        <h1>{isEn ? "Waylero Explore - Country & City Guides" : "Waylero Keşfet - Ülke ve Şehir Rehberleri"}</h1>
        <p>{isEn ? "Explore travel guides for the following countries:" : "Aşağıdaki ülkelerin gezi rehberlerini keşfedin:"}</p>
        <nav>
          {countries.map(country => {
            const name = countryNames[country][isEn ? 'en' : 'tr'];
            return (
              <a key={country} href={`${langPath}/kesfet/${country}`}>
                {name} {isEn ? "Travel Guide & Places to Visit" : "Gezilecek Yerler ve Gezi Rehberi"}
              </a>
            );
          })}
        </nav>
      </div>

      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-400">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="font-bold tracking-widest uppercase text-xs">
             {isEn ? "Preparing Adventure..." : "Macera Hazırlanıyor..."}
           </p>
        </div>
      }>
        <KesfetClient initialQuery={query} lang={lang} />
      </Suspense>
    </div>
  );
}
