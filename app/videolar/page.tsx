import { Metadata } from "next";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import VideolarClientPage from "./VideolarClientPage";

// 1. METADATA (Sunucu Tarafında Çalışır)
export async function generateMetadata(): Promise<Metadata> {
  const videos = addSlugs(wayleroLiveVideos);
  const titles = videos.map(v => v.title).slice(0, 5).join(", ");
  const baseUrl = "https://www.waylero.com";

  return {
    title: "Waylero Video | Şehir Rehberi ve Özel Çekimler",
    description: `${titles} ve şehrin en ikonik noktalarını yüksek kalitede izleyin. Waylero ile şehri keşfedin.`,
    alternates: {
      canonical: `${baseUrl}/videolar`,
    },
    openGraph: {
      title: "Waylero Video Galeri",
      description: "Şehrin güzelliklerini video turlarıyla keşfedin.",
      images: [
        {
          url: `https://img.youtube.com/vi/${videos[0]?.youtubeId}/maxresdefault.jpg`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

// 2. ANA SAYFA BİLEŞENİ (MUTLAKA DEFAULT EXPORT OLMALI)
export default function Page() {
  const videos = addSlugs(wayleroLiveVideos);

  // Google için Yapısal Veri (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": videos.map((video, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": video.title,
        "description": `${video.location} bölgesinden çekimler.`,
        "thumbnailUrl": `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
        "uploadDate": "2026-01-01T08:00:00+08:00",
        "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* İstemci tarafı bileşenini çağırıyoruz */}
      <VideolarClientPage />
    </>
  );
}