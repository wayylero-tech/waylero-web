import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers"; // 🔥 Bunu ekledik
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import ClientLayout from "./components/ClientLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Waylero",
  description: "Waylero | Şehirleri keşfet, gezini planla",
  icons: { icon: "/waylero-icon.png", apple: "/waylero-icon.png" },
  alternates: {
    canonical: "https://www.waylero.com",
    languages: {
      "tr-TR": "https://www.waylero.com",
      "en-US": "https://www.waylero.com/en",
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 🔥 URL'DEN DİLİ YAKALAMA OPERASYONU
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || "";
  const isEn = pathname.startsWith("/en") || headerList.get("referer")?.includes("/en/");
  const displayLang = isEn ? "en" : "tr";

  return (
    <html lang={displayLang}> {/* 🔥 ARTIK DİNAMİK! */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
