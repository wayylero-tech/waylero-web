import EtkinliklerClient from "./EtkinliklerClient";

type Props = {
  params: Promise<{ lang?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";

  const data = {
    tr: {
      title:
        "İstanbul, Antalya, Kapadokya, İzmir ve Daha Fazlası | Waylero",
      description:
        "İstanbul, Antalya, Nevşehir (Kapadokya), İzmir ve Türkiye ile dünyadaki diğer şehirlerdeki en iyi turları, etkinlikleri ve aktiviteleri keşfedin. Waylero ile unutulmaz bir deneyim yaşayın.",
      keywords: [
        "istanbul turları",
        "antalya etkinlikleri",
        "kapadokya balon turu",
        "izmir gezilecek yerler",
        "muğla turları",
        "aydın gezilecek yerler",
        "trabzon yaylaları",
        "viyana turları",
        "roma gezilecek yerler",
        "paris turları",
        "dubai aktiviteler",
        "bangkok turları",
        "türkiye turları",
        "diğer şehirler turları",
      ],
      canonical: "https://www.waylero.com/tr/etkinlikler",
    },

    en: {
      title:
        "Istanbul, Antalya, Cappadocia, Izmir & More | Waylero",
      description:
        "Discover the best tours, activities, and experiences in Istanbul, Antalya, Cappadocia, Izmir and many other cities in Turkey and worldwide with Waylero.",
      keywords: [
        "istanbul tours",
        "antalya events",
        "cappadocia tours",
        "izmir activities",
        "mugla tours",
        "aydin attractions",
        "trabzon travel",
        "vienna tours",
        "rome attractions",
        "paris tours",
        "dubai activities",
        "bangkok tours",
        "turkey tours",
        "other cities tours",
      ],
      canonical: "https://www.waylero.com/en/etkinlikler",
    },
  };

  const current = data[lang];

  return {
    title: current.title,
    description: current.description,
    keywords: current.keywords,

    alternates: {
      canonical: current.canonical,
      languages: {
        "tr-TR": "https://www.waylero.com/tr/etkinlikler",
        "en-US": "https://www.waylero.com/en/etkinlikler",
      },
    },

    openGraph: {
      title: current.title,
      description: current.description,
      url: current.canonical,
      siteName: "Waylero",
      type: "website",
      locale: lang === "en" ? "en_US" : "tr_TR",
      images: ["https://www.waylero.com/og.jpg"],
    },

    twitter: {
      card: "summary_large_image",
      title: current.title,
      description: current.description,
      images: ["https://www.waylero.com/og.jpg"],
    },
  };
}
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";
  
  return <EtkinliklerClient currentLang={lang} />;
}