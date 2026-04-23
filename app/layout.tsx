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
  metadataBase: new URL('https://www.waylero.com'), // Bunu ekle ki o sarı hatalar gitsin
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
  
  // Sadece dile odaklanalım, URL işini ClientLayout halletsin
  const displayLang = middlewareLang === "en" ? "en" : "tr";

  return (
    <html lang={displayLang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
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