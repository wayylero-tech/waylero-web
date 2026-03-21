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

const allData: any = { turkey, europa, asia };

const allImages: any = {
  turkey: turkeyImages,
  europa: europaImages,
  asia: asiaImages,
};

// Hangi ülkenin hangi JSON içinde olduğunu belirleyen harita
const countryToRegionMap: Record<string, string> = {
  turkiye: "turkey",
  fransa: "europa",
  almanya: "europa",
  italya: "europa",
  ispanya: "europa",
  ingiltere: "europa",
  hollanda: "europa",
  belcika: "europa",
  avusturya: "europa",
  yunanistan: "europa",
  "cek-cumhuriyeti": "europa",
  macaristan: "europa",
  portekiz: "europa",
  romanya: "europa",
  danimarka: "europa",
  isvec: "europa",
  norvec: "europa",
  isvicre: "europa",
  slovakya: "europa",
  finlandiya: "europa",
  irlanda: "europa",
  "bosna-hersek": "europa",
  gurcistan: "europa",
  balerus: "europa",
  iskocya: "europa",
  galler: "europa",
  cin: "asia",
  hindistan: "asia",
  tayland: "europa",
  singapur: "europa",
  "guney-kore": "europa",
  bae: "asia",
  rusya: "europa",
  malezya: "europa",
  endonezya: "asia",
  japonya: "asia",
  "sri-lanka": "asia",
  misir: "europa",
  "suudi-arabistan": "europa",
  umman: "europa",
  amerika: "europa",
  peru: "europa",
  avustralya: "europa",
  filipinler: "europa",
  kktc: "europa",
};

const slugify = (text: string) => {
  if (!text) return "";

  const trMap: any = {
    ç: "c",
    ğ: "g",
    ı: "i",
    i: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };

  return text
    .toString()
    .toLowerCase()
    .replace(/[çğışüö]/g, (m) => trMap[m])
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");
};

type Props = {
  params: Promise<{ region: string; city: string; place: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { region, city, place } = await params;

  const mainRegion = countryToRegionMap[region] || region;
  const regionData = allData[mainRegion];
  if (!regionData) return {};

  const cityKey = Object.keys(regionData).find(
    (key) => slugify(key) === slugify(decodeURIComponent(city))
  );
  if (!cityKey) return {};

  const foundPlace = regionData[cityKey].find(
    (p: any) =>
      slugify(p.slug) === slugify(decodeURIComponent(place))
  );
  if (!foundPlace) return {};

  return {
    title: `${foundPlace.name?.tr} | Waylero`,
    description: foundPlace.description?.tr?.slice(0, 155),
  };
}

export default async function Page({ params }: Props) {
  const { region, city, place } = await params;

  // URL'den gelen 'fransa' gibi değerleri 'europa' ya çeviriyoruz
  const mainRegion = countryToRegionMap[region] || region;
  const regionData = allData[mainRegion];

  if (!regionData) return notFound();

  const cityParam = slugify(decodeURIComponent(city));
  const placeParam = slugify(decodeURIComponent(place));

  const cityKey = Object.keys(regionData).find(
    (key) => slugify(key) === cityParam
  );
  if (!cityKey) return notFound();

  const foundPlace = regionData[cityKey].find(
    (p: any) => slugify(p.slug) === placeParam
  );
  if (!foundPlace) return notFound();

  // Resim Mantığı
  const targetImageKey = `${slugify(cityKey)}-${slugify(
    foundPlace.slug
  )}`;

  const regionImages = allImages[mainRegion] || {};
  const cityGroup =
    regionImages[cityKey] || regionImages[slugify(cityKey)];

  const placeImages =
    cityGroup?.[targetImageKey] ||
    cityGroup?.[foundPlace.slug] ||
    [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: foundPlace.name?.tr,
    description: foundPlace.description?.tr,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityKey,
      addressCountry:
        region === "turkiye" ? "TR" : region.toUpperCase(),
    },
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header className="border-b pb-8">
        <nav className="text-sm text-gray-400 uppercase mb-2">
          {region} /{" "}
          <span className="text-blue-500 font-bold">
            {cityKey}
          </span>
        </nav>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900">
          {foundPlace.name?.tr}
        </h1>
      </header>

      <section>
        {placeImages.length > 0 ? (
          <PlaceSlider
            images={placeImages}
            title={foundPlace.name?.tr}
          />
        ) : (
          <div className="h-[400px] w-full rounded-[2.5rem] bg-gray-50 border-2 border-dashed flex flex-col items-center justify-center text-gray-400">
            <span className="text-5xl mb-4">📸</span>
            <p>Bu mekan için henüz fotoğraf eklenmemiş.</p>
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

        <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 h-fit">
          <h2 className="text-xl font-bold mb-4 text-blue-900">
            🎯 Neler Yapılır?
          </h2>

          <ul className="space-y-3">
            {foundPlace.activities?.tr?.map(
              (act: string, i: number) => (
                <li
                  key={i}
                  className="bg-white p-3 rounded-xl text-blue-800 text-sm font-semibold shadow-sm"
                >
                  • {act}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {foundPlace.latitude && foundPlace.longitude && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold px-2 text-gray-800">
            📍 Konum
          </h2>

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </main>
  );
}