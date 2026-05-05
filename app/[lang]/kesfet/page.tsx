import { Suspense } from "react";
import KesfetClient from "./KesfetClient";
import { Metadata } from "next";


export const revalidate = 86400; // 24 saat ISR
export const dynamic = "force-static";


// Ülke isimleri sözlüğü
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
  "kktc": { tr: "KKTC", en: "Northern Cyprus" },
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
  "bae": { tr: "BAE", en: "UAE" },
  "peru": { tr: "Peru", en: "Peru" },
};

const BASE_URL = "https://www.waylero.com";

type Props = {
  params: Promise<{ lang: string }>;
};

// ✅ METADATA (SEO FULL)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";
  const isEn = lang === "en";

  const title = isEn
    ? "Explore Countries & Cities Worldwide | Waylero"
    : "Ülkeleri ve Şehirleri Keşfet | Waylero";

  const description = isEn
    ? "Discover top destinations, cities and travel guides worldwide with Waylero."
    : "Dünyadaki en popüler ülke ve şehirleri Waylero ile keşfet.";

  const url = `${BASE_URL}/${lang}/kesfet`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/kesfet`,
        "en-US": `${BASE_URL}/en/kesfet`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      locale: isEn ? "en_US" : "tr_TR",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og/kesfet.jpg`,
          width: 1200,
          height: 630,
          alt: "Waylero Explore",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og/kesfet.jpg`],
    },
  };
}

// ✅ PAGE
export default async function KesfetPage({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";

  return (
    <div className="min-h-screen">
      {/* SEO H1 + Internal Links */}
      <div className="sr-only">
        <h1>{lang === "en" ? "Explore the World" : "Dünyayı Keşfet"}</h1>

        <nav>
          {Object.entries(countryNames).map(([slug, names]) => (
            <a key={slug} href={`/${lang}/kesfet/${slug}`}>
              {lang === "en" ? names.en : names.tr}
            </a>
          ))}
        </nav>
      </div>

      {/* CONTENT */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-bold animate-pulse">
            {lang === "en" ? "LOADING..." : "YÜKLENİYOR..."}
          </div>
        }
      >
        <KesfetClient lang={lang} />
      </Suspense>
    </div>
  );
}