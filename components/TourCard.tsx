"use client";

import React from "react";
import { useLang } from "../app/context/LanguageContext";

export default function TourCard({
  title,
  price,
  imageUrl,
  link,
  tag,
  rating,
  reviewCount,
  duration,
  features
}: any) {

  const { lang } = useLang();

  const t = {
    tr: {
      perPerson: "Kişi başı",
      reserve: "Rezervasyon Yap",
    },
    en: {
      perPerson: "Per person",
      reserve: "Book Now",
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

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-500 text-[11px]">★★★★★</span>
          <span className="text-[11px] font-semibold text-gray-600">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* TITLE */}
        <h3 className="text-[17px] font-black text-gray-900 line-clamp-2 leading-snug">
          {title?.[lang] ?? title}
        </h3>

        {/* DURATION + FEATURE */}
        <div className="text-[13px] text-gray-500 mt-3 italic font-medium">
          {duration?.[lang]}{" "}
          {features?.[lang]?.length ? `• ${features[lang][0]}` : ""}
        </div>

        {/* PRICE */}
        <div className="mt-auto mb-6">

          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
            {t?.perPerson}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-700">
              {price?.discounted} {price?.currency}
            </span>

            {price?.original && (
              <span className="text-xs text-gray-400 line-through">
                {price.original}
              </span>
            )}
          </div>

        </div>

        {/* CTA */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          <span>{t?.reserve}</span>

          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
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