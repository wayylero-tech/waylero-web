
"use client";

import { useLang } from "../context/LanguageContext";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();

  const t = {
   tr: {
  slogan: "Keşfet, planla, paylaş.",
  hakkimizda: "Hakkımızda",
  gizlilik: "Gizlilik Politikası",
  sozlesme: "Kullanıcı Sözleşmesi",
  iletisim: "İletişim", // 👈 EKLE
  takip: "Bizi Takip Et",
  indir: "Uygulamayı İndir"
},
en: {
  slogan: "Explore, plan, share.",
  hakkimizda: "About Us",
  gizlilik: "Privacy Policy",
  sozlesme: "Terms of Service",
  iletisim: "Contact", // 👈 EKLE
  takip: "Follow Us",
  indir: "Download App"
}
  }[lang as "tr" | "en"] || { slogan: "", hakkimizda: "", gizlilik: "", sozlesme: "", takip: "", indir: "" };

  return (
    // ⚠️ BURADAKİ body ETİKETİNİ KALDIRIP div YAPTIK
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
      
      <main className="flex-1">{children}</main>

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
  <Link href="/contact">{t.iletisim}</Link> {/* 👈 EKLE */}
</div>

          <div className="flex justify-between md:justify-end gap-6">
            <div>
              <span className="font-semibold text-gray-900">{t.takip}</span>
              <div className="flex gap-2 mt-2">
                <a href="https://www.instagram.com/waylero_ile_kesfet/" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/social/instagram.png" alt="Instagram" className="h-6 w-6" />
                </a>
                <a href="https://www.facebook.com/share/1cc67aspSp/" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/social/facebook.png" alt="Facebook" className="h-6 w-6" />
                </a>
                <a href="https://www.youtube.com/@way_lero" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/social/youtube.png" alt="YouTube" className="h-6 w-6" />
                </a>
                <a href="https://x.com/wayylero" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/social/x.png" alt="X" className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="text-right">
              <span className="font-semibold text-gray-900">{t.indir}</span>
              <div className="flex gap-2 mt-2">
                <a href="https://play.google.com/store/apps/details?id=app.waylero.mobile" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/store/google-play.png" alt="Google Play" className="h-6" />
                </a>
                <img src="/assets/store/app-store.png" alt="App Store" className="h-6 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
