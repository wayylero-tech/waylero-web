"use client";

import { useEffect, useState } from "react";

export default function ActivitiesPage() {
  const [city, setCity] = useState("istanbul");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setCity("istanbul");
        setLoading(false);
      },
      () => setLoading(false)
    );

    // 🔥 Fade-in trigger
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Yükleniyor...</span>
      </div>
    );
  }

  return (
    <main className="h-screen bg-gray-100 relative">
      <div className="absolute inset-0 z-50 bg-black">

        {/* iframe */}
        <iframe
          src={`https://etkinlik.io/${city}`}
          className="w-full h-full border-none"
          allow="geolocation; fullscreen"
        />

        {/* 💎 PREMIUM BADGE */}
        <a
  href={`https://etkinlik.io/${city}`}
  target="_blank"
  rel="noopener noreferrer"
  className={`
    absolute top-4 right-4 z-50
    flex items-center gap-2
    
    px-3 py-2 sm:px-4 sm:py-2.5
    
    text-[10px] sm:text-xs font-medium
    
    rounded-full
    
    backdrop-blur-lg
    
    bg-white/90   /* 🔥 ARKA PLAN AÇIK */
    text-black    /* 🔥 YAZI SİYAH */
    
    border border-gray-200
    
    shadow-lg
    
    transition-all duration-500
    
    hover:scale-105 hover:bg-white
    
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
  `}
>
  <span className="text-sm sm:text-base transition-transform group-hover:rotate-12">
    🌐
  </span>

  <span className="whitespace-nowrap">
    Etkinlikler Etkinlik.io tarafından sağlanmaktadır →
  </span>
</a>

      </div>
    </main>
  );
}