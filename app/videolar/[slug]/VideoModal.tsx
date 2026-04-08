"use client";
import YouTube from "react-youtube";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VideoModal({ video }: { video: any }) {
  const router = useRouter();

  // Modal açıldığında Header'ı ve kaydırmayı gizle
  useEffect(() => {
    // Header'ın ID'si veya class'ı neyse onu seçmemiz lazım. 
    // Genel olarak "header" tagini saklayalım:
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    
    // Arka planın kaymasını engelle
    document.body.style.overflow = "hidden";

    return () => {
      // Modal kapanırken geri getir
      if (header) header.style.display = "block";
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0a0a0a] backdrop-blur-2xl">
      
      {/* KAPATMA BUTONU: Sağ üstte devasa ve görünür */}
      <button 
        onClick={() => router.push('/videolar')}
        className="fixed top-6 right-8 text-white text-7xl font-thin hover:text-red-500 transition-all duration-300 z-[10001]"
      >
        ×
      </button>

      {/* VİDEO ALANI */}
      <div className="w-full max-w-5xl px-4 animate-in fade-in zoom-in duration-300">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-black">
          <YouTube
            videoId={video.youtubeId}
            opts={{
              width: "100%",
              height: "600",
              playerVars: { autoplay: 1, modestbranding: 1 }
            }}
            className="w-full aspect-video"
          />
          <div className="bg-white p-8">
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              {video.title}
            </h1>
            <p className="text-red-600 font-black mt-2 uppercase tracking-widest text-sm flex items-center gap-2">
              📍 {video.location}
            </p>
          </div>
        </div>
      </div>

      {/* Boşluğa tıklayınca kapatma katmanı */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => router.push('/videolar')}
      />
    </div>
  );
}