"use client";

import React from "react";
import { useLang } from "../app/context/LanguageContext";

export default function TourCard({
  title,
  imageUrl,
  link,
  tag,
  duration,
  features,
  city // <-- city'yi buraya ekledik
}: any) {

  const { lang } = useLang();

  const t = {
    tr: {
      reserve: "Fiyat bilgisi ve turları incelemek için tıkla",
      durationLabel: "Süre:",
    },
    en: {
      reserve: "Click to view prices and tours",
      durationLabel: "Duration:",
    },
  }[lang as "tr" | "en"];

  const safeImageUrl = imageUrl?.startsWith("/")
    ? imageUrl
    : `/${imageUrl}`;

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden h-[560px] hover:shadow-2xl transition-all duration-500 hover:border-blue-500">

      {/* IMAGE */}
      <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
        <img
          src={safeImageUrl}
          alt={title?.[lang] ?? title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {tag && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
            {tag?.[lang]}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* TITLE */}
        <h3 className="text-[17px] font-black text-gray-900 line-clamp-2 leading-snug">
          {title?.[lang] ?? title}
        </h3>

          {/* YENİ EKLEDİĞİMİZ ŞEHİR KISMI */}
        <div className="text-[12px] font-bold text-blue-600 uppercase tracking-widest mt-2">
          {city}
        </div>  


        {/* DURATION + FEATURE */}
        <div className="text-[13px] text-gray-500 mt-3 italic font-medium mb-6">
          <span className="font-bold text-gray-700">{t?.durationLabel}</span> {duration?.[lang]}{" "}
          {features?.[lang]?.length ? `• ${features[lang][0]}` : ""}
        </div>

        {/* CTA */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-bold py-5 px-3 rounded-2xl transition-all shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] text-center leading-tight"
        >
          <span>{t?.reserve}</span>

          <svg
            className="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </a>

      </div>
    </div>
  );
}