import { Metadata } from "next";
import { headers } from "next/headers";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import VideolarClientPage from "./VideolarClientPage";

// 🌍 Dil Yakalama Fonksiyonu
async function getLanguage() {
  const h = await headers();
  const xLang = h.get("x-url-lang"); 
  const referer = h.get("referer") || "";
  
  if (xLang === "en" || referer.includes("/en/")) return "en";
  return "tr";
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const videos = addSlugs(wayleroLiveVideos);
  const titles = videos.map(v => v.title).slice(0, 5).join(", ");
  const baseUrl = "https://www.waylero.com";


  const t = {
    tr: {
      title: "Waylero Video | Şehir Rehberi ve Özel Çekimler",
      description: `${titles} ve şehrin en ikonik noktalarını keşfedin. Waylero ile şehri yüksek kalitede izleyin.`
    },
    en: {
      title: "Waylero Videos | City Guides & Exclusive Footage",
      description: `Watch ${titles} and the city's most iconic spots in high quality. Explore the city with Waylero.`
    }
  }[lang];

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `${baseUrl}${lang === "en" ? "/en" : ""}/videolar`,
      languages: {
        'tr-TR': `${baseUrl}/videolar`,
        'en-US': `${baseUrl}/en/videolar`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${baseUrl}${lang === "en" ? "/en" : ""}/videolar`,
      siteName: "Waylero",
      images: [
        {
          url: `https://img.youtube.com/vi/${videos[0]?.youtubeId}/maxresdefault.jpg`,
          width: 1200,
          height: 630,
        },
      ],
      locale: lang === "en" ? "en_US" : "tr_TR",
      type: "website",
    },
  };
}

export default async function Page() {
  const lang = await getLanguage();
  const videos = addSlugs(wayleroLiveVideos);

  // 📹 Video SEO (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": videos.map((video, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": video.title,
        "description": lang === "tr" 
          ? `${video.title} - Waylero özel çekimleriyle şehir turu ve gezi rehberi.`
          : `${video.title} - City tour and travel guide with Waylero exclusive footage.`,
        "thumbnailUrl": [
          `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
        ],
        "uploadDate": "2024-01-01T08:00:00+03:00", 
        "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
        "contentUrl": `https://www.youtube.com/watch?v=${video.youtubeId}`,
      }
    }))
  };

  return (
    <>
      {/* JSON-LD Sunucuda basılır, SEO için mükemmeldir */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* DİKKAT: lang={lang} prop'unu ekledim! 
          VideolarClientPage içerisinde bu prop'u alıp kullanmalısın.
      */}
      <VideolarClientPage lang={lang} initialVideos={videos} />
    </>
  );
}