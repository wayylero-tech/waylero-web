"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/app/context/LanguageContext"; // 🔥 Dil beyni eklendi

export default function BlogSliderCard({ items }: { items: any[] }) {
  const { lang } = useLang(); // 🔥 Mevcut dili alıyoruz
  const [index, setIndex] = useState(0);

  // 🔥 URL YÖNETİCİSİ: Linki dile göre hazırlar
  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  useEffect(() => {
    if (!items || !items.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [items]);

  if (!items || !items.length) return null;

  const p = items[index];

  // 🔥 Çeviri Kontrolü: Obje içindeki dile göre başlık ve özet seçimi
  const displayTitle = typeof p.title === 'object' 
    ? (p.title[lang] || p.title['tr']) 
    : p.title;

  const displaySummary = typeof p.summary === 'object' 
    ? (p.summary[lang] || p.summary['tr']) 
    : (p.summary || p.excerpt); // Bazı yerlerde summary yerine excerpt olabilir diye fallback koydum

  return (
    <Link
      // 🔥 Haber linkini dile duyarlı hale getirdik
      href={getLocalizedLink(`/haber/${p.slug}`)}
      className="group relative h-72 rounded-3xl overflow-hidden shadow-lg block"
    >
      <img
        src={p.image}
        alt={displayTitle}
        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 p-6 text-white">
        <h3 className="text-xl font-bold leading-snug">
          {displayTitle}
        </h3>
        {displaySummary && (
          <p className="text-sm mt-2 opacity-90 line-clamp-2">
            {displaySummary}
          </p>
        )}
      </div>
    </Link>
  );
}