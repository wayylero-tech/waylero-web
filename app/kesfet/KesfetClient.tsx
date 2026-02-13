"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Verileri import ediyoruz
import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";
import turkeyImages from "../data/images/turkey.json";
import europaImages from "../data/images/europa.json";
import asiaImages from "../data/images/asia.json";

// JSON'daki "bursa-cumalikizik-koyu" formatına tam uyması için karakter temizleyici
const slugifyForImages = (text: string) => {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  return text
    .toString()
    .replace(/[çğışüöÇĞİŞÜÖ]/g, (match) => trMap[match])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") 
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

export default function KesfetClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [search, setSearch] = useState(q);

  useEffect(() => setSearch(q), [q]);

  // JSON import temizliği
  const cleanJSON = (data: any) => (data?.default ? data.default : data);

  const allData = { 
    turkey: cleanJSON(turkey), 
    europa: cleanJSON(europa), 
    asia: cleanJSON(asia) 
  };

  const allImages: any = {
    turkey: cleanJSON(turkeyImages),
    europa: cleanJSON(europaImages),
    asia: cleanJSON(asiaImages)
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 font-sans">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Keşfet</h1>

      <div className="mb-10">
        <input
          type="text"
          placeholder="Şehir veya mekan ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none shadow-sm text-lg"
        />
      </div>

      {Object.entries(allData).map(([region, cities]: [string, any]) =>
        Object.entries(cities).map(([citySlug, places]: [string, any]) => {
          
          const filteredPlaces = places.filter((place: any) => {
            const searchLower = search.toLowerCase();
            return search === "" || 
                   citySlug.toLowerCase().includes(searchLower) || 
                   place.name.tr.toLowerCase().includes(searchLower);
          });

          if (filteredPlaces.length === 0) return null;

          return (
            <section key={citySlug} className="mb-12">
              <h2 className="text-xl font-bold mb-6 text-gray-800 capitalize">
                {citySlug.replace(/-/g, " ")}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {filteredPlaces.map((place: any) => {
  const cKey = slugifyForImages(citySlug);
  const pKey = slugifyForImages(place.slug);
  const targetImageKey = pKey.startsWith(cKey) ? pKey : `${cKey}-${pKey}`;

  const regionImages = allImages[region] || {};
  const cityGroup = regionImages[cKey];
  const imagesArray = cityGroup
    ? cityGroup[targetImageKey] || []
    : regionImages[targetImageKey] || [];

  const coverImage = imagesArray.length > 0 ? imagesArray[0] : null;

  return (
    <Link
  key={place.slug}
  href={`/kesfet/${region}/${citySlug}/${place.slug}`}
  target="_blank"
  rel="noopener noreferrer"
  className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all"
>

      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={place.name.tr}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2 text-center text-gray-400">
            <span className="text-2xl mb-1">📸</span>
            <span className="text-[10px] font-mono">{targetImageKey}</span>
          </div>
        )}
      </div>

      <div className="p-4 font-bold text-gray-800 line-clamp-2">
        {place.name.tr}
      </div>
    </Link>
  );
})}

              </div>
            </section>
          );
        })
      )}
    </main>
  );
}