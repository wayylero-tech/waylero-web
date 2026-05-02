import cities from "../../data/cities.json";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { Sparkles } from "lucide-react";

const countryToRegionMap: Record<string, string> = {
  turkiye: "turkiye", fransa: "fransa", almanya: "almanya", italya: "italya", kktc: "kktc",
  ispanya: "ispanya", ingiltere: "ingiltere", hollanda: "hollanda",
  avusturya: "avusturya", yunanistan: "yunanistan", "cek-cumhuriyeti": "cek-cumhuriyeti",
  rusya: "rusya", portekiz: "portekiz", romanya: "romanya", danimarka: "danimarka",
  urdun: "urdun", isvec: "isvec", norvec: "norvec", isvicre: "isvicre",
  endonezya: "endonezya", irlanda: "irlanda", "bosna-hersek": "bosna-hersek",
  avustralya: "avustralya", gurcistan: "gurcistan", iskocya: "iskocya",
  galler: "galler", malezya: "malezya", cin: "cin", hindistan: "hindistan",
  tayland: "tayland", "guney-kore": "guney-kore", filipinler: "filipinler",
  japonya: "japonya", "sri-lanka": "sri-lanka", singapur: "singapur",
  amerika: "amerika", umman: "umman", "suudi-arabistan": "suudi-arabistan",
  misir: "misir", belarus: "belarus"
};

type City = {
  slug: string;
  country: string;
  image: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  additionalImages?: string[];
  travel_info?: Record<
    string,
    {
      best_time: string;
      timezone: string;
      currency: string;
      language: string;
      population: string;
    }
  >;
};

type Props = {
  params: Promise<{ country: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city: citySlug } = await params;

  const city = (cities as City[]).find(
    (c) =>
      c.slug === citySlug &&
      c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return { title: "City Not Found | Waylero" };

  const name = city.names["tr"];
  const desc = city.descriptions["tr"].substring(0, 160);

  return {
    title: `${name} Gezi Rehberi | Waylero`,
    description: desc,
  };
}

export default async function CityPage({ params }: Props) {
  const { country, city: citySlug } = await params;

  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";

  const t = {
    tr: {
      travel: "Seyahat Bilgileri",
      explore: "Gezilecek Yerler",
      live: "Canlı Rehber",
    },
    en: {
      travel: "Travel Information",
      explore: "Explore Places",
      live: "Live Guide",
    },
  }[lang];

  const city = (cities as City[]).find(
    (c) =>
      c.slug === citySlug &&
      c.country.toLowerCase().replace(/ /g, "-") === country
  );

  
  if (!city) return notFound();

  const name = city.names[lang] || city.names["tr"];
  const desc = city.descriptions[lang] || city.descriptions["tr"];
  const travel = city.travel_info?.[lang] || city.travel_info?.["tr"];

  const countryKey = city.country.toLowerCase().replace(/ /g, "-");
  const regionSlug = countryToRegionMap[countryKey] || countryKey;

  const exploreLink = `/${lang === "en" ? "en/" : ""}kesfet/${regionSlug}/${city.slug}`;

  return (
  <main className="min-h-screen bg-white text-gray-900">

      {/* 1. HERO (SADECE ŞEHİR İSMİ) */}
      <section className="pt-24 pb-12 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tight">
            {name}
          </h1>
        </div>
      </section>

{/* 2. RESİM (HERO ALTINDA - DİNAMİK İKİLİ Sığdırma) */}
<section className="container mx-auto px-6 -mt-10 relative z-10">
  <div className={`rounded-[3rem] overflow-hidden shadow-2xl mb-12 bg-gray-100 border border-gray-100 ${
    city.additionalImages?.length ? "grid grid-cols-1 md:grid-cols-2 gap-2" : "flex justify-center items-center"
  }`}>
    {/* 1. ANA RESİM (Sığdırılmış ve Oval) */}
    <div className={`${city.additionalImages?.length ? "h-[520px]" : "h-auto max-h-[70vh]"} w-full flex justify-center items-center p-2`}>
        <img
          src={city.image}
          alt={name}
          className="max-w-full max-h-full object-contain block mx-auto rounded-3xl"
        />
    </div>

    {/* 2. GALERİ RESMİ (Eğer varsa - Sığdırılmış ve Oval) */}
    {city.additionalImages && city.additionalImages.length > 0 && (
       <div className="h-[520px] w-full flex justify-center items-center p-2 hidden md:flex">
          <img
            src={city.additionalImages[0]}
            alt={`${name} galeri`}
            className="max-w-full max-h-full object-contain block mx-auto rounded-3xl"
          />
       </div>
    )}
  </div>

      {/* 3. TRAVEL INFO (RESİMDEN SONRA) */}
      {travel && (
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-8">{t.travel}</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
            <div><p className="text-gray-400 font-bold">Best Time</p><p>{travel.best_time}</p></div>
            <div><p className="text-gray-400 font-bold">Timezone</p><p>{travel.timezone}</p></div>
            <div><p className="text-gray-400 font-bold">Currency</p><p>{travel.currency}</p></div>
            <div><p className="text-gray-400 font-bold">Language</p><p>{travel.language}</p></div>
            <div><p className="text-gray-400 font-bold">Population</p><p>{travel.population}</p></div>
          </div>
        </div>
      )}

      {/* 4. AÇIKLAMA (İSTEĞE BAĞLI TEKRAR BLOK) */}
      <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line mb-12">
        {desc}
      </div>

    

      {/* 6. BUTTON */}
      <div className="flex justify-center pb-20">
        <a
          href={exploreLink}
          className="px-12 py-5 rounded-2xl bg-black text-white font-bold hover:scale-105 transition"
        >
          📍 {t.explore} {name}
        </a>
      </div>

    </section>
  </main>
);
}