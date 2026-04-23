import toursData from "@/data/tours.json";
import CityPageClient from "./CityPageClient";

type Params = {
  city: string;
};

// ✅ SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const resolvedParams =
    typeof (params as any)?.then === "function"
      ? await params
      : params;

  const city = (resolvedParams as any).city.toLowerCase();

  const title = city
    ? `${city} Turlar & Deneyimler | Waylero`
    : "Turlar & Deneyimler | Waylero";

  const description = city
    ? `${city} şehrindeki en iyi turlar, aktiviteler ve gezilecek yerleri keşfedin.`
    : "En iyi turlar ve deneyimleri keşfedin.";

  const url = city
    ? `https://www.waylero.com/etkinlikler/${city}`
    : `https://www.waylero.com/etkinlikler`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      type: "website",
      images: [
        {
          url: "https://www.waylero.com/og.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.waylero.com/og.jpg"],
    },
  };
}

// ✅ PAGE
export default async function Page({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const resolvedParams =
    typeof (params as any)?.then === "function"
      ? await params
      : params;

  const city = (resolvedParams as any).city.toLowerCase();

  // 🔥 KARTLARI BOZMAYAN FİLTRE
  const cityTours = (toursData as any[]).filter(
    (t) => t?.city?.toLowerCase?.() === city
  );

  // ✅ JSON-LD (SEO BOOST)
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: city,
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

// ✅ (OPSİYONEL AMA ÖNERİLİR)
export function generateStaticParams() {
  const cities = Array.from(
    new Set((toursData as any[]).map((t) => t.city?.toLowerCase()))
  );

  return cities.map((city) => ({ city }));
}