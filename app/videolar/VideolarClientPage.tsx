"use client";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import { useRouter } from "next/navigation";
import { useLang } from "../context/LanguageContext";

export default function VideolarClientPage() {
  const router = useRouter();
  const { lang } = useLang();
  const videos = addSlugs(wayleroLiveVideos);

  // Dil çevirilerini bir objede topluyoruz
  const translations = {
    tr: {
      title: "VİDEOLAR",
      subtitle: "Şehrin Ruhunu Videolarla Keşfet",
      locationLabel: "📍"
    },
    en: {
      title: "VIDEOS",
      subtitle: "Discover the Soul of the City Through Video",
      locationLabel: "📍"
    }
  };

  // Mevcut dile göre çeviriyi seç (yoksa TR default)
  const t = translations[lang as "tr" | "en"] || translations.tr;

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path}`;
  };

  return (
    <main className="max-w-6xl mx-auto px-10 md:px-20 py-16 bg-white min-h-screen">
      
      {/* 1. Header Kısmı */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">
          {t.title}
        </h1>
        <div className="w-16 h-1 bg-red-600 mx-auto mt-4"></div>
        <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mt-6 tracking-[0.4em] uppercase">
          {t.subtitle}
        </p>
      </header>

      {/* 2. Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {videos.map(video => (
          <article 
            key={video.id} 
            onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))}
            className="cursor-pointer flex flex-col gap-4 w-full group mx-auto max-w-[260px]"
          >
            {/* 3. Video Konteyneri */}
            <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-lg border-[3px] border-white group-hover:shadow-2xl group-hover:scale-[1.05] transition-all duration-500 ease-in-out bg-gray-50">
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
                alt={video.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />

              {/* 4. Play İkonu */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                  <svg className="w-7 h-7 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 6v12l10-6z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 5. Video Bilgileri */}
            <div className="text-center">
              <h2 className="font-black text-sm md:text-base uppercase tracking-tighter text-gray-800 line-clamp-1 group-hover:text-red-600">
                {video.title}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">
                {t.locationLabel} {video.location}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}