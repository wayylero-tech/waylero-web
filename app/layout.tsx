import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import ClientLayout from "./components/ClientLayout"; // Yeni dosyamız

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Waylero",
  description: "Waylero | Şehirleri keşfet, gezini planla",
  icons: { icon: "/waylero-icon.png", apple: "/waylero-icon.png" },
  // 🔥 Eklenen Kısım:
  alternates: {
    canonical: "https://www.waylero.com",
    languages: {
      "tr-TR": "https://www.waylero.com",
      "en-US": "https://www.waylero.com/en",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* Google Scriptlerin Buraya Gelecek */}
      </head>
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