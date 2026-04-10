import { Suspense } from "react";
import { headers } from "next/headers";
import KesfetClient from "./KesfetClient";

// Ülke listesi (Sluglar sabit)
const countries = [
  "turkiye",
  "fransa",
  "almanya",
  "italya",
  "ispanya",
  "ingiltere",
  "hollanda",
  "avusturya",
  "yunanistan",
  "cek-cumhuriyeti",
  "rusya",
  "portekiz",
  "romanya",
  "danimarka",
  "isvec",
  "norvec",
  "isvicre",
  "amerika",
  "japonya",
  "guney-kore",

  // ➕ eksik olanlar (map’te var ama listede yoktu)
  "kktc",
  "urdun",
  "endonezya",
  "irlanda",
  "bosna-hersek",
  "avustralya",
  "gurcistan",
  "iskocya",
  "galler",
  "malezya",
  "cin",
  "hindistan",
  "tayland",
  "sri-lanka",
  "singapur",
  "umman",
  "suudi-arabistan",
  "misir",
  "belarus",
  "tayland",
];

// Dinamik SEO ayarları
export async function generateMetadata() {
  const headerList = await headers();
  const lang = headerList.get('x-url-lang') || 'tr';
  const isEn = lang === 'en';

  return {
    title: isEn 
      ? "Explore the World | Popular Country & City Guides - Waylero" 
      : "Dünyayı Keşfet | Popüler Ülke ve Şehir Rehberleri - Waylero",
    description: isEn 
      ? "Explore Turkey, France, Italy, Germany and more... Discover over 2000+ popular destinations." 
      : "Türkiye, Fransa, İtalya, Almanya ve daha fazlası... 2000'den fazla popüler noktayı keşfedin.",
    alternates: {
      canonical: isEn ? "https://www.waylero.com/en/kesfet" : "https://www.waylero.com/kesfet",
      languages: {
        "tr-TR": "https://www.waylero.com/kesfet",
        "en-US": "https://www.waylero.com/en/kesfet",
      },
    },
  };
}

export default async function KesfetPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  
  // Middleware'in set ettiği dili okuyoruz
  const headerList = await headers();
  const lang = headerList.get('x-url-lang') || 'tr';
  const isEn = lang === 'en';
  const langPath = isEn ? "/en" : "";

  return (
    <div className="min-h-screen">
      {/* 🚀 SEO KATMANI: Dile göre içerik değişiyor ama sluglar aynı kalıyor */}
      <div className="sr-only" aria-hidden="true">
        <h1>{isEn ? "Waylero Explore - Country & City Guides" : "Waylero Keşfet - Ülke ve Şehir Rehberleri"}</h1>
        <p>{isEn ? "Explore travel guides for the following countries:" : "Aşağıdaki ülkelerin gezi rehberlerini keşfedin:"}</p>
        <nav>
          {countries.map(country => (
            <a key={country} href={`${langPath}/kesfet/${country}`}>
              {country.replace("-", " ")} {isEn ? "Travel Guide & Places to Visit" : "Gezilecek Yerler ve Gezi Rehberi"}
            </a>
          ))}
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