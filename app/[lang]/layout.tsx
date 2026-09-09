import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/GoogleAnalytics";
import CookieConsent from "./components/CookieConsent";

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;

  const isEn = lang === "en";

  return {
    title: isEn
      ? "Waylero | Create Travel Plan, Explore Events"
      : "Waylero | Gezi Planı Oluştur, Etkinlikleri Keşfet",

    description: isEn
      ? "Discover cities, find events and easily create your travel plan with Waylero."
      : "Waylero ile şehirleri keşfet, etkinlikleri bul ve kolayca gezi planı oluştur.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const finalLang = lang === "en" ? "en" : "tr";

  return (
    <>
      <head>
        <meta
          name="yandex-verification"
          content="81cbfcf8784b9317"
        />
      </head>

      <Header lang={finalLang} />

      <GoogleAnalytics />

      <CookieConsent lang={finalLang} />

      <main className="flex-1">
        {children}
      </main>

      <Footer lang={finalLang} />
    </>
  );
}