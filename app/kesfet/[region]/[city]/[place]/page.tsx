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
    .replace(/[^\w-]/g, "");
};

type Props = {
  params: Promise<{ region: string; city: string; place: string }>;
};



// ==========================
// 🔥 SEO METADATA
// ==========================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  const region = resolvedParams.region;
  const cityParam = slugify(decodeURIComponent(resolvedParams.city));
  const placeParam = slugify(decodeURIComponent(resolvedParams.place));

  const regionData = allData[region];
  if (!regionData) return {};

  const cityKey = Object.keys(regionData).find(
    (key) => slugify(key) === cityParam
  );
  if (!cityKey) return {};

  const foundPlace = regionData[cityKey].find(
    (p: any) => slugify(p.slug) === placeParam
  );
  if (!foundPlace) return {};

  const title = `${foundPlace.name?.tr} (${cityKey}) | Gezi Rehberi | Waylero`;

  const description =
    foundPlace.description?.tr?.slice(0, 155) ||
    `${foundPlace.name?.tr}, ${cityKey} şehrinde bulunan popüler bir gezi noktasıdır.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://waylero.com/kesfet/${region}/${cityParam}/${placeParam}`,
    },
    openGraph: {
      title,
      description,
      url: `https://waylero.com/kesfet/${region}/${cityParam}/${placeParam}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}



// ==========================
// 🔥 PAGE
// ==========================
export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  const region = resolvedParams.region;
  const cityParam = slugify(decodeURIComponent(resolvedParams.city));
  const placeParam = slugify(decodeURIComponent(resolvedParams.place));

  const regionData = allData[region];
  if (!regionData) return notFound();

  const cityKey = Object.keys(regionData).find(
    (key) => slugify(key) === cityParam
  );
  if (!cityKey) return notFound();

  const foundPlace = regionData[cityKey].find(
    (p: any) => slugify(p.slug) === placeParam
  );
  if (!foundPlace) return notFound();

  const cityImageKey = slugify(cityKey);
  const placeKey = slugify(foundPlace.slug);
  const targetImageKey = placeKey.startsWith(cityImageKey)
    ? placeKey
    : `${cityImageKey}-${placeKey}`;

  const placeImages =
    allImages[region]?.[cityImageKey]?.[targetImageKey] ||
    allImages[region]?.[targetImageKey] ||
    [];

  // ==========================
  // 🔥 SCHEMA (Google Boost)
  // ==========================
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: foundPlace.name?.tr,
    description: foundPlace.description?.tr,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityKey,
      addressCountry: "TR",
    },
    geo: foundPlace.latitude && foundPlace.longitude
      ? {
          "@type": "GeoCoordinates",
          latitude: foundPlace.latitude,
          longitude: foundPlace.longitude,
        }
      : undefined,
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      <header className="border-b pb-8">
        <nav className="text-sm text-gray-400 uppercase mb-2">
          {region} / <span className="text-blue-500 font-bold">{cityKey}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-black">
          {foundPlace.name?.tr}
        </h1>
      </header>

      <section>
        {placeImages.length > 0 ? (
          <PlaceSlider images={placeImages} title={foundPlace.name?.tr} />
        ) : (
          <div className="h-[300px] rounded-[2.5rem] bg-gray-100 flex items-center justify-center text-gray-400">
            Resim yok
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-[2rem] border p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">
            📖 Mekan Hakkında
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {foundPlace.description?.tr}
          </p>
        </div>

        <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-900">
            🎯 Neler Yapılır?
          </h2>
          <ul className="space-y-3">
            {foundPlace.activities?.tr?.map(
              (act: string, i: number) => (
                <li
                  key={i}
                  className="bg-white/70 p-3 rounded-xl text-blue-800 text-sm font-semibold shadow-sm"
                >
                  • {act}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {foundPlace.latitude && foundPlace.longitude && (
        <section className="rounded-[2.5rem] overflow-hidden border shadow-xl h-[400px]">
          <iframe
            src={`https://maps.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&z=15&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </section>
      )}

      {/* 🔥 JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
