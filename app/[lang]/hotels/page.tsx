import HotelsClient from "./HotelsClient";

type Props = {
  params: Promise<{ lang?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";

  const data = {
    tr: {
      title: "Türkiye Otelleri | Waylero",
      description:
        "İstanbul, Antalya, Kapadokya ve İzmir'deki en iyi otelleri keşfedin.",
      canonical: "https://www.waylero.com/hotels",
    },
    en: {
      title: "Turkey Hotels | Waylero",
      description:
        "Discover the best hotels in Istanbul, Antalya, Cappadocia and Izmir.",
      canonical: "https://www.waylero.com/en/hotels",
    },
  };

  const current = data[lang];

  return {
    title: current.title,
    description: current.description,

    alternates: {
      canonical: current.canonical,
      languages: {
        "tr-TR": "https://www.waylero.com/hotels",
        "en-US": "https://www.waylero.com/en/hotels",
      },
    },

    openGraph: {
      title: current.title,
      description: current.description,
      url: current.canonical,
      siteName: "Waylero",
      type: "website",
      locale: lang === "en" ? "en_US" : "tr_TR",
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";

  return <HotelsClient currentLang={lang} />;
}