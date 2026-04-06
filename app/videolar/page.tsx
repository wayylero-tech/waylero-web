"use client";
import { wayleroLiveVideos } from "@/videos";
import { useLang } from "../context/LanguageContext";
import { useState, useEffect } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

export default function VideolarPage() {
  const { lang } = useLang();
  const [players, setPlayers] = useState<{ [id: number]: any }>({}); // video player referansları

  const t = {
    tr: {
      pageTitle: "Waylero Live - Keşfet ve İzle",
      header: "VİDEOLAR",
      subHeader: "En yeni videolarla dünyayı keşfedin",
      locationDefault: "Konya, Türkiye"
    },
    en: {
      pageTitle: "Waylero Live - Explore and Watch",
      header: "VIDEOS",
      subHeader: "Discover the world through the latest videos",
      locationDefault: "Konya, Turkey"
    }
  }[lang as "tr" | "en"] || {
    pageTitle: "Waylero Live - Explore and Watch",
    header: "VIDEOS",
    subHeader: "Discover the world through the latest videos",
    locationDefault: "Konya, Turkey"
  };

  useEffect(() => {
    document.title = t.pageTitle;
  }, [t.pageTitle]);

  const handlePlay = (id: number) => {
  Object.keys(players).forEach(key => {
    const keyNum = parseInt(key);  // key artık number
    if (keyNum !== id) {
      players[keyNum]?.pauseVideo?.();
    }
  });
};

  const opts: YouTubeProps['opts'] = {
    width: "100%",
    height: "530",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 bg-white min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
          {t.header} 
          <span className="text-red-600 ml-2 italic">LIVE</span>
        </h1>
        <p className="text-gray-500 text-sm font-bold mt-2 tracking-widest uppercase italic">
          {t.subHeader}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
        {wayleroLiveVideos.map(video => (
          <article key={video.id} className="flex flex-col gap-4 w-full max-w-[300px]">
            <div className="shadow-2xl rounded-[30px] overflow-hidden bg-black border border-gray-100 hover:scale-[1.03] transition-transform duration-500">
              <YouTube
                videoId={video.youtubeId}
                opts={opts}
                onReady={(event) => {
                  setPlayers(prev => ({ ...prev, [video.id]: event.target }));
                }}
                onPlay={() => handlePlay(video.id)}
              />
            </div>

            <div className="text-center px-2">
              <h2 className="font-black text-base uppercase tracking-tighter text-gray-900 leading-tight">
                {video.title}
              </h2>
              <p className="text-[11px] text-red-600 font-black tracking-[0.2em] uppercase mt-1">
                {video.location === "Konya, Türkiye" ? t.locationDefault : video.location}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}