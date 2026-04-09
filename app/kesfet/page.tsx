import { Suspense } from "react";
import KesfetClient from "./KesfetClient";

// Veri importları (Server-side'da kalır, client bundle'ı şişirmez)
import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";
import turkeyImages from "../data/images/turkey.json";
import europaImages from "../data/images/europa.json";
import asiaImages from "../data/images/asia.json";

export default function KesfetPage() {
  // Veri haritaları
  const allDataMap: any = { turkey, europa, asia };
  const allImages: any = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };

  // Veriyi sunucuda tek seferde düzleştiriyoruz
  // Not: JSON'lar boş gelirse patlamaması için Object.entries öncesi kontrol ekledik
  const masterData = Object.entries(allDataMap).flatMap(([region, cities]: [string, any]) => {
    if (!cities) return [];
    
    return Object.entries(cities).flatMap(([citySlug, places]: [string, any]) => {
      if (!Array.isArray(places)) return [];

      return places.map((place: any) => {
        // Senin özel schema yapın: "sehir-sehir-mekan"
        const targetImageKey = `${citySlug}-${place.slug}`;
        
        return {
          region,
          citySlug,
          place,
          // Görseli burada hazır edip client'a pişmiş veri gönderiyoruz
          coverImage: allImages[region]?.[citySlug]?.[targetImageKey]?.[0] || null
        };
      });
    });
  });

  return (
    // Fallback kısmı hydration sırasında kullanıcıya gösterilir
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    }>
      {/* ÖNEMLİ: Eğer masterData undefined dönerse client .slice() hatası vermesin diye 
        burada da bir fallback (masterData || []) geçiyoruz.
      */}
      <KesfetClient initialData={masterData || []} />
    </Suspense>
  );
}