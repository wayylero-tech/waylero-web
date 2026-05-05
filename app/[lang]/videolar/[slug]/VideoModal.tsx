"use client";
import YouTube from "react-youtube";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { X, MapPin, Share2 } from "lucide-react";

interface VideoModalProps {
  video: any;
  lang: string; // ✅ Üst bileşenden dili alıyoruz
}

export default function VideoModal({ video, lang }: VideoModalProps) {
  const router = useRouter();

  // Sayfa kilitleme ve Header gizleme
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    document.body.style.overflow = "hidden";

    return () => {
      if (header) header.style.display = "block";
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🌍 Kapatma linkini dile göre ayarla
  const closeLink = lang === "tr" ? "/videolar" : `/${lang}/videolar`;

  const translations = {
    tr: {
      share: "PAYLAŞ",
      copied: "Bağlantı kopyalandı!",
    },
    en: {
      share: "SHARE",
      copied: "Link copied!",
    }
  };

  const t = translations[lang as "tr" | "en"] || translations.tr;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ 
        title: video.title, 
        url: window.location.href 
      }).catch(() => null);
    } else {
      // Tarayıcı paylaşımı desteklemiyorsa linki kopyala
      navigator.clipboard.writeText(window.location.href);
      alert(t.copied);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505]/95 backdrop-blur-3xl p-2 md:p-10">
      
      {/* KAPATMA BUTONU */}
      <button 
        onClick={() => router.push(closeLink)}
        className="fixed top-4 right-4 text-white/20 hover:text-white transition-all z-[10001] p-2"
      >
        <X size={28} strokeWidth={1} />
      </button>

      {/* ANA KAPSAYICI */}
      <div className="w-full max-w-[1000px] animate-in fade-in zoom-in duration-500">
        <div className="rounded-[2.5rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
          
          {/* VİDEO OYNATICI */}
          <div className="relative aspect-video w-full bg-black">
            <YouTube
              videoId={video.youtubeId}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: { 
                  autoplay: 1, 
                  modestbranding: 1,
                  rel: 0,
                  controls: 1 
                }
              }}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* BİLGİ PANELİ */}
          <div className="bg-white py-4 px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[8px] font-black uppercase tracking-tighter animate-pulse">
                    LIVE
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 font-bold uppercase tracking-[0.15em] text-[9px] italic">
                    <MapPin size={10} />
                    {video.location}
                  </div>
                </div>

                <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter leading-tight italic">
                  {video.title}
                </h1>
              </div>

              {/* Paylaş Butonu */}
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest hover:bg-red-600 transition-all active:scale-95"
              >
                <Share2 size={14} />
                <span>{t.share}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Arka plana tıklayınca kapat */}
      <div 
        className="absolute inset-0 -z-10 cursor-zoom-out" 
        onClick={() => router.push(closeLink)}
      />
    </div>
  );
}