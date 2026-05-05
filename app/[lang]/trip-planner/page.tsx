import TripPlannerClient from "./TripPlannerClient";
import { Suspense } from "react";

const translations = {
  tr: {
    title: "Yapay Zeka Destekli Gezi Planlayıcı | Explore",
    description: "Mükemmel rotanı oluştur, harita üzerinde gez ve PDF olarak indir.",
  },
  en: {
    title: "AI-Powered Trip Planner | Explore",
    description: "Create your perfect itinerary, explore on the map, and download as PDF.",
  },
};

type Props = {
  params: Promise<{ lang: string }>;
};

// ✅ METADATA
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const currentLang = lang === "en" ? "en" : "tr";
  const t = translations[currentLang];

  const baseUrl = "https://www.waylero.com";
  const path = "/trip-planner";

  return {
    title: t.title,
    description: t.description,

    // ✅ CANONICAL
    alternates: {
      canonical: `${baseUrl}/${currentLang}${path}`,
      languages: {
        tr: `${baseUrl}/tr${path}`,
        en: `${baseUrl}/en${path}`,
      },
    },

    // ✅ OPEN GRAPH
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${baseUrl}/${currentLang}${path}`,
      siteName: "Waylero",
      locale: currentLang === "en" ? "en_US" : "tr_TR",
      type: "website",
    },

    // ✅ TWITTER
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
    },
  };
}

// ✅ PAGE
export default async function Page({ params }: Props) {
  const { lang } = await params;
  const currentLang = lang === "en" ? "en" : "tr";

  return (
    <main>
      {/* 2. Bileşeni Suspense ile sarmala */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <TripPlannerClient lang={currentLang} />
      </Suspense>
    </main>
  );
}