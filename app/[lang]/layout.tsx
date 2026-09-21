import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";

import "../globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";

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
      template: "%s | Waylero", // Alt sayfalarda sadece sayfa adını vereceğiz, burası Otomatik "| Waylero" ekleyecek!
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

  // Google ve AI botlarının markayı tanıması için Global Organization & WebSite Scheması
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.waylero.com/#organization",
        "name": "Waylero",
        "url": "https://www.waylero.com",
        "logo": "https://www.waylero.com/waylero-icon.png",
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://www.waylero.com/#website",
        "url": "https://www.waylero.com",
        "name": "Waylero",
        "publisher": {
          "@id": "https://www.waylero.com/#organization"
        }
      }
    ]
  };

  return (
    <html lang={finalLang}>
      <head>
        {/* Cloudinary görsellerinin hızlı yüklenmesi için preconnect */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        {/* Tüm sitede geçerli Marka ve WebSite JSON-LD Şeması */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {/* GTM KODU */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','G-SMS2634C53');
            `,
          }}
        />

        {/* CLARITY KODU */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
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

                y=l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "x3v9pxahkm");
            })();
          `}
        </Script>

        <Header lang={finalLang} />

        <CookieConsent lang={finalLang} />

        <main className="flex-1">{children}</main>

        <Footer lang={finalLang} />
      </body>
    </html>
  );
}