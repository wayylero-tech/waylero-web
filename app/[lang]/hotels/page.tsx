import HotelsClient from "./HotelsClient";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang?: string }>;
};

const BASE_URL = "https://www.waylero.com";

// Global içerik yönetimi
const content = {
  tr: {
    title: "Oteller ve Konaklama | Dünya Genelinde Otel Ara | Waylero",
    description:
      "Dünya genelinde otelleri ve konaklama seçeneklerini keşfedin. Popüler destinasyonlarda otelleri karşılaştırın ve rezervasyon seçeneklerini inceleyin.",
    path: "/tr/hotels",
    locale: "tr_TR",
  },
  en: {
    title: "Hotels & Accommodation | Search Hotels Worldwide | Waylero",
    description:
      "Explore hotels and accommodation worldwide. Compare hotels in popular destinations and discover booking options with Waylero.",
    path: "/en/hotels",
    locale: "en_US",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";
  const t = content[lang];

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `${BASE_URL}${t.path}`,
      languages: {
        "tr-TR": `${BASE_URL}${content.tr.path}`,
        "en-US": `${BASE_URL}${content.en.path}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${BASE_URL}${t.path}`,
      siteName: "Waylero",
      type: "website",
      locale: t.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";
  const t = content[lang];

  // Global Otel Arama Sayfası Şeması
 const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": t.title,
  "description": t.description,
  "url": `${BASE_URL}${t.path}`,
  "publisher": {
    "@type": "Organization",
    "name": "Waylero",
    "url": BASE_URL
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === "en" ? "Home" : "Anasayfa",
        "item": `${BASE_URL}${lang === "en" ? "/en" : "/tr"}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": lang === "en" ? "Hotels" : "Oteller",
        "item": `${BASE_URL}${t.path}`
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
      <HotelsClient currentLang={lang} />
    </>
  );
}