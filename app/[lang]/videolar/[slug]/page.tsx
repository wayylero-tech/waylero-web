import { wayleroLiveVideos, addSlugs } from "@/videos";
import { notFound } from "next/navigation";
import VideoModal from "./VideoModal";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; lang: string }>;
};

const getLang = (lang: string) => (lang === "en" ? "en" : "tr");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const currentLang = getLang(lang);

  console.log("--- METADATA LOG BAŞLADI ---");
  console.log("Gelen Parametreler:", { slug, lang });

  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  
  // Aranan slug ile listedeki slugları karşılaştır
  const video = videosWithSlugs.find(
    (v: any) => v.slug && v.slug.toLowerCase() === slug?.toLowerCase()
  );

  if (!video) {
    console.error("❌ METADATA: Video bulunamadı. Aranan Slug:", slug);
    return {
      title: "Video Not Found | Waylero",
    };
  }

  console.log("✅ METADATA: Video bulundu:", video.title, "Slug:", video.slug);

  const baseUrl = "https://www.waylero.com";
  const t = {
    tr: {
      title: `${video.title} | Canlı İzle | Waylero Live`,
      desc: `${video.location} konumundaki ${video.title} mekanına ait güncel videoyu hemen izleyin.`
    },
    en: {
      title: `${video.title} | Watch Live | Waylero Live`,
      desc: `Watch the latest footage of ${video.title} in ${video.location} with Waylero Live.`
    }
  }[currentLang];

  const url = `${baseUrl}${currentLang === "en" ? "/en" : ""}/videolar/${video.slug}`;
  const image = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return {
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${baseUrl}/videolar/${video.slug}`,
        "en-US": `${baseUrl}/en/videolar/${video.slug}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.desc,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: video.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.desc,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug, lang } = await params;
  const currentLang = getLang(lang);

  console.log("--- PAGE LOG BAŞLADI ---");
  console.log("Gelen URL Slug:", slug);

  // 1. Ham veriyi kontrol et (Eğer burada title yoksa slug oluşmaz)
  // console.log("Ham Veri İlk Kayıt:", wayleroLiveVideos[0]);

  // 2. addSlugs sonrası durumu kontrol et
  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  
  console.log("İlk 3 Video Slug Durumu:");
  videosWithSlugs.slice(0, 3).forEach((v: any, i: number) => {
    console.log(`${i+1}. Başlık: ${v.title} -> Oluşan Slug: ${v.slug}`);
  });

  const video = videosWithSlugs.find(
    (v: any) => v.slug && v.slug.toLowerCase() === slug?.toLowerCase()
  );

  if (!video) {
    console.error("❌ PAGE: Video eşleşmedi! 404'e yönlendiriliyor.");
    notFound();
  }

  console.log("✅ PAGE: Video başarıyla yüklendi:", video.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${video.title} | Waylero Live`,
    "description": currentLang === "tr" 
      ? `${video.location} konumundaki ${video.title} mekanına ait güncel çekim.`
      : `Latest footage of ${video.title} in ${video.location}.`,
    "thumbnailUrl": [
      `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
    ],
    "uploadDate": "2026-04-09T09:00:00+03:00",
    "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
    "contentUrl": `https://www.waylero.com${currentLang === "en" ? "/en" : ""}/videolar/${video.slug}`,
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoModal video={video} lang={currentLang} />
    </div>
  );
}