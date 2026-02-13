"use client";

import Link from "next/link";

export default function PlaceCard({ region, citySlug, place }: any) {
  // Bu versiyon hiç resim datası import etmez, build hatası çıkarmaz.
  const detailUrl = `/kesfet/${region}/${citySlug}/${place.slug}`;

  return (
    <Link
      href={detailUrl}
      className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all p-4"
    >
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
        <span className="text-2xl">📍</span>
      </div>
      <div className="font-bold text-gray-800">
        {place?.name?.tr || "Mekan Adı"}
      </div>
    </Link>
  );
}