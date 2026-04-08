import { wayleroLiveVideos, addSlugs } from "@/videos";
import { notFound } from "next/navigation";
import VideoModal from "./VideoModal";
import { Metadata } from "next";

// SEO İçin Metadata Üretici
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  
  // Önemli: Küçük/Büyük harf duyarlılığını kaldırmak için normalize ediyoruz
  const video = videosWithSlugs.find((v: any) => v.slug.toLowerCase() === slug.toLowerCase());

  if (!video) {
    return {
      title: "Video Bulunamadı | Waylero",
      description: "Aradığınız video sistemde bulunamadı."
    };
  }

  return {
    title: `${video.title} | Canlı İzle | Waylero Live`,
    description: `${video.location} konumundaki ${video.title} mekanına ait güncel videoyu Waylero Live ile hemen izleyin.`,
    openGraph: {
      title: video.title,
      description: `${video.location} - Waylero Live Videoları`,
      images: [`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`],
    }
  };
}

// Sayfa İçeriği
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Next.js 15+ standartlarına uygun await
  const { slug } = await params;
  
  // 2. Videoları ve slugları hazırla
  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  
  // 3. Videoyu bul (Normalizasyon ile)
  const video = videosWithSlugs.find((v: any) => v.slug.toLowerCase() === slug.toLowerCase());

  // 4. Eğer bulunamazsa 404 sayfasına at
  if (!video) {
    notFound();
  }

  return (
    <div className="relative">
      <VideoModal video={video} />
    </div>
  );
}