"use client";

import { useLang } from "../context/LanguageContext";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";

import HomeSearch from "../HomeSearch";

const geistSans = Geist({ variable: "--font-geist-sans-variable", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono-variable", subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLang();
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "/en";

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path === "/" ? "" : path}`;
  };

  const t =
    {
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
    }[lang as "tr" | "en"] || {};

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
      
      {/* 🔹 HEADER */}
      <header
        className={`
        sticky top-0 z-50 
        bg-white/95 backdrop-blur-md shadow-sm px-4
        transition-all duration-500
        ${isHome ? "py-4" : "py-2 border-b"}
      `}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* 🔹 SOL */}
          <div className="flex-1 flex justify-start">
            <div className="flex flex-col items-start">
              <Link href={getLocalizedLink("/")}>
                <img
                  src="/assets/logo.png"
                  className={`transition-all duration-500 object-contain ${
                    isHome ? "h-14" : "h-12"
                  }`}
                  alt="Logo"
                />
              </Link>

              {isHome && (
                <div className="mt-2 flex items-center gap-3">
                  <p className="hidden md:block text-sm font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    {t.slogan}
                  </p>

                  <div className="flex border rounded-full px-2 py-0.5 text-[10px] font-bold bg-gray-50 gap-2">
                    <button onClick={() => setLang("tr")} className={lang === "tr" ? "text-blue-600 underline" : "text-gray-400"}>TR</button>
                    <span className="text-gray-200">|</span>
                    <button onClick={() => setLang("en")} className={lang === "en" ? "text-blue-600 underline" : "text-gray-400"}>EN</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🔥 ORTA (HER ZAMAN VAR) */}
          <div className="flex-[2] flex justify-center px-4">
            <div className="w-full max-w-xl scale-95 md:scale-100">
              <HomeSearch />
            </div>
          </div>

          {/* 🔹 SAĞ */}
          <div className="flex-1 flex justify-end">
            <Link href={getLocalizedLink("/")}>
              <img
                src="/assets/logo-sag.png"
                className={`transition-all duration-500 object-contain ${
                  isHome ? "h-25" : "h-20"
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
        <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <img src="/assets/logo.png" alt="Waylero Logo" className="h-10 mb-2" />
            <p>Waylero © {new Date().getFullYear()}</p>
            <p>{t.slogan}</p>
          </div>

          <div className="flex flex-col gap-1">
            <Link href="/hakkimizda">{t.hakkimizda}</Link>
            <Link href="/privacy">{t.gizlilik}</Link>
            <Link href="/terms">{t.sozlesme}</Link>
            <Link href="/contact">{t.iletisim}</Link>
          </div>

          <div className="flex justify-between md:justify-end gap-6">
            <div>
              <span className="font-semibold text-gray-900">{t.takip}</span>
              <div className="flex gap-2 mt-2">
                <a href="https://www.instagram.com/waylero_ile_kesfet/" target="_blank"><img src="/assets/social/instagram.png" className="h-6 w-6" /></a>
                <a href="https://www.facebook.com/share/1cc67aspSp/" target="_blank"><img src="/assets/social/facebook.png" className="h-6 w-6" /></a>
                <a href="https://www.youtube.com/@way_lero" target="_blank"><img src="/assets/social/youtube.png" className="h-6 w-6" /></a>
                <a href="https://x.com/wayylero" target="_blank"><img src="/assets/social/x.png" className="h-6 w-6" /></a>
              </div>
            </div>

            <div className="text-right">
              <span className="font-semibold text-gray-900">{t.indir}</span>
              <div className="flex gap-2 mt-2">
                <a href="https://play.google.com/store/apps/details?id=app.waylero.mobile" target="_blank">
                  <img src="/assets/store/google-play.png" className="h-6" />
                </a>
                <img src="/assets/store/app-store.png" className="h-6 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}