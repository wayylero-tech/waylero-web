import { Suspense } from "react";
import KesfetClient from "./KesfetClient";

// SEO Meta Verileri
export const metadata = {
  title: "Dünyayı Keşfet | Popüler Ülke ve Şehir Rehberleri - Waylero",
  description: "Türkiye, Fransa, İtalya, Almanya ve daha fazlası... 2000'den fazla popüler noktayı keşfedin. Şehir rehberleri ve tarihi yerler.",
  alternates: {
    canonical: "https://www.waylero.com/kesfet",
  }
};

// Senin elindeki ülke listesi (Botlar bunları link olarak takip edecek)
const countries = [
  "turkiye", "fransa", "almanya", "italya", "ispanya", "ingiltere", "hollanda", 
  "avusturya", "yunanistan", "cek-cumhuriyeti", "rusya", "portekiz", "romanya", 
  "danimarka", "isvec", "norvec", "isvicre", "amerika", "japonya", "guney-kore"
];

export default async function KesfetPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  return (
    <div className="min-h-screen">
      {/* 🚀 SEO KATMANI: Botlar için ülke linklerini buraya gömüyoruz */}
      <div className="sr-only" aria-hidden="true">
        <h1>Waylero Keşfet - Ülke ve Şehir Rehberleri</h1>
        <p>Aşağıdaki ülkelerin en popüler şehirlerini ve gezilecek yerlerini keşfedin:</p>
        <nav>
          {countries.map(country => (
            <a key={country} href={`/kesfet/${country}`}>
              {country.replace("-", " ")} Gezilecek Yerler ve Gezi Rehberi
            </a>
          ))}
        </nav>
      </div>

      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-400">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="font-bold tracking-widest uppercase text-xs">Macera Hazırlanıyor...</p>
        </div>
      }>
        <KesfetClient initialQuery={query} />
      </Suspense>
    </div>
  );
}