"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { trackSearch } from "@/lib/analytics";
import { useLang } from "@/app/context/LanguageContext";

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { lang } = useLang();

  const t = {
    tr: {
      placeholder: "Şehir, mekan veya etkinlik/konser ara... (Örn: İstanbul'da gezilecek yerler)",
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

  // 🔥 Etkinlik mi?
  const detectIntent = (query: string) => {
    const q = query.toLocaleLowerCase("tr-TR");

    const eventKeywords = [
      "etkinlik", "konser", "festival", "tiyatro", "standup",
      "party", "event", "concert", "show"
    ];

    return eventKeywords.some(k => q.includes(k));
  };

  // 🔥 TÜM ŞEHİRLER
  const cityList = [
    "ADANA","ADIYAMAN","AFYON","AFYONKARAHİSAR","AĞRI","AKSARAY","AMASYA",
    "ANKARA","ANTALYA","ARDAHAN","ARTVİN","AYDIN","BALIKESİR","BARTIN",
    "BATMAN","BAYBURT","BİLECİK","BİNGÖL","BİTLİS","BOLU","BURDUR",
    "BURSA","ÇANAKKALE","ÇANKIRI","ÇORUM","DENİZLİ","DİYARBAKIR","DÜZCE",
    "EDİRNE","ELAZIĞ","ERZİNCAN","ERZURUM","ESKİŞEHİR","GAZİANTEP",
    "GİRESUN","GÜMÜŞHANE","HAKKARİ","HATAY","IĞDIR","ISPARTA",
    "İSTANBUL","İZMİR","KAHRAMANMARAŞ","KARABÜK","KARAMAN","KARS",
    "KASTAMONU","KAYSERİ","KİLİS","KIRIKKALE","KIRKLARELİ","KIRŞEHİR",
    "KOCAELİ","KONYA","KÜTAHYA","MALATYA","MANİSA","MARDİN",
    "MERSİN","MUĞLA","MUŞ","NEVŞEHİR","NİĞDE","ORDU","OSMANİYE",
    "RİZE","SAKARYA","SAMSUN","SİİRT","SİNOP","SİVAS",
    "ŞANLIURFA","ŞIRNAK","TEKİRDAĞ","TOKAT","TRABZON","TUNCELİ",
    "UŞAK","VAN","YALOVA","YOZGAT","ZONGULDAK"
  ];

  // 🔥 GERÇEK şehir yakalama
  const extractCity = (query: string) => {
    const upper = query.toLocaleUpperCase("tr-TR");
    return cityList.find(city => upper.includes(city)) || "";
  };

  // 🔥 Ortak arama fonksiyonu (Enter veya tıklama)
  const performSearch = () => {
    if (!search.trim()) return;

    const query = search.trim();
    trackSearch(query);

    const isEvent = detectIntent(query);
    const city = extractCity(query);

    if (isEvent) {
      router.push(`/aktiviteler?city=${encodeURIComponent(city || query)}`);
    } else {
      router.push(`/kesfet?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  return (
    <div className="mb-6">
      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 shadow-md transition-all focus-within:shadow-lg focus-within:scale-[1.01] duration-300">
        <div className="flex items-center bg-white rounded-[14px] px-4 py-3">
          <Search
            className="w-5 h-5 text-gray-400 mr-3 cursor-pointer"
            onClick={performSearch}
          />
          <input
            type="text"
            placeholder={t.placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
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