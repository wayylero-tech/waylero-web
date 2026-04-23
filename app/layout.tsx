import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

import ClientLayout from "./components/ClientLayout";
import ClientProviders from "./ClientProviders";
import GoogleAnalytics from "./components/GoogleAnalytics";

// Font değişkenlerini tanımlıyoruz
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Playfair Display fontunu değişken olarak yüklüyoruz
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waylero",
  description: "Waylero | Şehirleri keşfet, gezini planla",
  icons: {
    icon: "/waylero-icon.png",
    apple: "/waylero-icon.png",
  },
  alternates: {
    canonical: "https://www.waylero.com",
    languages: {
      "tr-TR": "https://www.waylero.com",
      "en-US": "https://www.waylero.com/en",
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();

  const middlewareLang = headerList.get("x-url-lang");
  const currentPath = headerList.get("x-url") || "";

  let displayLang = "tr";
  if (middlewareLang === "en" || currentPath.includes("/en/")) {
    displayLang = "en";
  }

  return (
    <html lang={displayLang} suppressHydrationWarning>
      {/* Tüm font değişkenlerini burada body class'ına ekliyoruz. 
        Tailwind config dosyanızdaki "var(--font-playfair)" ile 
        buradaki variable ismi eşleştiği için fontunuz otomatik olarak çalışacaktır.
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <GoogleAnalytics />

        <ClientProviders>
          <ClientLayout lang={displayLang}>
            {children}
          </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}