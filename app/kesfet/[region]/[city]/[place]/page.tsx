import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlaceSlider from "./PlaceSlider";

// Data importları
import turkey from "../../../../data/turkey.json";
import europa from "../../../../data/europa.json";
import asia from "../../../../data/asia.json";
import turkeyImages from "../../../../data/images/turkey.json";
import europaImages from "../../../../data/images/europa.json";
import asiaImages from "../../../../data/images/asia.json";

export const dynamic = "force-static";
export const revalidate = false;

const allData: any = { turkey, europa, asia };
const allImages: any = {
  turkey: turkeyImages,
  europa: europaImages,
  asia: asiaImages,
};

// Geliştirilmiş slugify (Türkçe karakterler için tam destek)
const slugify = (text: string) => {
  if (!text) return "";
  const trMap: any = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text.toString()
    .replace(/[çğışüöÇĞİŞÜÖ]/g, (m) => trMap[m])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");
};

type Props = {
  params: Promise<{ region: string; city: string; place: string }>;
};

// ==========================
// 🔥 SEO METADATA
// ==========================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, city, place } = await params;
  const cityParam = slugify(decodeURIComponent(city));
  const placeParam = slugify(decodeURIComponent(place));

  const regionData = allData[region];
  if (!regionData) return {};

  const cityKey = Object.keys(regionData).find(key => slugify(key) === cityParam);
  if (!cityKey) return {};

  const foundPlace = regionData[cityKey].find((p: any) => slugify(p.slug) === placeParam);
  if (!foundPlace) return {};

  const title = `${foundPlace.name?.tr} (${cityKey}) | Gezi Rehberi | Waylero`;
  return { title, description: foundPlace.description?.tr?.slice(0, 155) };
}

// ==========================
// 🔥 PAGE
// ==========================
export default async function Page({ params }: Props) {
  const { region, city, place } = await params;
  const regionData = allData[region];
  if (!regionData) return notFound();

  const cityParam = slugify(decodeURIComponent(city));
  const placeParam = slugify(decodeURIComponent(place));

  // Doğru şehir anahtarını bul (Örn: "Şanlıurfa")
  const cityKey = Object.keys(regionData).find(key => slugify(key) === cityParam);
  if (!cityKey) return notFound();

  // Mekanı bul
  const foundPlace = regionData[cityKey].find((p: any) => slugify(p.slug) === placeParam);
  if (!foundPlace) return notFound();

  // --- RESİM BULMA MANTIĞI (GÜNCELLENDİ) ---
  const citySlugKey = slugify(cityKey);
  const placeSlugKey = slugify(foundPlace.slug);
  const targetImageKey = `${citySlugKey}-${placeSlugKey}`;

  // Resim dosyasında hem orijinal key'e hem slug key'e bakıyoruz
  const regionImages = allImages[region] || {};
  const cityGroup = regionImages[cityKey] || regionImages[citySlugKey];
  
  const placeImages = cityGroup?.[targetImageKey] || cityGroup?.[placeSlugKey] || [];

  // ==========================
  // 🔥 SCHEMA
  // ==========================
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: foundPlace.name?.tr,
    description: foundPlace.description?.tr,
    address: { "@type": "PostalAddress", addressLocality: cityKey, addressCountry: "TR" }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header className="border-b pb-8">
        <nav className="text-sm text-gray-400 uppercase mb-2">
          {region} / <span className="text-blue-500 font-bold">{cityKey}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900">
          {foundPlace.name?.tr}
        </h1>
      </header>

      <section>
        {placeImages && placeImages.length > 0 ? (
          <PlaceSlider images={placeImages} title={foundPlace.name?.tr} />
        ) : (
          /* Resim yoksa tasarımın çökmemesi için düzgün bir placeholder */
          <div className="h-[400px] w-full rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shadow-inner">
             <span className="text-5xl mb-4">📸</span>
             <p className="font-semibold text-lg">Bu mekan için henüz fotoğraf eklenmemiş.</p>
             <p className="text-sm opacity-60 mt-1">Key: {targetImageKey}</p>
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-[2rem] border p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📖</span> Mekan Hakkında
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {foundPlace.description?.tr}
          </p>
        </div>

        <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 h-fit">
          <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
            <span>🎯</span> Neler Yapılır?
          </h2>
          <ul className="space-y-3">
            {foundPlace.activities?.tr?.map((act: string, i: number) => (
              <li key={i} className="bg-white p-3 rounded-xl text-blue-800 text-sm font-semibold shadow-sm border border-blue-100/50">
                • {act}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {foundPlace.latitude && foundPlace.longitude && (
        <section className="space-y-4">
           <h2 className="text-xl font-bold px-2 text-gray-800">📍 Konum</h2>
           <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl h-[450px]">
            <iframe
                src={`https://maps.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
            />
           </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}