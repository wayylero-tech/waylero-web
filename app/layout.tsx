import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

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
  metadataBase: new URL("https://waylero.com"),
  title: {
    default: "Waylero | Explore Cities, Events & Travel Experiences",
    template: "%s | Waylero",
  },
  description:
    "Discover 40+ countries, 300+ cities and 2000+ travel spots. Find concerts, events, tours and travel inspiration with Waylero.",
  icons: {
    icon: "/waylero-icon.png",
    shortcut: "/waylero-icon.png",
    apple: "/waylero-icon.png",
  },
  openGraph: {
    title: "Waylero | Travel & City Explorer",
    description:
      "Explore cities, events, concerts, tours and travel experiences worldwide.",
    url: "https://waylero.com",
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
    description:
      "Explore cities, events, concerts and travel experiences worldwide.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "tr"; // Varsayılan dil Türkçe

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}