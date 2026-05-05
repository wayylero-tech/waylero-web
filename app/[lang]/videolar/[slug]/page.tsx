import { wayleroLiveVideos, addSlugs } from "@/videos";
import { notFound } from "next/navigation";
import VideoModal from "./VideoModal";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; lang: string }>;
};

// 🌍 Yardımcı Dil Fonksiyonu (Parametreden dili temizce ayıklar)
const getLang = (lang: string) => (lang === "en" ? "en" : "tr");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const currentLang = getLang(lang);

  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  const baseUrl = "https://www.waylero.com";

  const video = videosWithSlugs.find(
    (v: any) => v.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!video) {
    return {
      title: "Video Not Found | Waylero",
      description: "Video not found",
    };
  }

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
      siteName: "Waylero",
      type: "video.other",
      locale: currentLang === "en" ? "en_US" : "tr_TR",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: video.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.desc,
      images: [image],
      creator: "@waylero",
    },

    other: {
      "theme-color": "#000000",
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug, lang } = await params;
  const currentLang = getLang(lang);
  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  const video = videosWithSlugs.find((v: any) => v.slug.toLowerCase() === slug.toLowerCase());

  if (!video) notFound();

  // 🔹 JSON-LD Şeması (Dile duyarlı hale getirildi)
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
      
      {/* VideoModal'a dili de gönderiyoruz ki içindeki butonlar da değişsin */}
      <VideoModal video={video} lang={currentLang} />
    </div>
  );
}