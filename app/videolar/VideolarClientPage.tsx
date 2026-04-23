"use client";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import { useRouter } from "next/navigation";
import { useLang } from "../context/LanguageContext";
import { Play, MapPin, Sparkles, Clapperboard, ChevronRight } from "lucide-react";

export default function VideolarClientPage() {
  const router = useRouter();
  const { lang } = useLang();
  const videos = addSlugs(wayleroLiveVideos);

  const translations = {
    tr: {
      badge: "CANLI KEŞİF",
      title: "VİDEOLAR",
      subtitle: "Şehrin ritmini dikey kadrajdan izleyin",
      watchBtn: "Hemen İzle"
    },
    en: {
      badge: "LIVE DISCOVER",
      title: "VIDEOS",
      subtitle: "Watch the rhythm of the city in vertical frame",
      watchBtn: "Watch Now"
    }
  };

  const t = translations[lang as "tr" | "en"] || translations.tr;

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path}`;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION: Waylero Signature Diagonal Header */}
      <section className="pt-24 pb-40 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center">
            {/* Üst Küçük Badge */}
            <div className="inline-flex items-center gap-2 mb-6 text-red-600 bg-red-50 px-4 py-1.5 rounded-xl border border-red-100 shadow-sm">
              <Clapperboard size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.badge}</span>
            </div>
            
            {/* Dev Başlık */}
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tighter uppercase leading-none">
              {t.title}
            </h1>
            
            {/* Alt Başlık */}
            <p className="text-gray-500 text-[11px] md:text-xs font-black tracking-[0.5em] uppercase opacity-80 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gray-300"></span>
              {t.subtitle}
              <span className="w-8 h-[1px] bg-gray-300"></span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. VIDEO GRID SECTION */}
      <section className="container mx-auto px-6 -mt-20 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {videos.map((video, index) => (
            <article 
              key={video.id} 
              onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))}
              className="group cursor-pointer flex flex-col gap-6"
            >
              {/* Video Thumbnail (Shorts Card) */}
              <div className="relative aspect-[9/16] rounded-[3rem] overflow-hidden shadow-sm border-[6px] border-white group-hover:shadow-2xl group-hover:-translate-y-4 transition-all duration-500 ease-out bg-gray-100">
                
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Overlay: Karanlık Gradyan */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Play Button: Floating Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 group-hover:border-red-600 transition-all duration-500">
                    <Play className="text-white fill-white ml-1" size={24} />
                  </div>
                </div>

                {/* Video Sırası (Badge) */}
                <div className="absolute top-6 left-6">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                    <Sparkles size={12} className="text-yellow-400" />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">LIVE #{index + 1}</span>
                  </div>
                </div>

                {/* Bottom Info inside card (Mobile-like) */}
                <div className="absolute bottom-8 left-8 right-8 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">{t.watchBtn}</span>
                   <div className="flex items-center justify-between mt-1">
                      <span className="font-serif font-bold text-lg">{video.location}</span>
                      <ChevronRight size={18} />
                   </div>
                </div>
              </div>

              {/* Video Info (Under Card) */}
              <div className="px-4 text-center group-hover:transform group-hover:scale-105 transition-all">
                <h2 className="font-serif font-bold text-xl text-gray-900 leading-tight mb-2 group-hover:text-red-600 transition-colors">
                  {video.title}
                </h2>
                <div className="flex items-center justify-center gap-1.5 text-gray-400">
                  <MapPin size={12} className="text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">{video.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Decorative Background Element */}
      <div className="fixed top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-50 rounded-full blur-[120px] -z-10 opacity-60" />
    </main>
  );
}