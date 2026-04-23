"use client";

import { useLang } from "../context/LanguageContext";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react"; // 1. Hook'ları ekledik
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans-variable",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono-variable",
  subsets: ["latin"],
});


export default function ClientLayout({
  children,
  lang: serverLang,
}: {
  children: React.ReactNode;
  lang?: string;
}) {

  const { lang: contextLang, setLang } = useLang();
  const pathname = usePathname();
  const router = useRouter();

const activeLang = contextLang || "tr";


  const switchLanguage = (lang: "tr" | "en") => {
  setLang(lang);

  // 1. Mevcut parametreleri (query string) al (?city=istanbul gibi)
  const currentSearchParams = typeof window !== "undefined" ? window.location.search : "";

  const cleanPath = pathname.replace(/^\/en/, "");

  const newPath =
    lang === "tr"
      ? cleanPath || "/"
      : cleanPath === "/"
      ? "/en"
      : `/en${cleanPath}`;

  // 2. Yeni path'in sonuna mevcut parametreleri geri ekle
  router.push(`${newPath}${currentSearchParams}`);
};

// Sayfa ilk yüklendiğinde veya pathname değiştiğinde parametre kaybını önlemek için:
useEffect(() => {
  if (pathname.startsWith("/en")) {
    setLang("en");
  } else {
    setLang("tr");
  }
  // Burada router.push YAPMA. Sadece context'teki dili güncelle.
  // Eğer burada router.push(pathname) dersen parametreleri yine silersin.
}, [pathname]);

  const isHome = pathname === "/" || pathname === "/en";

  useEffect(() => {
  if (pathname.startsWith("/en")) {
    setLang("en");
  } else {
    setLang("tr");
  }
}, [pathname]);



  const shouldBeSmall = false;

  const getLocalizedLink = (path: string) => {
    if (activeLang === "tr") return path;
    return `/${activeLang}${path === "/" ? "" : path}`;
  };

  const translations = {
    tr: {
      slogan: "Keşfet, Planla, Paylaş.",
      hakkimizda: "Hakkımızda",
      gizlilik: "Gizlilik Politikası",
      sozlesme: "Kullanıcı Sözleşmesi",
      iletisim: "İletişim",
      takip: "Bizi Takip Et",
      indir: "Uygulamayı İndir",
    },
    en: {
      slogan: "Explore, Plan, Share.",
      hakkimizda: "About Us",
      gizlilik: "Privacy Policy",
      sozlesme: "Terms of Service",
      iletisim: "Contact",
      takip: "Follow Us",
      indir: "Download App",
    },
  };

  const t = translations[activeLang as "tr" | "en"] || translations.tr;

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
      
      {/* 🔹 HEADER */}
     <header
  className={`sticky top-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md shadow-sm border-b border-black/5 px-4 transition-all duration-300 ${
    shouldBeSmall ? "py-1.5" : "py-3"
  }`}
>
  <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">

   <div className="flex items-center gap-3 flex-1">

  <Link href={getLocalizedLink("/")}>
    <img
      src="/assets/genel/logo.webp"
      width={224}
      height={56}
      className={`object-contain transition-all duration-300 ${
        shouldBeSmall ? "h-10" : "h-12"
      }`}
      alt="Waylero logo"
      fetchPriority="high"
    />
  </Link>

</div>

    {/* 🔵 SAĞ DİL */}
    <div className="flex-1 flex justify-end">

      <div className="flex items-center gap-1 border border-black/10 rounded-full p-1 bg-black/5 text-[11px] font-medium">

  <button
    onClick={() => switchLanguage("tr")}
    className={`px-2 py-0.5 rounded-full transition-all ${
      activeLang === "tr"
        ? "bg-white text-black shadow-sm"
        : "text-gray-500 hover:text-black"
    }`}
  >
    🇹🇷
  </button>

  <button
    onClick={() => switchLanguage("en")}
    className={`px-2 py-0.5 rounded-full transition-all ${
      activeLang === "en"
        ? "bg-white text-black shadow-sm"
        : "text-gray-500 hover:text-black"
    }`}
  >
    🇺🇸
  </button>

      </div>

    </div>

  </div>
</header>

      <main className="flex-1">{children}</main>

      {/* 🔹 FOOTER */}
      <footer className="border-t border-gray-800 bg-black w-full text-white">
  <div className="w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start gap-15 text-sm text-white/80">
    
    {/* 1. SOL TARAF: LOGO */}
    <div className="flex flex-col items-start min-w-[200px]">
      <img
        src="/assets/genel/logo.webp"
        alt="Waylero Logo"
        width={180}
        height={45}
        className="h-11 mb-3 object-contain"
        loading="lazy"
      />

      <p className="font-bold text-white text-base">
        Waylero © {new Date().getFullYear()}
      </p>

      {/* Slogan kaldırıldı / istersen eklenebilir */}
    </div>

    {/* 2. KURUMSAL */}
    <div className="flex flex-col gap-2.5">
      <span className="font-bold text-white mb-1 tracking-wider">
        {activeLang === "tr" ? "KURUMSAL" : "CORPORATE"}
      </span>

      <Link href={getLocalizedLink("/hakkimizda")} className="hover:text-blue-400 transition-colors font-medium">
        {t.hakkimizda}
      </Link>

      <Link href={getLocalizedLink("/privacy")} className="hover:text-blue-400 transition-colors font-medium">
        {t.gizlilik}
      </Link>

      <Link href={getLocalizedLink("/terms")} className="hover:text-blue-400 transition-colors font-medium">
        {t.sozlesme}
      </Link>

      <Link href={getLocalizedLink("/contact")} className="hover:text-blue-400 transition-colors font-medium">
        {t.iletisim}
      </Link>
    </div>

    {/* 3. PARTNERS */}
<div className="flex flex-col gap-3 min-w-[250px] max-w-[500px] overflow-hidden">
  
  <span className="font-bold text-white mb-1 tracking-wider uppercase text-[12px]">
    {activeLang === "tr" ? "İŞ BİRLİKLERİMİZ" : "PARTNERS"}
  </span>

  <div className="relative flex overflow-hidden border-l border-gray-700 pl-4 group">

    <div className="flex animate-[partner-slider_20s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap py-2 gap-16 items-center">

      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-16 flex-shrink-0">
          
          {/* Partner 1: Etkinlik.io */}
          <div className="flex items-center gap-4">
            <a
              href="https://etkinlik.io"
              target="_blank"
              rel="noopener noreferrer"
              className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all"
            >
              <img
                src="/assets/genel/etkinlikio.webp"
                alt="Etkinlik.io"
                width={100}
                height={30}
                className="h-10 object-contain"
              />
            </a>
            <span className="text-[13px] text-white/70 font-medium">
              {activeLang === "tr"

                  ? "• Etkinlik verileri etkinlikio tarafından sağlanmaktadır."

                  : "• Event data provided by etkinlikio."}
            </span>
          </div>

          {/* Partner 2: GetYourGuide */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.getyourguide.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all"
            >
              <img
                src="/assets/genel/getyourguide.webp" 
                alt="GetYourGuide"
                width={110}
                height={30}
                className="h-10 object-contain"
              />
            </a>
            <span className="text-[13px] text-white/70 font-medium">
  {activeLang === "tr"
    ? "• Turlar GetYourGuide üzerinden sunulmaktadır."
    : "• Tours are provided via GetYourGuide."}
</span>
          </div>

        </div>
      ))}
    </div>
  </div>
</div>

   {/* 4. SAĞ TARAF */}
<div className="flex items-start gap-10 ml-auto">

  {/* SOL: TAKİP + APP */}
  <div className="flex flex-col gap-8 items-end">

    {/* SOCIAL */}
    <div className="flex flex-col items-end">
      <span className="font-bold text-white tracking-wider mb-3 whitespace-nowrap">
        {t.takip}
      </span>

      <div className="flex gap-4 items-center h-9">
        {[
          ["instagram.webp", "https://www.instagram.com/waylero_ile_kesfet/", "Instagram"],
          ["facebook.webp", "https://www.facebook.com/share/1cc67aspSp/", "Facebook"],
          ["youtube.webp", "https://www.youtube.com/@way_lero", "YouTube"],
          ["x.webp", "https://x.com/wayylero", "X"],
        ].map(([img, url, label]) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform flex items-center"
          >
            <img
              src={`/assets/genel/${img}`}
              width={24}
              height={24}
              alt={label}
              className="h-6 w-6 object-contain"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>

    {/* APP */}
    <div className="flex flex-col items-end">
      <span className="font-bold text-white tracking-wider mb-3 whitespace-nowrap">
        {t.indir}
      </span>

      <div className="flex gap-4 items-center h-9">
        <a
          href="https://play.google.com/store/apps/details?id=app.waylero.mobile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity flex items-center"
        >
          <img
            src="/assets/genel/google-play.webp"
            width={140}
            height={42}
            alt="Google Play"
            className="h-7 w-auto object-contain"
            loading="lazy"
          />
        </a>

        <div className="flex items-center opacity-40 grayscale">
          <img
            src="/assets/genel/app-store.webp"
            width={140}
            height={42}
            alt="App Store"
            className="h-7 w-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>

  </div>

  {/* LOGO */}
  <div className="flex items-start pt-1">
    <img
      src="/assets/genel/logo-sag.webp"
      width={180}
      height={144}
      alt="Waylero Logo"
      className="h-36 w-auto object-contain opacity-80"
      loading="lazy"
    />
  </div>

</div>
   

   
  </div>
</footer>
    </div>
  );
}