"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Gereksiz kelimeleri ve Türkçe ekleri temizleyen fonksiyon
  const cleanSearchQuery = (query: string) => {
    const stopWords = [
      "gezilecek",
      "yerler",
      "mekanlar",
      "nelerdir",
      "nereler",
      "listesi",
      "rehberi",
      "en iyi",
      "nerede",
      "neler",
      "gezilir",
    ];

    const suffixes = ["da", "de", "'da", "'de"]; // Türkçe ekler

    // Unicode normalize et (NFD), küçük harfe çevir ve noktalama kaldır
    let cleaned = query
      .normalize("NFD") // birleşik karakterleri ayırır
      .replace(/[\u0300-\u036f]/g, "") // aksanları temizle
      .toLowerCase()
      .replace(/[.,!?]/g, "");

    // Kelimelere ayır ve ekleri temizle
    let words = cleaned.split(/\s+/).map((word) => {
      suffixes.forEach((suf) => {
        if (word.endsWith(suf)) {
          word = word.slice(0, -suf.length);
        }
      });
      return word;
    });

    // Stopword’leri çıkar
    words = words.filter((word) => !stopWords.includes(word));

    // Tekrar birleştir
    cleaned = words.join(" ").trim();

    return cleaned || query;
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      const optimizedQuery = cleanSearchQuery(search.trim());
      router.push(`/kesfet?q=${encodeURIComponent(optimizedQuery)}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 shadow-md">
        <div className="flex items-center bg-white rounded-[14px] px-4 py-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Şehir, mekan veya deneyim ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}