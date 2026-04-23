import EtkinliklerClient from "./EtkinliklerClient";

export const metadata = {
  title: "Etkinlikleri Keşfet | Türkiye Şehir Turları",
  description:
    "Türkiye şehirlerinde etkinlikleri ve turları keşfet. En iyi aktiviteleri bul.",

  keywords: [
    "etkinlikler",
    "türkiye turları",
    "istanbul turları",
    "şehir etkinlikleri",
  ],

  alternates: {
    canonical: "https://www.waylero.com/etkinlikler",
    languages: {
      tr: "https://www.waylero.com/etkinlikler",
      en: "https://www.waylero.com/en/etkinlikler",
    },
  },

  openGraph: {
    title: "Etkinlikleri Keşfet | Waylero",
    description:
      "Türkiye şehirlerinde en iyi turlar ve aktiviteleri keşfet.",
    url: "https://www.waylero.com/etkinlikler",
    siteName: "Waylero",
    type: "website",
    locale: "tr_TR",
  },

  twitter: {
    card: "summary_large_image",
    title: "Etkinlikleri Keşfet",
    description:
      "Türkiye şehirlerinde en iyi turlar ve aktiviteleri keşfet.",
  },
};

export default function Page() {
  return <EtkinliklerClient />;
}