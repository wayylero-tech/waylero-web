"use client";

import { useEffect, useState } from "react";

type ActiveView = "bands" | "etkinlik" | "bubilet" | null;

export default function ActivitiesPage() {
  const [city, setCity] = useState("istanbul");
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [loading, setLoading] = useState(true);

  // 📍 Konumdan şehir alma (basit versiyon)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        // 🔥 İstersen burada reverse geocoding bağlarız
        setCity("istanbul");
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const urls = {
    etkinlik: `https://etkinlik.io/${city}`,
    bands: `https://www.bandsintown.com/?location=${city}`,
    bubilet: `https://www.bubilet.com.tr/sehir/${city}`,
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Yükleniyor...</span>
      </div>
    );
  }

  return (
    <main className="h-screen bg-gray-100 relative">
      {/* 🔥 WEBVIEW (iframe) */}
      {activeView && (
        <div className="absolute inset-0 z-50 bg-black">
          <iframe
            src={urls[activeView]}
            className="w-full h-full border-none"
            allow="geolocation; fullscreen"
          />

          {/* ❌ KAPAT */}
          <button
            onClick={() => setActiveView(null)}
            className="absolute top-4 left-4 bg-white rounded-full p-3 shadow"
          >
            ✕
          </button>
        </div>
      )}

      {/* 📦 KARTLAR */}
      {!activeView && (
<div className="h-full flex flex-col gap-4 px-4 py-4 max-w-4xl mx-auto">
          <ActivityCard
            title="BandsInTown"
            color="bg-green-600"
            onClick={() => setActiveView("bands")}
          />
          <ActivityCard
            title="Etkinlik.io"
            color="bg-blue-600"
            onClick={() => setActiveView("etkinlik")}
          />
          <ActivityCard
            title="Bubilet"
            color="bg-orange-500"
            onClick={() => setActiveView("bubilet")}
          />
        </div>
      )}
    </main>
  );
}

function ActivityCard({
  title,
  color,
  onClick,
}: {
  title: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} flex-1 rounded-2xl text-white text-xl font-semibold flex items-center justify-center`}
    >
      {title} sitesine git
    </button>
  );
}
