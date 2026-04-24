import toursData from "@/data/tours.json";
import CityPageClient from "./CityPageClient";

// Şehir ismini güzelleştiren yardımcı fonksiyon
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Params = { city: string; lang: string };

export async function generateMetadata({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = await params;
  const citySlug = (resolvedParams as any).city.toLowerCase();
  const lang = (resolvedParams as any).lang === 'en' ? 'en' : 'tr';
  const cityName = capitalize(citySlug);

  // Dil bazlı içerik tanımları
  const data = {
    tr: {
      title: `${cityName} Turlar & Deneyimler | Waylero`,
      description: `${cityName} şehrindeki en iyi turları, etkinlikleri ve gezilecek yerleri keşfedin.`,
      canonical: `https://www.waylero.com/etkinlikler/${citySlug}`,
    },
    en: {
      title: `${cityName} Tours & Experiences | Waylero`,
      description: `Discover the best tours, events, and things to do in ${cityName}.`,
      canonical: `https://www.waylero.com/en/etkinlikler/${citySlug}`,
    }
  };

  const current = data[lang];

  return {
    title: current.title,
    description: current.description,
    alternates: {
      canonical: current.canonical,
      languages: {
        'tr-TR': `https://www.waylero.com/etkinlikler/${citySlug}`,
        'en-US': `https://www.waylero.com/en/etkinlikler/${citySlug}`,
      },
    },
    openGraph: {
      title: current.title,
      description: current.description,
      url: current.canonical,
      siteName: "Waylero",
      type: "website",
      images: [{ url: "https://www.waylero.com/og.jpg" }],
      locale: lang === 'en' ? 'en_US' : 'tr_TR',
    },
    twitter: {
      card: "summary_large_image",
      title: current.title,
      description: current.description,
      images: ["https://www.waylero.com/og.jpg"],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = await params;
  const city = (resolvedParams as any).city.toLowerCase();

  const cityTours = (toursData as any[]).filter(
    (t) => t?.city?.toLowerCase?.() === city
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: capitalize(city),
    description: `${city} şehrindeki turlar ve deneyimler`,
    url: `https://www.waylero.com/etkinlikler/${city}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CityPageClient city={city} cityTours={cityTours} />
    </>
  );
}

// Hem dili hem şehri statik olarak tanımlıyoruz
export function generateStaticParams() {
  const cities = Array.from(new Set((toursData as any[]).map((t) => t.city?.toLowerCase())));
  const languages = ['tr', 'en'];
  
  return languages.flatMap((lang) =>
    cities.map((city) => ({
      lang,
      city,
    }))
  );
}