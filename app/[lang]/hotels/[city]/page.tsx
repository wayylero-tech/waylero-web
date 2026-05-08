import HotelCityPageClient from "./HotelCityPageClient";
import { Metadata } from "next";

type Params = { lang: string; city: string };

const BASE_URL = "https://www.waylero.com";

// Şehir ismini (örn: san-francisco -> San Francisco) formatlayan yardımcı
const formatCityName = (city: string) => 
  city.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, city } = await params;
  const cityName = formatCityName(city);
  const isTR = lang === "tr";

  const title = isTR 
    ? `${cityName} Otelleri | En İyi Fiyatlarla Konaklama | Waylero` 
    : `Best Hotels in ${cityName} | Book Your Stay | Waylero`;
    
  const description = isTR
    ? `${cityName} şehrindeki en popüler otelleri, butik konaklama seçeneklerini ve en uygun fiyatları keşfedin.`
    : `Find the best prices for hotels in ${cityName}. Compare top-rated accommodations and book your stay.`;

  const path = `/${lang}/hotels/${city}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: {
        "tr-TR": `${BASE_URL}/tr/hotels/${city}`,
        "en-US": `${BASE_URL}/en/hotels/${city}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      type: "website",
      locale: isTR ? "tr_TR" : "en_US",
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { city, lang } = await params;
  const cityName = formatCityName(city);
  const isTR = lang === "tr";

  // Affiliate verisi
  const cityData = [
    {
      id: 1,
      city: city,
      link: "https://booking.tp.st/3YML2Z43", 
    }
  ];

  // Şehir Sayfası JSON-LD (Daha spesifik bir şema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": isTR ? `${cityName} Otelleri` : `Hotels in ${cityName}`,
    "description": isTR ? `${cityName} şehri için en iyi konaklama seçenekleri.` : `Best accommodation options for ${cityName}.`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": isTR ? "Anasayfa" : "Home",
          "item": `${BASE_URL}/${lang}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": isTR ? "Oteller" : "Hotels",
          "item": `${BASE_URL}/${lang}/hotels`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": cityName,
          "item": `${BASE_URL}/${lang}/hotels/${city}`
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HotelCityPageClient
        city={city}
        lang={lang as "tr" | "en"}
        cityHotels={cityData}
      />
    </>
  );
}