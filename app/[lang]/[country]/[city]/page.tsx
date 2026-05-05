import cities from "@/data/cities.json";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Ülke - Bölge haritası (Aynı kaldı)
const countryToRegionMap: Record<string, string> = {
  turkiye: "turkiye", fransa: "fransa", almanya: "almanya", avusturya: "avusturya", // ... diğerleri
};

type City = {
  slug: string;
  country: string;
  image: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  additionalImages?: string[];
  travel_info?: Record<string, any>;
};

// Next.js 15 Tip Tanımı
type Props = {
  params: Promise<{ lang: string; country: string; city: string }>;
};

// --- METADATA (Tamamen Cache Dostu) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, country, city: citySlug } = await params;

  const city = (cities as City[]).find(
    (c) =>
      c.slug === citySlug &&
      c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return { title: "Not Found" };

  const name = city.names[lang] || city.names["tr"];
  const description =
    city.descriptions[lang]?.substring(0, 160) || "Waylero";

  const url = `https://waylero.com/${lang}/${country}/${citySlug}`;

  return {
    title: `${name} | Waylero`,
    description,

    // 🔥 SEO canonical + hreflang
    alternates: {
      canonical: url,
      languages: {
        tr: `https://waylero.com/tr/${country}/${citySlug}`,
        en: `https://waylero.com/en/${country}/${citySlug}`,
      },
    },

    // 🔥 OPEN GRAPH (Facebook, WhatsApp, Discord vs.)
    openGraph: {
      title: `${name} | Waylero`,
      description,
      url,
      siteName: "Waylero",
      images: [
        {
          url: city.image || "https://waylero.com/og-default.jpg",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      locale: lang === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },

    // 🔥 TWITTER CARD
    twitter: {
      card: "summary_large_image",
      title: `${name} | Waylero`,
      description,
      images: [city.image || "https://waylero.com/og-default.jpg"],
      creator: "@waylero",
      site: "@waylero",
    },
  };
}
// --- PAGE COMPONENT ---
export default async function CityPage({ params }: Props) {
  // ✅ Dili ve diğer bilgileri direkt params'dan çekiyoruz. 
  // headers() veya cookies() yok -> Sayfa statik olarak cache'lenebilir!
  const { lang, country, city: citySlug } = await params;
  const isEn = lang === "en";

  const t = {
    tr: {
      travel: "Seyahat Bilgileri",
      explore: "Gezilecek Yerler",
      labels: { time: "En İyi Zaman", zone: "Saat Dilimi", curr: "Para Birimi", lang: "Dil", pop: "Nüfus" }
    },
    en: {
      travel: "Travel Information",
      explore: "Explore Places",
      labels: { time: "Best Time", zone: "Timezone", curr: "Currency", lang: "Language", pop: "Population" }
    }
  }[isEn ? "en" : "tr"];

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
  const exploreLink = `/${isEn ? "en/" : ""}kesfet/${regionSlug}/${city.slug}`;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[linear-gradient(110deg,#fdfaf7_50%,#eef8fb_50%)]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-9xl font-serif font-bold tracking-tighter italic leading-none">
            {name}
          </h1>
          <p className="mt-4 text-orange-600 font-black tracking-[0.4em] uppercase text-xs">
            {city.country}
          </p>
        </div>
      </section>

      {/* Görseller */}
      <section className="container mx-auto px-6 -mt-12 relative z-10">
        <div className={`rounded-[4rem] overflow-hidden shadow-2xl mb-16 bg-white p-4 border border-gray-100 ${
          city.additionalImages?.length ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex justify-center"
        }`}>
          <div className="h-[400px] md:h-[600px] w-full relative group">
            <img src={city.image} alt={name} className="w-full h-full object-cover rounded-[3rem]" />
          </div>
          {city.additionalImages?.[0] && (
            <div className="h-[600px] w-full hidden md:block relative">
              <img src={city.additionalImages[0]} alt={name} className="w-full h-full object-cover rounded-[3rem]" />
            </div>
          )}
        </div>

        {/* Bilgi Kartı */}
        {travel && (
          <div className="bg-gray-900 text-white p-12 rounded-[3.5rem] mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[120px] opacity-20"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-10 border-l-2 border-orange-500 pl-4">{t.travel}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 relative z-10">
              <div><p className="text-[10px] text-gray-500 uppercase font-black">{t.labels.time}</p><p className="text-lg font-serif italic">{travel.best_time}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase font-black">{t.labels.zone}</p><p className="text-lg font-serif italic">{travel.timezone}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase font-black">{t.labels.curr}</p><p className="text-lg font-serif italic">{travel.currency}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase font-black">{t.labels.lang}</p><p className="text-lg font-serif italic">{travel.language}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase font-black">{t.labels.pop}</p><p className="text-lg font-serif italic">{travel.population}</p></div>
            </div>
          </div>
        )}

        {/* İçerik ve Buton */}
        <div className="max-w-4xl mx-auto">
          <div className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-20 font-serif italic">
            <span className="text-5xl text-orange-500 font-serif not-italic float-left mr-3 leading-none">“</span>
            {desc}
          </div>
          <div className="flex flex-col items-center pb-24 space-y-6">
            <a href={exploreLink} className="group relative px-16 py-6 rounded-full bg-black text-white font-bold transition-all hover:scale-105">
              <span className="tracking-widest uppercase text-sm">📍 {t.explore} {name}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}