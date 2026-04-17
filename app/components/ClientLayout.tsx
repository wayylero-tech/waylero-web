"use client";

import { useLang } from "../context/LanguageContext";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react"; // 1. Hook'ları ekledik
import HomeSearch from "../HomeSearch";

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
  const activeLang = serverLang || contextLang || "tr";
  
  // 2. SCROLL DURUMU TAKİBİ
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 50 piksel aşağı inince küçültmeyi başlat
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/" || pathname === "/en";
  
  // 3. LOGO DURUMU (Ana sayfadaysa ve henüz kaydırılmadıysa BÜYÜK, değilse KÜÇÜK)
  const shouldBeSmall = !isHome || isScrolled;

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
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm px-4 transition-all duration-500 ${
          shouldBeSmall ? "py-2 border-b" : "py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* 🔹 SOL LOGO */}
          <div className="flex-1 flex justify-start">
            <div className="flex flex-col items-start">
              <Link href={getLocalizedLink("/")}>
                <img
                  src="/assets/genel/logo.webp"
                  width={shouldBeSmall ? 192 : 224} 
                  height={shouldBeSmall ? 48 : 56}
                  className={`object-contain transition-all duration-500 ${
                    shouldBeSmall ? "h-12" : "h-14"
                  }`}
                  alt="Waylero logo"
                  fetchPriority="high"
                />
              </Link>

              {/* Slogan sadece en tepedeyken görünsün (opsiyonel, kalabalığı önler) */}
              {!shouldBeSmall && (
                <div className="mt-2 flex items-center gap-3 animate-in fade-in duration-500">
                  <p className="hidden md:block text-sm font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    {t.slogan}
                  </p>

                  <div className="flex items-center gap-2 border rounded-full px-2 py-0.5 text-[10px] font-bold bg-gray-50">
                    <button onClick={() => setLang("tr")} className={activeLang === "tr" ? "text-blue-600 underline" : "text-gray-400"}>TR</button>
                    <span className="text-gray-200">|</span>
                    <button onClick={() => setLang("en")} className={activeLang === "en" ? "text-blue-600 underline" : "text-gray-400"}>EN</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🔥 ORTA SEARCH */}
          <div className="flex-[2] flex justify-center px-4">
            <div className={`w-full max-w-xl transition-all duration-500 ${shouldBeSmall ? "scale-90" : "scale-100"}`}>
              <HomeSearch forcedLang={activeLang} />
            </div>
          </div>

          {/* 🔹 SAĞ LOGO */}
          <div className="flex-1 flex justify-end">
            <Link href={getLocalizedLink("/")}>
              <img
                src="/assets/genel/logo-sag.webp"
                width={shouldBeSmall ? 64 : 96}
                height={shouldBeSmall ? 64 : 96}
                className={`object-contain transition-all duration-500 ${
                  shouldBeSmall ? "h-16" : "h-24"
                }`}
                alt="Waylero"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* 🔹 FOOTER */}
      <footer className="border-t bg-gray-50 w-full">
        <div className="w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start gap-15 text-sm text-gray-800">
          
          {/* 1. SOL TARAF: LOGO VE SLOGAN (Mavi Daire Sol - En Sola) */}
          <div className="flex flex-col items-start min-w-[200px]">
            <img
              src="/assets/genel/logo.webp"
              alt="Waylero Logo"
              width={180} 
              height={45}
              className="h-11 mb-3 object-contain"
              loading="lazy"
            />
            <p className="font-bold text-gray-900 text-base">Waylero © {new Date().getFullYear()}</p>
            <p className="text-xs mt-1 font-medium text-gray-500 italic tracking-wide">{t.slogan}</p>
          </div>

          {/* 2. ORTA SOL: KURUMSAL */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-gray-900 mb-1 tracking-wider">
              {activeLang === "tr" ? "KURUMSAL" : "CORPORATE"}
            </span>
            <Link href={getLocalizedLink("/hakkimizda")} className="hover:text-blue-600 transition-colors font-medium">{t.hakkimizda}</Link>
            <Link href={getLocalizedLink("/privacy")} className="hover:text-blue-600 transition-colors font-medium">{t.gizlilik}</Link>
            <Link href={getLocalizedLink("/terms")} className="hover:text-blue-600 transition-colors font-medium">{t.sozlesme}</Link>
            <Link href={getLocalizedLink("/contact")} className="hover:text-blue-600 transition-colors font-medium">{t.iletisim}</Link>
          </div>

          {/* 3. ORTA SAĞ: İŞ BİRLİKLERİMİZ */}
<div className="flex flex-col gap-3 min-w-[250px] max-w-[350px] overflow-hidden">
  <span className="font-bold text-gray-900 mb-1 tracking-wider uppercase text-[12px]">
    {activeLang === "tr" ? "İŞ BİRLİKLERİMİZ" : "PARTNERS"}
  </span>
  
  <div className="relative flex overflow-hidden border-l border-gray-200 pl-4 group">
    {/* Kayan Kısım: Hem logo hem yazı bunun içinde */}
    <div className="flex animate-[partner-slider_20s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap py-2 gap-12 items-center">
      
      {/* SET 1 */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <a href="https://etkinlik.io" target="_blank" rel="noopener noreferrer" className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
          <img src="/assets/genel/etkinlikio.webp" alt="Etkinlik.io" width={110} height={30} className="h-7 object-contain" />
        </a>
        <span className="text-[10px] text-gray-400 font-medium">
          {activeLang === "tr" ? "• Etkinlik verileri etkinlikio tarafından sağlanmaktadır." : "• Event data provided by etkinlikio."}
        </span>
      </div>

      {/* SET 2 (Döngü için şart - Aynısını kopyalıyoruz) */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <a href="https://etkinlik.io" target="_blank" rel="noopener noreferrer" className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
          <img src="/assets/genel/etkinlikio.webp" alt="Etkinlik.io" width={110} height={30} className="h-7 object-contain" />
        </a>
        <span className="text-[10px] text-gray-400 font-medium">
          {activeLang === "tr" ? "• Etkinlik verileri etkinlikio tarafından sağlanmaktadır." : "• Event data provided by etkinlikio."}
        </span>
      </div>

      {/* SET 3 (Boşluk kalmaması için bir tane daha) */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <a href="https://etkinlik.io" target="_blank" rel="noopener noreferrer" className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
          <img src="/assets/genel/etkinlikio.webp" alt="Etkinlik.io" width={110} height={30} className="h-7 object-contain" />
        </a>
        <span className="text-[10px] text-gray-400 font-medium">
          {activeLang === "tr" ? "• Etkinlik verileri etkinlikio tarafından sağlanmaktadır." : "• Event data provided by etkinlikio."}
        </span>
      </div>
      
    </div>
  </div>
</div>

          {/* 4. SAĞ TARAF: TAKİP VE İNDİR (En Sağa Yaslı ve Yan Yana) */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start md:items-center flex-grow justify-end w-full md:w-auto">
            
           {/* 4. SAĞ TARAF: TAKİP VE İNDİR (Yan Yana ve Aynı Boyutta) */}
<div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start md:items-center flex-grow justify-end w-full md:w-auto">
  
  {/* Bizi Takip Et */}
  <div className="flex flex-col items-start">
    <span className="font-bold text-gray-900 tracking-wider mb-3 whitespace-nowrap">{t.takip}</span>
    <div className="flex gap-4 items-center h-9"> {/* Yüksekliği mağaza butonlarıyla eşitledik */}
      <a href="https://www.instagram.com/waylero_ile_kesfet/" target="_blank" className="hover:scale-110 transition-transform flex items-center">
        <img src="/assets/genel/instagram.webp" width={24} height={24} className="h-6 w-6 object-contain" alt="Instagram" />
      </a>
      <a href="https://www.facebook.com/share/1cc67aspSp/" target="_blank" className="hover:scale-110 transition-transform flex items-center">
        <img src="/assets/genel/facebook.webp" width={24} height={24} className="h-6 w-6 object-contain" alt="Facebook" />
      </a>
      <a href="https://www.youtube.com/@way_lero" target="_blank" className="hover:scale-110 transition-transform flex items-center">
        <img src="/assets/genel/youtube.webp" width={24} height={24} className="h-6 w-6 object-contain" alt="YouTube" />
      </a>
      <a href="https://x.com/wayylero" target="_blank" className="hover:scale-110 transition-transform flex items-center">
        <img src="/assets/genel/x.webp" width={24} height={24} className="h-6 w-6 object-contain" alt="X" />
      </a>
    </div>
  </div>

  {/* Uygulamayı İndir */}
  <div className="flex flex-col items-start">
    <span className="font-bold text-gray-900 tracking-wider mb-3 whitespace-nowrap">{t.indir}</span>
    <div className="flex gap-4 items-center h-9">
      <a href="https://play.google.com/store/apps/details?id=app.waylero.mobile" target="_blank" className="hover:opacity-80 transition-opacity flex items-center">
        <img src="/assets/genel/google-play.webp" width={32} height={32} className="h-7 w-auto object-contain" alt="Google Play" />
      </a>
      <a href="#" className="cursor-default flex items-center">
        <img src="/assets/genel/app-store.webp" width={32} height={32} className="h-7 w-auto object-contain opacity-40 grayscale" alt="App Store" />
      </a>
    </div>
  </div>
</div>
          </div>

        </div>
      </footer>
    </div>
  );
}