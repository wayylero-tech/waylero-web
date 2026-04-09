import { wayleroLiveVideos, addSlugs } from "@/videos";
import { notFound } from "next/navigation";
import VideoModal from "./VideoModal";
import { Metadata } from "next";

// SEO İçin Metadata Üretici (Zaten yapmıştın, burası sağlam)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  const baseUrl = "https://www.waylero.com";
  
  const video = videosWithSlugs.find((v: any) => v.slug.toLowerCase() === slug.toLowerCase());

  if (!video) {
    return { title: "Video Bulunamadı | Waylero" };
  }

  return {
    title: `${video.title} | Canlı İzle | Waylero Live`,
    description: `${video.location} konumundaki ${video.title} mekanına ait güncel videoyu Waylero Live ile hemen izleyin.`,
    alternates: {
      canonical: `${baseUrl}/videolar/${video.slug}`,
      languages: {
        "tr-TR": `${baseUrl}/videolar/${video.slug}`,
        "en-US": `${baseUrl}/en/videolar/${video.slug}`,
      },
    },
    openGraph: {
      title: video.title,
      description: `${video.location} - Waylero Live Videoları`,
      images: [`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`],
      url: `${baseUrl}/videolar/${video.slug}`,
    },
  };
}

// Sayfa İçeriği
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  const video = videosWithSlugs.find((v: any) => v.slug.toLowerCase() === slug.toLowerCase());

  if (!video) {
    notFound();
  }

  // 🔹 BURASI KRİTİK: Google Botları için JSON-LD Şeması
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${video.title} | Waylero Live`,
    "description": `${video.location} konumundaki ${video.title} mekanına ait güncel çekim.`,
    "thumbnailUrl": [
      `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
    ],
    "uploadDate": "2026-04-09T09:00:00+03:00", // Bugünün tarihi veya videonun tarihi
    "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
    "contentUrl": `https://www.waylero.com/videolar/${video.slug}`,
  };

  return (
    <div className="relative">
      {/* 🔹 Şemayı HTML'e gömüyoruz (Botlar bunu anında okur) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <VideoModal video={video} />
    </div>
  );
}