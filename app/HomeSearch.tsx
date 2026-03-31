
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { trackSearch } from "@/lib/analytics";
import { useLang } from "@/app/context/LanguageContext";
// ❌ cleanSearchQuery'yi buradan kaldırıyoruz çünkü aramayı fazla "buduyor" olabilir

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { lang } = useLang();

  const t = {
    tr: {
      placeholder: "Şehir, mekan veya deneyim ara... (Örn: Ankara'da)",
      helper: 'İpucu: "Paris\'te gezilecek yerler" gibi doğal cümlelerle arayabilirsin.',
    },
    en: {
      placeholder: "Search city, place or experience... (e.g. In London)",
      helper: 'Tip: You can search with natural phrases like "Places to visit in Paris".',
    },
    de: {
      placeholder: "Suche nach Stadt, Ort oder Erlebnis... (z. B. In Berlin)",
      helper: 'Tipp: Du kannst mit natürlichen Sätzen suchen, wie „Sehenswürdigkeiten in Paris“.',
    }
  }[lang];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      // 1. Analytics için orijinal aramayı gönder
      trackSearch(search.trim()); 
      
      // 2. 🔥 KRİTİK DEĞİŞİKLİK: 
      // Kelimeyi temizlemeden (cleanSearchQuery yapmadan) direkt gönderiyoruz.
      // Keşfet sayfası kendi içindeki fuzzyMatch ile dilli aramayı zaten yapacak.
      // Parametre isminin "q" olduğundan emin ol (Keşfet sayfan "q" bekliyor)
      router.push(`/kesfet?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 shadow-md transition-all focus-within:shadow-lg focus-within:scale-[1.01] duration-300">
        <div className="flex items-center bg-white rounded-[14px] px-4 py-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder={t.placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 font-medium"
          />
        </div>
      </div>
      
      <p className="mt-2 text-[11px] text-gray-400 px-2 italic opacity-80">
        {t.helper}
      </p>
    </div>
  );
}
