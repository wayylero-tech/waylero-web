import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

import "../globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
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
  subsets: ["latin"],
  variable: "--font-playfair",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const finalLang = lang === "en" ? "en" : "tr";
  const isEn = finalLang === "en";

  return {
    metadataBase: new URL("https://www.waylero.com"),

    title: {
      default: isEn
        ? "Waylero | Create Travel Plan, Explore Events"
        : "Waylero | Gezi Planı Oluştur, Etkinlikleri Keşfet",
      template: "%s | Waylero",
    },

    description: isEn
      ? "Discover cities, find events and easily create your travel plan with Waylero."
      : "Waylero ile şehirleri keşfet, etkinlikleri bul ve kolayca gezi planı oluştur.",

    verification: {
      yandex: "81cbfcf8784b9317",
    },

    icons: {
      icon: "/waylero-icon.png",
      shortcut: "/waylero-icon.png",
      apple: "/waylero-icon.png",
    },

    openGraph: {
      title: isEn
        ? "Waylero | Travel & City Explorer"
        : "Waylero | Gezi ve Şehir Keşfi",
      description: isEn
        ? "Explore cities, events, concerts, tours and travel experiences worldwide."
        : "Şehirleri, etkinlikleri, konserleri, turları ve seyahat deneyimlerini keşfet.",
      url: "https://www.waylero.com",
      siteName: "Waylero",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Waylero",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Waylero",
      description: isEn
        ? "Explore cities, events, concerts and travel experiences worldwide."
        : "Şehirleri, etkinlikleri, konserleri ve seyahat deneyimlerini keşfet.",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const finalLang: "tr" | "en" = lang === "en" ? "en" : "tr";

  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.waylero.com/#organization",
        name: "Waylero",
        url: "https://www.waylero.com",
        logo: "https://www.waylero.com/waylero-icon.png",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.waylero.com/#website",
        url: "https://www.waylero.com",
        name: "Waylero",
        publisher: {
          "@id": "https://www.waylero.com/#organization",
        },
      },
    ],
  };

  return (
    <html lang={finalLang}>
      <head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalSchema),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Header lang={finalLang} />

        <CookieConsent lang={finalLang} />

        <GoogleAnalytics />

        <main className="flex-1">
          {children}
        </main>

        <Footer lang={finalLang} />
      </body>
    </html>
  );
}