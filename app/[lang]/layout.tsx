import type { Metadata } from "next";
import ClientLayout from "./components/ClientLayout";
import GoogleAnalytics from "./components/GoogleAnalytics";

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
  // URL'den gelen dili güvenli bir şekilde alıyoruz
  const { lang } = await params;
  const finalLang = lang === "en" ? "en" : "tr";

  return (
    <ClientLayout lang={finalLang}>
      <GoogleAnalytics />
      {children}
    </ClientLayout>
  );
}