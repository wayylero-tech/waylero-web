import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers"; 
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
  const headerList = await headers();

  // 1. Middleware'den gelen header (En güvenlisi)
  const middlewareLang = headerList.get("x-url-lang");
  
  // 2. Eğer o yoksa pathname'i yakalamaya çalış (Header üzerinden)
  // Next.js bazen x-url veya x-pathname gibi headerlar gönderir
  const currentPath = headerList.get("x-url") || ""; 

  // Dil tespiti
  let displayLang = "tr"; // Default
  if (middlewareLang === "en") {
    displayLang = "en";
  } else if (currentPath.includes("/en/")) {
    displayLang = "en";
  }

  return (
    <html lang={displayLang}> {/* Artık burası dinamik ve daha sağlam */}
      <body className={`
        ${geistSans.variable} 
        ${geistMono.variable} 
        antialiased min-h-screen flex flex-col
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-white
      `}>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}