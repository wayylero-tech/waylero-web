"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogSliderCard({ items }: { items: any[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [items]);

  if (!items.length) return null;

  const p = items[index];

  return (
    <Link
      href={`/haber/${p.slug}`}
      className="group relative h-72 rounded-3xl overflow-hidden shadow-lg block"
    >
      <img
        src={p.image}
        alt={p.title}
        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 p-6 text-white">
        <h3 className="text-xl font-bold leading-snug">
          {p.title}
        </h3>
        <p className="text-sm mt-2 opacity-90 line-clamp-2">
          {p.summary}
        </p>
      </div>
    </Link>
  );
}
