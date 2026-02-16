import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waylero",
  description: "Waylero | Şehirleri keşfet, gezini planla",
  icons: {
    icon: "/waylero-icon.png",
    apple: "/waylero-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        {/* ✅ GOOGLE ADSENSE */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4779947503854024"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* 🔹 SAYFA İÇERİĞİ */}
        <main className="flex-1">
          {children}
        </main>

        {/* 🔻 FOOTER */}
        <footer className="border-t bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 text-sm text-gray-600">

            <div>
              <img src="/assets/logo.png" className="h-10 mb-2" />
              <p>Waylero © {new Date().getFullYear()}</p>
              <p>Keşfet, planla, paylaş.</p>
            </div>

            <div className="flex flex-col gap-1">
              <Link href="/hakkimizda">Hakkımızda</Link>
              <Link href="/privacy">Gizlilik Politikası</Link>
              <Link href="/terms">Kullanıcı Sözleşmesi</Link>
            </div>

            <div className="flex justify-between md:justify-end gap-6">

              <div>
                <span className="font-semibold">Bizi Takip Et</span>
                <div className="flex gap-2 mt-1">
                  <a href="https://www.instagram.com/waylero_ile_kesfet/" target="_blank">
                    <img src="/assets/social/instagram.png" className="h-6" />
                  </a>
                  <a href="https://www.facebook.com/share/1cc67aspSp/" target="_blank">
                    <img src="/assets/social/facebook.png" className="h-6" />
                  </a>
                  <a href="https://www.youtube.com/@way_lero" target="_blank">
                    <img src="/assets/social/youtube.png" className="h-6" />
                  </a>
                  <a href="https://x.com/wayylero" target="_blank">
                    <img src="/assets/social/x.png" className="h-6" />
                  </a>
                </div>
              </div>

              <div className="text-right">
                <span className="font-semibold">Uygulamayı İndir</span>
                <div className="flex gap-2 mt-1">
                  <a
                    href="https://play.google.com/store/apps/details?id=app.waylero.mobile"
                    target="_blank"
                  >
                    <img src="/assets/store/google-play.png" className="h-6" />
                  </a>
                  <img src="/assets/store/app-store.png" className="h-6 opacity-50" />
                </div>
              </div>

            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
