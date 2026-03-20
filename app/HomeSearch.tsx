"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Sadece Enter'a basıldığında ve input boş değilse çalışır
    if (e.key === "Enter" && search.trim()) {
      /**
       * 💡 ÖNEMLİ: 
       * Temizleme işlemini (cleanSearchQuery) burada değil, 
       * hedef sayfada (KesfetClient) yapıyoruz. 
       * Böylece URL'de kullanıcının yazdığı orijinal metin görünür.
       */
      router.push(`/kesfet?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 shadow-md">
        <div className="flex items-center bg-white rounded-[14px] px-4 py-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Şehir, mekan veya deneyim ara... (Örn: Ankara'da)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
      
      {/* İsteğe bağlı: Küçük bir yardımcı metin eklenebilir */}
      <p className="mt-2 text-xs text-gray-400 px-2 italic">
        İpucu: "Paris'te gezilecek yerler" gibi doğal cümlelerle arayabilirsin.
      </p>
    </div>
  );
}