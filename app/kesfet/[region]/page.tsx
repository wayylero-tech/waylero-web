import { Metadata } from "next";
import { cookies } from "next/headers";
import RegionClient from "./RegionClient";
import { countryToRegionMap } from "@/lib/countryToRegionMap";

type Props = {
  params: Promise<{ region: string }>;
};

// 🌍 Ülke isim map (TR + EN düzgün SEO için)
const regionNameMap: Record<string, { tr: string; en: string }> = {
  turkiye: { tr: "Türkiye", en: "Turkey" },
  amerika: { tr: "Amerika", en: "USA" },
  fransa: { tr: "Fransa", en: "France" },
  almanya: { tr: "Almanya", en: "Germany" },
  italya: { tr: "İtalya", en: "Italy" },
  ispanya: { tr: "İspanya", en: "Spain" },
  ingiltere: { tr: "İngiltere", en: "United Kingdom" },
  hollanda: { tr: "Hollanda", en: "Netherlands" },
  avusturya: { tr: "Avusturya", en: "Austria" },
  yunanistan: { tr: "Yunanistan", en: "Greece" },
  "cek-cumhuriyeti": { tr: "Çek Cumhuriyeti", en: "Czech Republic" },
  rusya: { tr: "Rusya", en: "Russia" },
  portekiz: { tr: "Portekiz", en: "Portugal" },
  romanya: { tr: "Romanya", en: "Romania" },
  danimarka: { tr: "Danimarka", en: "Denmark" },
  urdun: { tr: "Ürdün", en: "Jordan" },
  isvec: { tr: "İsveç", en: "Sweden" },
  norvec: { tr: "Norveç", en: "Norway" },
  isvicre: { tr: "İsviçre", en: "Switzerland" },
  endonezya: { tr: "Endonezya", en: "Indonesia" },
  irlanda: { tr: "İrlanda", en: "Ireland" },
  "bosna-hersek": { tr: "Bosna Hersek", en: "Bosnia and Herzegovina" },
  avustralya: { tr: "Avustralya", en: "Australia" },
  gurcistan: { tr: "Gürcistan", en: "Georgia" },
  iskocya: { tr: "İskoçya", en: "Scotland" },
  galler: { tr: "Galler", en: "Wales" },
  malezya: { tr: "Malezya", en: "Malaysia" },
  cin: { tr: "Çin", en: "China" },
  hindistan: { tr: "Hindistan", en: "India" },
  tayland: { tr: "Tayland", en: "Thailand" },
  "guney-kore": { tr: "Güney Kore", en: "South Korea" },
  filipinler: { tr: "Filipinler", en: "Philippines" },
  japonya: { tr: "Japonya", en: "Japan" },
  "sri-lanka": { tr: "Sri Lanka", en: "Sri Lanka" },
  singapur: { tr: "Singapur", en: "Singapore" },
  umman: { tr: "Umman", en: "Oman" },
  "suudi-arabistan": { tr: "Suudi Arabistan", en: "Saudi Arabia" },
  misir: { tr: "Mısır", en: "Egypt" },
  belarus: { tr: "Belarus", en: "Belarus" },
  kktc: { tr: "KKTC", en: "Northern Cyprus" },
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";

  const baseUrl = "https://www.waylero.com";

  // 🌍 EN / TR doğru title sistemi
  const displayTitle =
    regionNameMap[region]?.[lang] ??
    region
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const isCountry = !!countryToRegionMap[region];

  // 🌍 SEO TEXTS
  const texts = {
    tr: {
      title: `${displayTitle} Gezilecek Yerler`,
      desc: isCountry
        ? `${displayTitle} ülkesindeki en popüler şehirleri ve gezilecek yerleri keşfedin.`
        : `${displayTitle} bölgesindeki ülkeleri ve şehirleri keşfedin.`,
    },
    en: {
      title: `Places to Visit in ${displayTitle}`,
      desc: isCountry
        ? `Discover the best cities and places to visit in ${displayTitle}.`
        : `Explore countries and cities in the ${displayTitle} region.`,
    }
  }[lang];

  const path = `/kesfet/${region}`;
  const canonical = lang === "tr" ? `${baseUrl}${path}` : `${baseUrl}/en${path}`;
  const ogImage = `${baseUrl}/assets/seo/${region}.jpg`;

  return {
    title: `${texts.title} | Waylero`,
    description: texts.desc,
    alternates: {
      canonical,
      languages: {
        tr: `${baseUrl}${path}`,
        en: `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}${path}`,
      },
    },
    openGraph: {
      title: texts.title,
      description: texts.desc,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: texts.title,
      description: texts.desc,
      images: [ogImage],
    },
  };
}

// ✅ ANA SAYFA FONKSİYONU
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  
  // Dil bilgisini cookie'den çekip Client Component'e paslıyoruz
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "tr";

  return <RegionClient region={resolvedParams.region} lang={lang} />;
}