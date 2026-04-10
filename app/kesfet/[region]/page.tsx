import { Metadata } from "next";
import { cookies } from "next/headers";
import RegionClient from "./RegionClient";

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
};

// 🌍 country check (region vs country ayrımı için)
const countryToRegionMap: Record<string, string> = { turkiye: "turkey", fransa: "europa", almanya: "europa", italya: "europa", kktc: "europa", ispanya: "europa", ingiltere: "europa", hollanda: "europa", avusturya: "europa", yunanistan: "europa", "cek-cumhuriyeti": "europa", rusya: "europa", portekiz: "europa", romanya: "europa", danimarka: "europa", urdun: "asia", isvec: "europa", norvec: "europa", isvicre: "europa", endonezya: "europa", irlanda: "europa", "bosna-hersek": "europa", avustralya: "europa", gurcistan: "europa", iskocya: "europa", galler: "europa", malezya: "europa", cin: "asia", hindistan: "asia", tayland: "europa", "guney-kore": "asia", filipinler: "europa", japonya: "asia", "sri-lanka": "asia", singapur: "europa", amerika: "europa", umman: "europa", "suudi-arabistan": "europa", misir: "europa", belarus: "europa" };

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

  // 🌍 URL path
  const path = `/kesfet/${region}`;

  // 🔥 CANONICAL (COOKIE BAĞIMLI DEĞİL - SEO SAFE)
  const canonical =
    lang === "tr"
      ? `${baseUrl}${path}`
      : `${baseUrl}/en${path}`;

  // 🖼 OG IMAGE SAFE
  const ogImage = `${baseUrl}/assets/seo/${region}.jpg`;
  const fallbackImage = `${baseUrl}/assets/seo/default.jpg`;

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
      images: [ogImage], // fallback backend’e bırakıldı
    },

    twitter: {
      card: "summary_large_image",
      title: texts.title,
      description: texts.desc,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  return <RegionClient region={resolvedParams.region} />;
}