import cities from "../../data/cities.json";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";

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

// 1. DİNAMİK SEO METADATA (Google Arama Sonuçları İçin)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city: citySlug } = await params;
  const city = (cities as City[]).find(
    (c) => c.slug === citySlug && c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return { title: "City Not Found | Waylero" };

  // Google botu genelde çerezsiz geldiği için varsayılan olarak TR verisini gösteriyoruz
  const name = city.names["tr"];
  const desc = city.descriptions["tr"].substring(0, 160);
  const fullUrl = `https://www.waylero.com/${country}/${citySlug}`;

  return {
    title: `${name} Gezi Rehberi: Gezilecek Yerler ve Bilgiler | Waylero`,
    description: `${desc}... ${name} seyahatiniz için en güncel bilgiler, hava durumu ve ulaşım rehberi.`,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${name} Gezi Rehberi | Waylero`,
      description: desc,
      url: fullUrl,
      type: "website",
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

  // 🔹 Dil Yönetimi (Sadece TR ve EN)
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
  }[lang] || { // Fallback to TR
      travelTitle: "✈️ Seyahat Bilgileri",
      bestTime: "🌤 En iyi zaman",
      timezone: "🕒 Saat Dilimi",
      currency: "💶 Para Birimi",
      language: "🗣 Dil",
      population: "👥 Nüfus",
      exploreBtn: "da Gezilecek Yerler",
  };

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/en${path.startsWith("/") ? path : `/${path}`}`;
  };

  const city = (cities as City[]).find(
    (c) => c.slug === citySlug && c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return notFound();

  const currentCityName = city.names[lang] || city.names["tr"];
  const currentCityDesc = city.descriptions[lang] || city.descriptions["tr"];
  const travelInfo = city.travel_info?.[lang] || city.travel_info?.["tr"];

  // 2. JSON-LD (Google'ın Veriyi Anlaması İçin Teknik SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": `${currentCityName} Gezi Rehberi`,
    "description": currentCityDesc.substring(0, 200),
    "image": city.image,
    "abstract": currentCityDesc,
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Schema.org verisini sayfaya gizli basıyoruz */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER IMAGE SECTION */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-black shadow-2xl">
        <img
          src={city.image}
          alt={currentCityName}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <h1 className="absolute bottom-6 left-6 text-white text-4xl md:text-5xl font-black drop-shadow-2xl">
          {currentCityName}
        </h1>
      </div>

      <p className="mt-6 text-blue-600 text-lg font-bold tracking-wide uppercase">
         {city.country}
      </p>
      
      <div className="mt-6 text-gray-700 leading-relaxed text-lg whitespace-pre-line text-justify border-l-4 border-blue-500 pl-6">
        {currentCityDesc}
      </div>

      {/* TRAVEL INFO CARDS */}
      {travelInfo && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            {t.travelTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: t.bestTime, value: travelInfo.best_time },
              { label: t.timezone, value: travelInfo.timezone },
              { label: t.currency, value: travelInfo.currency },
              { label: t.language, value: travelInfo.language },
              { label: t.population, value: travelInfo.population },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY SECTION */}
      {city.additionalImages?.length ? (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
          {city.additionalImages.map((img, idx) => (
            <div key={idx} className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
              <img
                src={img}
                alt={`${currentCityName} - ${idx + 1}`}
                className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* EXPLORE BUTTON */}
      <div className="mt-16 flex justify-center">
        <a
          href={getLocalizedLink(`/kesfet?q=${encodeURIComponent(citySlug)}`)}
          className="px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-bold shadow-xl hover:scale-105 transition-all"
        >
          📍 {lang === "tr" ? `${currentCityName}${t.exploreBtn}` : `${t.exploreBtn} ${currentCityName}`}
        </a>
      </div>
    </main>
  );
}