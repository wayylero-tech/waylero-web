import EtkinliklerClient from "./EtkinliklerClient";

type Props = {
  params: Promise<{ lang?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";

  const data = {
    tr: {
      title: "İstanbul, Antalya, Kapadokya ve İzmir Turları | Waylero",
      description: "İstanbul, Antalya, Nevşehir (Kapadokya) ve İzmir'deki en iyi turları, etkinlikleri ve aktiviteleri keşfedin. Waylero ile unutulmaz bir deneyim yaşayın.",
      keywords: ["istanbul turları", "antalya etkinlikleri", "kapadokya balon turu", "izmir gezilecek yerler", "türkiye turları"],
      canonical: "https://www.waylero.com/etkinlikler",
    },
    en: {
      title: "Istanbul, Antalya, Cappadocia & Izmir Tours | Waylero",
      description: "Discover the best tours, events, and activities in Istanbul, Antalya, Nevşehir (Cappadocia), and Izmir. Book your experience with Waylero.",
      keywords: ["istanbul tours", "antalya events", "cappadocia tours", "izmir activities", "turkey tours"],
      canonical: "https://www.waylero.com/en/etkinlikler",
    }
  };

  const current = data[lang];

  return {
    title: current.title,
    description: current.description,
    keywords: current.keywords,
    alternates: {
      canonical: current.canonical,
      languages: {
        'tr-TR': "https://www.waylero.com/etkinlikler",
        'en-US': "https://www.waylero.com/en/etkinlikler",
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