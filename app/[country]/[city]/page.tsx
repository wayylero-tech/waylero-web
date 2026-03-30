import cities from "../../data/cities.json";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

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

export async function generateStaticParams() {
  return cities.map((city) => ({
    country: city.country.toLowerCase().replace(/ /g, "-"),
    city: city.slug,
  }));
}

export default async function CityPage({ params }: Props) {
  const { country, city: citySlug } = await params;

  // 🔹 Çerezden dili yakala (Server Side)
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en" | "de";

  // 🔹 Sabit metinler için sözlük
  const t = {
    tr: {
      travelTitle: "✈️ Seyahat Bilgileri",
      bestTime: "🌤 En iyi zaman",
      timezone: "🕒 Saat Dilimi",
      currency: "💶 Para Birimi",
      language: "🗣 Dil",
      population: "👥 Nüfus",
      exploreBtn: "da Gezilecek Yerler",
      countryName: "Ülke"
    },
    en: {
      travelTitle: "✈️ Travel Information",
      bestTime: "🌤 Best time to visit",
      timezone: "🕒 Timezone",
      currency: "💶 Currency",
      language: "🗣 Language",
      population: "👥 Population",
      exploreBtn: "Places to Visit in",
      countryName: "Country"
    },
    de: {
      travelTitle: "✈️ Reiseinformationen",
      bestTime: "🌤 Beste Reisezeit",
      timezone: "🕒 Zeitzone",
      currency: "💶 Währung",
      language: "🗣 Sprache",
      population: "👥 Bevölkerung",
      exploreBtn: "Sehenswürdigkeiten in",
      countryName: "Land"
    }
  }[lang];

  // 🔥 URL YÖNETİCİSİ (Server Side Link Oluşturucu)
  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  const city = (cities as City[]).find(
    (c) => c.slug === citySlug && c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return notFound();

  const currentCityName = city.names[lang] || city.names["tr"];
  const currentCityDesc = city.descriptions[lang] || city.descriptions["tr"];
  const travelInfo = city.travel_info?.[lang] || city.travel_info?.["tr"];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
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
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t.bestTime}</p>
              <p className="font-semibold text-gray-800">{travelInfo.best_time}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t.timezone}</p>
              <p className="font-semibold text-gray-800">{travelInfo.timezone}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t.currency}</p>
              <p className="font-semibold text-gray-800">{travelInfo.currency}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t.language}</p>
              <p className="font-semibold text-gray-800">{travelInfo.language}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t.population}</p>
              <p className="font-semibold text-gray-800">{travelInfo.population}</p>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY SECTION */}
      {city.additionalImages?.length ? (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
          {city.additionalImages.map((img, idx) => (
            <div
              key={idx}
              className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-lg"
            >
              <img
                src={img}
                alt={`${currentCityName} gallery ${idx + 1}`}
                className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* EXPLORE BUTTON */}
      <div className="mt-16 flex justify-center">
        <a
          // 🔥 Link artık dile duyarlı: /en/kesfet veya /de/kesfet olacak
          href={getLocalizedLink(`/kesfet?q=${encodeURIComponent(citySlug)}`)}
          className="px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-bold shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          📍 {lang === "tr" ? `${currentCityName}${t.exploreBtn}` : `${t.exploreBtn} ${currentCityName}`}
        </a>
      </div>
    </main>
  );
}