import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import PlaceSlider from "./PlaceSlider";

// Data importları
import turkey from "../../../../data/turkey.json";
import europa from "../../../../data/europa.json";
import asia from "../../../../data/asia.json";

import turkeyImages from "../../../../data/images/turkey.json";
import europaImages from "../../../../data/images/europa.json";
import asiaImages from "../../../../data/images/asia.json";

const allData: any = { turkey, europa, asia };
const allImages: any = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };

const countryToRegionMap: Record<string, string> = {
  turkiye: "turkey", fransa: "europa", almanya: "europa", italya: "europa", 
  ispanya: "europa", ingiltere: "europa", hollanda: "europa", belcika: "europa", 
  avusturya: "europa", yunanistan: "europa", "cek-cumhuriyeti": "europa", 
  macaristan: "europa", portekiz: "europa", romanya: "europa", danimarka: "europa", 
  isvec: "europa", norvec: "europa", isvicre: "europa", slovakya: "europa", 
  finlandiya: "europa", irlanda: "europa", "bosna-hersek": "europa", 
  gurcistan: "europa", balerus: "europa", iskocya: "europa", galler: "europa", 
  cin: "asia", hindistan: "asia", tayland: "europa", "guney-kore": "europa", 
  bae: "europa", rusya: "europa", malezya: "europa", endonezya: "europa", 
  japonya: "asia", "sri-lanka": "asia", misir: "europa", "suudi-arabistan": "europa", 
  umman: "europa", amerika: "europa", peru: "europa", avustralya: "europa", 
  filipinler: "europa", kktc: "europa", singapur: "europa",
};

const slugify = (text: string) => {
  if (!text) return "";
  const trMap: any = { ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u" };
  return text.toString().toLowerCase().replace(/[çğışüö]/g, (m) => trMap[m]).trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-");
};

type Props = { params: Promise<{ region: string; city: string; place: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, city, place } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en" | "de";

  const mainRegion = countryToRegionMap[region] || region;
  const regionData = allData[mainRegion];
  if (!regionData) return {};

  const cityKey = Object.keys(regionData).find(key => slugify(key) === slugify(decodeURIComponent(city)));
  if (!cityKey) return {};

  const foundPlace = regionData[cityKey].find((p: any) => slugify(p.slug) === slugify(decodeURIComponent(place)));
  if (!foundPlace) return {};

  // 🔥 SEO İÇİN KRİTİK: Dinamik Linkleri Oluşturuyoruz
  const baseUrl = "https://www.waylero.com";
  // region, city ve place zaten url'den geliyor, onları kullanarak yolları oluşturuyoruz
  const trPath = `/kesfet/${region}/${city}/${place}`;
  const enPath = `/en/kesfet/${region}/${city}/${place}`;

  return {
    title: `${foundPlace.name?.[lang] || foundPlace.name?.tr} | Waylero`,
    description: (foundPlace.description?.[lang] || foundPlace.description?.tr)?.slice(0, 155),
    
    // 🔥 Google'a "İkiz Sayfaları" Bildiriyoruz
    alternates: {
      canonical: `${baseUrl}${trPath}`,
      languages: {
        "tr-TR": `${baseUrl}${trPath}`,
        "en-US": `${baseUrl}${enPath}`,
      },
    },
  };
}

export default async function Page({ params }: Props) {
  const { region, city, place } = await params;
  
  const cookieStore = await cookies();
  // 🔥 de desteğini de ekledik
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en" | "de";

  const t = {
    tr: { about: "Mekan Hakkında", todo: "Neler Yapılır?", location: "Konum", noPhoto: "Bu mekan için henüz fotoğraf eklenmemiş." },
    en: { about: "About the Place", todo: "Things to Do", location: "Location", noPhoto: "No photos added for this place yet." },
    de: { about: "Über den Ort", todo: "Was man tun kann", location: "Standort", noPhoto: "Für diesen Ort wurden noch keine Fotos hinzugefügt." }
  }[lang];

  const mainRegion = countryToRegionMap[region] || region;
  const regionData = allData[mainRegion];
  if (!regionData) return notFound();

  const cityKey = Object.keys(regionData).find(key => slugify(key) === slugify(decodeURIComponent(city)));
  if (!cityKey) return notFound();

  const foundPlace = regionData[cityKey].find((p: any) => slugify(p.slug) === slugify(decodeURIComponent(place)));
  if (!foundPlace) return notFound();

  // 🔥 JSON Yapına Tam Uyumlu Çekim (Nested Object Access)
  const displayName = foundPlace.name?.[lang] || foundPlace.name?.tr;
  const displayDesc = foundPlace.description?.[lang] || foundPlace.description?.tr;
  const displayActivities = foundPlace.activities?.[lang] || foundPlace.activities?.tr || [];

  const targetImageKey = `${slugify(cityKey)}-${slugify(foundPlace.slug)}`;
  const regionImages = allImages[mainRegion] || {};
  const cityGroup = regionImages[cityKey] || regionImages[slugify(cityKey)];
  const placeImages = cityGroup?.[targetImageKey] || cityGroup?.[foundPlace.slug] || [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header className="border-b pb-8">
        <nav className="text-sm text-gray-400 uppercase mb-2">
          {region} / <span className="text-blue-500 font-bold">{cityKey}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
          {displayName}
        </h1>
      </header>

      <section>
        {placeImages.length > 0 ? (
          <PlaceSlider images={placeImages} title={displayName} />
        ) : (
          <div className="h-[400px] w-full rounded-[2.5rem] bg-gray-50 border-2 border-dashed flex flex-col items-center justify-center text-gray-400">
            <span className="text-5xl mb-4">📸</span>
            <p className="font-medium">{t.noPhoto}</p>
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-[2rem] border p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>📖</span> {t.about}
          </h2>
          <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
            {displayDesc}
          </div>
        </div>

        <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 h-fit sticky top-10">
          <h2 className="text-xl font-bold mb-6 text-blue-900 flex items-center gap-2">
            <span>🎯</span> {t.todo}
          </h2>
          <ul className="space-y-4">
            {displayActivities.map((act: string, i: number) => (
              <li key={i} className="bg-white p-4 rounded-2xl text-blue-800 text-sm font-bold shadow-sm border border-blue-50 hover:scale-105 transition-transform cursor-default">
                • {act}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {foundPlace.latitude && foundPlace.longitude && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold px-2 text-gray-800 flex items-center gap-2">
            <span>📍</span> {t.location}
          </h2>
          <div className="rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl h-[500px]">
            <iframe
              src={`https://maps.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&z=15&output=embed`}
              width="100%" height="100%" style={{ border: 0 }} loading="lazy"
            />
          </div>
        </section>
      )}
    </main>
  );
}