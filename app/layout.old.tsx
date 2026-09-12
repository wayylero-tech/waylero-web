import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL("https://waylero.com" ),

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
}: Readonly<{
  children: React.ReactNode;
}> ) {
  const headersList = await headers();

  const headerLocale = headersList.get("x-waylero-lang")?.toLowerCase();
  console.log("ROOT LAYOUT LANG:", headerLocale);

  const lang: "tr" | "en" =
    headerLocale === "en"
      ? "en"
      : headerLocale === "tr"
        ? "tr"
        : "en";

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function() {
              var consent = localStorage.getItem("waylero_cookie_consent");

              if (consent !== "accepted") {
                return;
              }

              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){
                  (c[a].q=c[a].q||[]).push(arguments)
                };

                t=l.createElement(r);
                t.async=1;
                t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";

                y=l.getElementsByTagName(r )[0];
                y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "x3v9pxahkm");
            })();
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
