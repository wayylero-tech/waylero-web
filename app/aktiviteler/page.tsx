"use client";

import { useEffect, useState } from "react";

export default function ActivitiesPage() {
  const [city, setCity] = useState("istanbul");
  const [loading, setLoading] = useState(true);

  // 📍 Konum alma (basit)
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
      {/* 🔥 Etkinlik.io iframe */}
      <div className="absolute inset-0 z-50 bg-black">
        <iframe
          src={`https://etkinlik.io/${city}`}
          className="w-full h-full border-none"
          allow="geolocation; fullscreen"
        />

        {/* ❌ Ana Sayfaya Dön (www.waylero.com) */}
        <button
          onClick={() => (window.location.href = "https://www.waylero.com/")}
          className="absolute top-4 left-4 bg-white rounded-full p-3 shadow z-50"
        >
          ✕ Ana Sayfaya Dön
        </button>
      </div>
    </main>
  );
}
