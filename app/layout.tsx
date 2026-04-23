import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

import ClientLayout from "./components/ClientLayout";
import ClientProviders from "./ClientProviders";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  // headers() kullanımı sayfayı dinamik yapar, parametreleri korumak için dikkatli yönetilmeli
  const headerList = await headers();
  
  // Middleware'den gelen dil bilgisini al
  const middlewareLang = headerList.get("x-url-lang");
  
  // ÖNEMLİ: x-url'den sadece pathname geliyorsa query parametreleri kaybolur.
  // Eğer ClientLayout içinde bu path'e göre bir yönlendirme varsa city=istanbul orada ölür.
  const currentPath = headerList.get("x-url") || "";

  // Dil belirleme mantığını sadeleştirdik
  const displayLang = (middlewareLang === "en" || currentPath.includes("/en/")) ? "en" : "tr";

  return (
    <html lang={displayLang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <GoogleAnalytics />

        <ClientProviders>
          {/* ClientLayout'a dili geçiyoruz ama içindeki useEffect/router mantığına dikkat! */}
          <ClientLayout lang={displayLang}>
            {children}
          </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}