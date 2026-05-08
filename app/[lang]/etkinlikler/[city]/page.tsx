import CityPageClient from "./CityPageClient";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Params = { city: string; lang: 'tr' | 'en' };

const BASE_URL = "https://www.waylero.com";

// Şehir ismini slug'dan güzel bir formata çeviren yardımcı
function getCityName(citySlug: string) {
  return citySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city, lang } = await params;
  const isTR = lang === "tr";
  const cityName = getCityName(city);
  
  // URL yapısını sabitleyelim
  const currentPath = `/${lang}/etkinlikler/${city}`;
  const fullUrl = `${BASE_URL}${currentPath}`;

  const title = isTR
    ? `${cityName} Turlar & Deneyimler | Waylero`
    : `${cityName} Tours & Experiences | Waylero`;

  const description = isTR
    ? `${cityName} şehrindeki en iyi turları, etkinlikleri ve gezilecek yerleri keşfedin.`
    : `Discover the best tours, events, and things to do in ${cityName}.`;

  return {
    title,
    description,
    alternates: {
      canonical: fullUrl,
      languages: {
        "tr-TR": `${BASE_URL}/tr/etkinlikler/${city}`,
        "en-US": `${BASE_URL}/en/etkinlikler/${city}`,
      },
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Waylero",
      type: "website",
      locale: isTR ? "tr_TR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { city, lang } = await params;
  const cityName = getCityName(city);
  
  // Metadata ile aynı URL yapısını kullanıyoruz
  const schemaUrl = `${BASE_URL}/${lang}/etkinlikler/${city}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": cityName,
    "description": lang === 'tr' 
      ? `${cityName} turları ve deneyimleri` 
      : `${cityName} tours and experiences`,
    "url": schemaUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CityPageClient city={city} lang={lang} />
    </>
  );
}

export function generateStaticParams() {
  return []; // Dinamik render için doğru
}