import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

import ClientLayout from "./components/ClientLayout";
import ClientProviders from "./ClientProviders";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

// 🛡️ DINAMIK METADATA: Google artık /en'e gelince İngilizce başlık görecek
export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") || "tr";
  const isEn = lang === "en";

  return {
    title: isEn ? "Waylero | Create Travel Plan, Explore Events" : "Waylero | Gezi Planı Oluştur, Etkinlikleri Keşfet",
    description: isEn 
      ? "Discover cities, find events and easily create your travel plan with Waylero. Istanbul, Paris, Dubai and more are waiting for you."
      : "Waylero ile şehirleri keşfet, etkinlikleri bul ve kolayca gezi planı oluştur. İstanbul, Paris, Dubai ve daha fazlası seni bekliyor",
    icons: {
      icon: "/waylero-icon.png",
      apple: "/waylero-icon.png",
    },
    alternates: {
      canonical: isEn ? "https://www.waylero.com/en" : "https://www.waylero.com",
      languages: {
        "tr-TR": "https://www.waylero.com",
        "en-US": "https://www.waylero.com/en",
        "x-default": "https://www.waylero.com", // Google'ın en sevdiği: "Dil bulamazsan buraya git" sinyali
      },
    },
    openGraph: {
      title: isEn ? "Waylero | Create Travel Plan" : "Waylero | Gezi Planı Oluştur",
      locale: isEn ? "en_US" : "tr_TR",
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  // Middleware'den gelen net bilgi. URL'de /en/ varsa middleware bunu "en" set ediyor zaten.
  const displayLang = headerList.get("x-url-lang") === "en" ? "en" : "tr";

  return (
    <html lang={displayLang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <GoogleAnalytics />

        <ClientProviders>
          {/* ClientLayout ve içindeki Context artık doğru dili sunucudan (SSR) alarak başlıyor */}
          <ClientLayout lang={displayLang}>
            {children}
          </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}