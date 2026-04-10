import cities from "../../data/cities.json";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";

// 🔹 Bölge Haritası (Butonun doğru yere gitmesi için şart)
const countryToRegionMap: Record<string, string> = {
  turkiye: "turkiye", fransa: "fransa", almanya: "almanya", italya: "italya", kktc: "kktc",
  ispanya: "ispanya", ingiltere: "ingiltere", hollanda: "hollanda", 
  avusturya: "avusturya", yunanistan: "yunanistan", "cek-cumhuriyeti": "cek-cumhuriyeti", rusya: "rusya",
  portekiz: "portekiz", romanya: "romanya", danimarka: "danimarka", urdun: "urdun",
  isvec: "isvec", norvec: "norvec", isvicre: "isvicre", endonezya: "endonezya", 
  irlanda: "irlanda", "bosna-hersek": "bosna-hersek", avustralya: "avustralya", 
  gurcistan: "gurcistan", iskocya: "iskocya", galler: "galler", malezya: "malezya", 
  cin: "cin", hindistan: "hindistan", tayland: "tayland", "guney-kore": "guney-kore", filipinler: "filipinler", 
  japonya: "japonya", "sri-lanka": "sri-lanka", singapur: "singapur", amerika: "amerika", umman: "umman", 
  "suudi-arabistan": "suudi-arabistan", misir: "misir", belarus: "belarus"
};

type City = {
  slug: string;
  country: string;
  region?: string;
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
  params: Promise<{
    country: string;
    city: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city: citySlug } = await params;
  const city = (cities as City[]).find(
    (c) => c.slug === citySlug && c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return { title: "City Not Found | Waylero" };

  const name = city.names["tr"];
  const desc = city.descriptions["tr"].substring(0, 160);
  const fullUrl = `https://www.waylero.com/${country}/${citySlug}`;

  return {
    title: `${name} Gezi Rehberi: Gezilecek Yerler ve Bilgiler | Waylero`,
    description: `${desc}... ${name} seyahatiniz için en güncel bilgiler.`,
    alternates: { canonical: fullUrl },
    openGraph: {
      title: `${name} Gezi Rehberi | Waylero`,
      description: desc,
      url: fullUrl,
      images: [{ url: city.image }],
    },
  };
}

export async function generateStaticParams() {
  return cities.map((city) => ({
    country: city.country.toLowerCase().replace(/ /g, "-"),
    city: city.slug,
  }));
}

export default async function CityPage({ params }: Props) {
  const { country, city: citySlug } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";

  const t = {
    tr: {
      travelTitle: "✈️ Seyahat Bilgileri",
      bestTime: "🌤 En iyi zaman",
      timezone: "🕒 Saat Dilimi",
      currency: "💶 Para Birimi",
      language: "🗣 Dil",
      population: "👥 Nüfus",
      exploreBtn: "da Gezilecek Yerler",
    },
    en: {
      travelTitle: "✈️ Travel Information",
      bestTime: "🌤 Best time to visit",
      timezone: "🕒 Timezone",
      currency: "💶 Currency",
      language: "🗣 Language",
      population: "👥 Population",
      exploreBtn: "Places to Visit in",
    }
  }[lang];

  const city = (cities as City[]).find(
    (c) => c.slug === citySlug && c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return notFound();

  const currentCityName = city.names[lang] || city.names["tr"];
  const currentCityDesc = city.descriptions[lang] || city.descriptions["tr"];
  const travelInfo = city.travel_info?.[lang] || city.travel_info?.["tr"];

  // 🚀 AKILLI LİNK OLUŞTURUCU
  const getExploreLink = () => {
    // Ülke ismini map'e uygun hale getir (Örn: "Suudi Arabistan" -> "suudi-arabistan")
    const countryKey = city.country.toLowerCase().replace(/ /g, "-");
    const regionSlug = countryToRegionMap[countryKey] || countryKey;
    
    const prefix = lang === "en" ? "/en" : "";
    // Yapı: /kesfet/[ülke-slug]/[şehir-slug]
    return `${prefix}/kesfet/${regionSlug}/${city.slug}`;
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* IMAGE SECTION */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-black shadow-2xl">
        <img
          src={city.image}
          alt={currentCityName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <h1 className="absolute bottom-6 left-6 text-white text-4xl md:text-5xl font-black italic">
          {currentCityName}
        </h1>
      </div>

      <p className="mt-6 text-blue-600 text-lg font-bold tracking-wide uppercase">
         {city.country}
      </p>
      
      <div className="mt-6 text-gray-700 leading-relaxed text-lg whitespace-pre-line text-justify border-l-4 border-blue-500 pl-6">
        {currentCityDesc}
      </div>

      {/* TRAVEL INFO */}
      {travelInfo && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">{t.travelTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: t.bestTime, value: travelInfo.best_time },
              { label: t.timezone, value: travelInfo.timezone },
              { label: t.currency, value: travelInfo.currency },
              { label: t.language, value: travelInfo.language },
              { label: t.population, value: travelInfo.population },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">{item.label}</p>
                <p className="font-semibold text-gray-800 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPLORE BUTTON - ARTIK DOĞRU YERE GİDİYOR */}
      <div className="mt-16 flex justify-center">
        <a
          href={getExploreLink()}
          className="px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-bold shadow-xl hover:scale-105 transition-all text-center"
        >
          📍 {lang === "tr" ? `${currentCityName}${t.exploreBtn}` : `${t.exploreBtn} ${currentCityName}`}
        </a>
      </div>

      {/* GALLERY */}
      {city.additionalImages?.length ? (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6">
          {city.additionalImages.map((img, idx) => (
            <div key={idx} className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
              <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}