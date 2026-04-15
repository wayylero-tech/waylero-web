import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers"; 
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import ClientProviders from "./ClientProviders";
import GoogleAnalytics from "./components/GoogleAnalytics"; // 👈 EKLEDİK

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

  const middlewareLang = headerList.get("x-url-lang");
  const currentPath = headerList.get("x-url") || ""; 

  let displayLang = "tr";
  if (middlewareLang === "en" || currentPath.includes("/en/")) {
    displayLang = "en";
  }

  return (
    <html lang={displayLang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>

        {/* 🔥 GOOGLE ANALYTICS */}
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