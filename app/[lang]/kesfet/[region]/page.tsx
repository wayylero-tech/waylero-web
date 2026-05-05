import { Metadata } from "next";
import fs from "fs";
import path from "path";
import RegionClient from "./RegionClient";

export const revalidate = 86400; // 24 saat cache (ISR)
export const dynamicParams = true; // bilinmeyen region'lara izin


export async function generateStaticParams() {
  const popularRegions = [
    "turkiye",
    "italya",
    "fransa",
    "ispanya",
    "japonya",
    "amerika",
  ];

  return popularRegions.flatMap((region) => [
    { lang: "tr", region },
    { lang: "en", region },
  ]);
}


type Props = {
  params: Promise<{ lang: string; region: string }>;
};

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
  bae: { tr: "BAE", en: "UAE" },
  peru: { tr: "Peru", en: "Peru" },
};

const BASE_URL = "https://www.waylero.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Dinamik route parametrelerini await ediyoruz
  const resolvedParams = await params;
  const { lang, region } = resolvedParams;
  const isEn = lang === "en";

  const name =
    regionNameMap[region]?.[isEn ? "en" : "tr"] ??
    region.replace(/-/g, " ");

  const title = isEn
    ? `Best Places to Visit in ${name}`
    : `${name} Gezilecek Yerler`;

  const description = isEn
    ? `Discover cities, attractions and travel guides in ${name}.`
    : `${name} bölgesindeki en iyi gezilecek yerleri keşfedin.`;

  const pathUrl = `/kesfet/${region}`;
  const url = `${BASE_URL}/${lang}${pathUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr${pathUrl}`,
        "en-US": `${BASE_URL}/en${pathUrl}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og/region.jpg`,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og/region.jpg`],
    },
  };
}

// 🧠 PAGE
export default async function Page({ params }: Props) {
  // Params nesnesini güvenli bir şekilde çözümlüyoruz
  const resolvedParams = await params;
  const { lang, region } = resolvedParams;

  // Region parametresi yoksa veya tanımsızsa hata vermemesi için koruma
  if (!region) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Geçersiz bölge parametresi.
      </div>
    );
  }

  const dataPath = path.join(process.cwd(), "data/ulkelerdata", region);

  let cityData: any = {};

  if (fs.existsSync(dataPath)) {
    const files = fs.readdirSync(dataPath);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const city = file.replace(".json", "");
      const filePath = path.join(dataPath, file);

      try {
        cityData[city] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {}
    }
  }

  const imagePath = path.join(
    process.cwd(),
    "data/ulkedataimages",
    `${region}.json`
  );

  let images = {};

  if (fs.existsSync(imagePath)) {
    try {
      images = JSON.parse(fs.readFileSync(imagePath, "utf-8"));
    } catch {}
  }

  return (
    <RegionClient
      region={region}
      lang={lang}
      data={cityData}
      images={images}
    />
  );
}