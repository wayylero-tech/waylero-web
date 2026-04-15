import { Metadata } from "next";
import { headers } from "next/headers";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import VideolarClientPage from "./VideolarClientPage";

// 🌍 Dil Yakalama: Daha esnek hale getirdik
async function getLanguage() {
  const h = await headers();
  // Middleware'den gelen header'ları kontrol et
  const currentPath = h.get("x-url") || h.get("referer") || ""; 
  const xLang = h.get("x-url-lang"); // Eğer middleware setliyorsa en garanti yol budur
  
  if (xLang === "en" || currentPath.includes("/en/")) return "en";
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
      // 🌍 Google'a diğer dil versiyonunu da haber veriyoruz (Hreflang mantığı)
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": videos.map((video, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": video.title,
        "description": `${video.title} - ${video.location || 'Türkiye'} bölgesinden harika şehir manzaraları ve Waylero özel çekimleri.`,
        "thumbnailUrl": [
          `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
        ],
        "uploadDate": "2024-01-01T08:00:00+03:00", 
        "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
        "contentUrl": `https://www.youtube.com/watch?v=${video.youtubeId}`,
        "interactionCount": "1250",
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
<VideolarClientPage />
    </>
  );
}