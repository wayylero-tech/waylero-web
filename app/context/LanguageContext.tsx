"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; 

type Language = "tr" | "en" | "de";

const LanguageContext = createContext({
  lang: "tr" as Language,
  setLang: (lang: Language) => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>("tr");
  const router = useRouter();
  const pathname = usePathname(); // 🔥 URL'yi takip etmek için ekledik

  useEffect(() => {
    // 1. URL'DEN DİLİ OKU (Öncelik URL'dedir kanka)
    // Eğer URL /en/ ile başlıyorsa dili 'en' yap
    if (pathname.startsWith('/en')) {
      setLang('en');
    } else if (pathname.startsWith('/de')) {
      setLang('de');
    } else {
      // 2. Eğer URL'de dil yoksa (Yani 1300 orijinal indeksimizse), LocalStorage veya Cookie bak
      const savedLang = localStorage.getItem("waylero-lang") as Language;
      if (savedLang) {
        setLang(savedLang);
      } else {
        setLang("tr"); // Tertemiz başlangıç
      }
    }
  }, [pathname]); // URL her değiştiğinde kontrol et kanka

  const changeLang = (newLang: Language) => {
    // 1. State'i güncelle
    setLang(newLang);
    
    // 2. Client tarafı için kaydet
    localStorage.setItem("waylero-lang", newLang);

    // 3. Server Component'ler için Cookie (Aynen kalsın)
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`;

    // 4. 🔥 EN KRİTİK HAMLE: URL'Yİ DEĞİŞTİR (İndeksleri bozmadan)
    // Eğer TR seçildiyse /en veya /de takısını sil.
    // Eğer EN seçildiyse başına /en koy.
    let cleanPath = pathname;
    if (pathname.startsWith('/en')) cleanPath = pathname.replace('/en', '') || '/';
    if (pathname.startsWith('/de')) cleanPath = pathname.replace('/de', '') || '/';

    if (newLang === 'tr') {
      router.push(cleanPath);
    } else {
      router.push(`/${newLang}${cleanPath}`);
    }

    // Sayfayı tazele
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);