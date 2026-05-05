import { Metadata } from "next";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import VideolarClientPage from "./VideolarClientPage";

type Props = {
  params: Promise<{ lang: string }>;
};

// 🌍 Metadata artık direkt params'tan dili alıyor
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = lang === "en" ? "en" : "tr";

  const videos = addSlugs(wayleroLiveVideos);
  const titles = videos.map(v => v.title).slice(0, 5).join(", ");

  const baseUrl = "https://www.waylero.com";
  const image = `${baseUrl}/og/videos.jpg`;

  const t = {
    tr: {
      title: "Waylero Video | Şehir Rehberi ve Özel Çekimler",
      description: `${titles} ve şehrin en ikonik noktalarını keşfedin.`
    },
    en: {
      title: "Waylero Videos | City Guides & Exclusive Footage",
      description: `Watch ${titles} and explore the city's most iconic spots.`
    }
  }[currentLang];

  const url = `${baseUrl}${currentLang === "en" ? "/en" : ""}/videolar`;

  return {
    title: t.title,
    description: t.description,

    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${baseUrl}/tr/videolar`,
        "en-US": `${baseUrl}/en/videolar`,
      },
    },

    openGraph: {
      title: t.title,
      description: t.description,
      url,
      siteName: "Waylero",
      type: "website",
      locale: currentLang === "en" ? "en_US" : "tr_TR",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: t.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [image],
    },

    other: {
      "theme-color": "#000000",
    },
  };
}

export default async function Page({ params }: Props) {
  const { lang } = await params; // ✅ Dili buradan çekiyoruz
  const currentLang = lang === "en" ? "en" : "tr";
  const videos = addSlugs(wayleroLiveVideos);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": videos.map((video, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": video.title,
        "description": currentLang === "tr" 
          ? `${video.title} - Waylero özel çekimler.`
          : `${video.title} - Waylero exclusive footage.`,
        "thumbnailUrl": `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ✅ Client tarafına temiz temiz gönderiyoruz */}
      <VideolarClientPage lang={currentLang} initialVideos={videos} />
    </>
  );
}