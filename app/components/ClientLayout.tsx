"use client";

import { useLang } from "../context/LanguageContext";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import HomeSearch from "../HomeSearch";

// --- FONT AYARLARI ---
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
  const isHome = pathname === "/" || pathname === "/en";

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
          isHome ? "py-4" : "py-2 border-b"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* 🔹 SOL LOGO */}
          <div className="flex-1 flex justify-start">
            <div className="flex flex-col items-start">
              <Link href={getLocalizedLink("/")}>
                <img
                  src="/assets/genel/logo.webp"
                  // ÖNEMLİ: Lighthouse için fiziksel genişlik/yükseklik (CLS önleyici)
                  width={isHome ? 224 : 192} 
                  height={isHome ? 56 : 48}
                  className={`object-contain transition-all duration-500 ${
                    isHome ? "h-14" : "h-12"
                  }`}
                  alt="Waylero logo"
                  // İlk yüklenen ana logo olduğu için:
                  fetchPriority="high"
                />
              </Link>

              {isHome && (
                <div className="mt-2 flex items-center gap-3">
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

          {/* 🔥 ORTA */}
          <div className="flex-[2] flex justify-center px-4">
            <div className="w-full max-w-xl scale-95 md:scale-100">
              <HomeSearch forcedLang={activeLang} />
            </div>
          </div>

          {/* 🔹 SAĞ LOGO */}
          <div className="flex-1 flex justify-end">
            <Link href={getLocalizedLink("/")}>
              <img
                src="/assets/genel/logo-sag.webp"
                // ÖNEMLİ: Boyutlar belirtilmeli
                width={isHome ? 96 : 64}
                height={isHome ? 96 : 64}
                className={`object-contain transition-all duration-500 ${
                  isHome ? "h-24" : "h-16"
                }`}
                alt="Waylero"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* 🔹 FOOTER */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-8 text-sm text-gray-600">
          
          <div>
            <img
              src="/assets/genel/logo.webp"
              alt="Waylero Logo"
              width={160} // Fiziksel boyut
              height={40}
              className="h-10 mb-2 object-contain"
              loading="lazy" // Footer olduğu için lazy kalsın
            />
            <p className="font-medium text-gray-900">Waylero © {new Date().getFullYear()}</p>
            <p className="text-xs mt-1">{t.slogan}</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-gray-900 mb-1">
              {activeLang === "tr" ? "KURUMSAL" : "CORPORATE"}
            </span>
            <Link href={getLocalizedLink("/hakkimizda")} className="hover:text-blue-600 transition-colors">{t.hakkimizda}</Link>
            <Link href={getLocalizedLink("/privacy")} className="hover:text-blue-600 transition-colors">{t.gizlilik}</Link>
            <Link href={getLocalizedLink("/terms")} className="hover:text-blue-600 transition-colors">{t.sozlesme}</Link>
            <Link href={getLocalizedLink("/contact")} className="hover:text-blue-600 transition-colors">{t.iletisim}</Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-bold text-gray-900 mb-1">
              {activeLang === "tr" ? "İŞ BİRLİKLERİMİZ" : "PARTNERS"}
            </span>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <a href="https://etkinlik.io" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/assets/genel/etkinlikio.webp" 
                  alt="Etkinlik.io" 
                  width={120} // ÖNEMLİ: Boyut belirtilmeli
                  height={32}
                  className="h-8 object-contain" 
                />
              </a>
            </div>
            <p className="text-[10px] leading-tight text-gray-400">
              {activeLang === "tr" ? "Etkinlik verileri etkinlikio tarafından sağlanmaktadır." : "Event data is provided by etkinlikio."}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="font-bold text-gray-900">{t.takip}</span>
              <div className="flex gap-3 mt-3">
                <a href="https://www.instagram.com/waylero_ile_kesfet/" target="_blank"><img src="/assets/genel/instagram.webp" width={20} height={20} alt="Instagram" /></a>
                <a href="https://www.facebook.com/share/1cc67aspSp/" target="_blank"><img src="/assets/genel/facebook.webp" width={20} height={20} alt="Facebook" /></a>
                <a href="https://www.youtube.com/@way_lero" target="_blank"><img src="/assets/genel/youtube.webp" width={20} height={20} alt="YouTube" /></a>
                <a href="https://x.com/wayylero" target="_blank"><img src="/assets/genel/x.webp" width={20} height={20} alt="X" /></a>
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-900">{t.indir}</span>
              <div className="flex gap-2 mt-2">
                <a href="https://play.google.com/store/apps/details?id=app.waylero.mobile" target="_blank">
                  <img src="/assets/genel/google-play.webp" width={110} height={32} alt="Google Play" />
                </a>
                <img src="/assets/genel/app-store.webp" width={110} height={32} className="h-6 opacity-50" alt="App Store" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}