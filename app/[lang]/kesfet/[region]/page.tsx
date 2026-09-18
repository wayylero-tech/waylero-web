import { Metadata } from "next";
import fs from "fs";
import path from "path";
import RegionClient from "./RegionClient";

export const revalidate = 86400; // 24 saat ISR
export const dynamicParams = true;

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
  params: Promise<{
    lang: string;
    region: string;
  }>;
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
  "cek-cumhuriyeti": {
    tr: "Çek Cumhuriyeti",
    en: "Czech Republic",
  },
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
  "bosna-hersek": {
    tr: "Bosna Hersek",
    en: "Bosnia and Herzegovina",
  },
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
  "suudi-arabistan": {
    tr: "Suudi Arabistan",
    en: "Saudi Arabia",
  },
  misir: { tr: "Mısır", en: "Egypt" },
  belarus: { tr: "Belarus", en: "Belarus" },
  kktc: { tr: "KKTC", en: "Northern Cyprus" },
  bae: { tr: "BAE", en: "UAE" },
  peru: { tr: "Peru", en: "Peru" },
};

const BASE_URL = "https://www.waylero.com";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, region } = resolvedParams;
  const isEn = lang === "en";

  const name =
    regionNameMap[region]?.[isEn ? "en" : "tr"] ??
    region.replace(/-/g, " ");

  const title = isEn
    ? `Best Places to Visit in ${name} | Travel Guide`
    : `${name} Gezilecek Yerler 2026 | En Güzel Şehirler ve Gezi Rehberi`;

  const description = isEn
    ? `Discover the best cities, attractions, historical sites and travel destinations in ${name}.`
    : `${name}'de gezilecek yerleri keşfedin. Şehirler, tarihi mekanlar, doğal güzellikler ve popüler turistik noktalar için kapsamlı gezi rehberi.`;

  const pathUrl = `/kesfet/${region}`;
  const url = `${BASE_URL}/${lang}${pathUrl}`;

  // -------------------------------------------------
  // DİNAMİK BÖLGE GÖRSELİNİ BULMA
  // -------------------------------------------------
  const imagePath = path.join(
    process.cwd(),
    "data/ulkedataimages",
    `${region}.json`
  );

  let regionCoverImage = `${BASE_URL}/og/region.jpg`; // Varsayılan fallback

  if (fs.existsSync(imagePath)) {
    try {
      const imagesJson = JSON.parse(
        fs.readFileSync(imagePath, "utf-8")
      );
      
      // İlk bulduğumuz şehir ve görsel anahtarını alıyoruz
      const firstCityKey = Object.keys(imagesJson)[0];
      if (firstCityKey) {
        const cityImages = imagesJson[firstCityKey];
        const firstImageKey = Object.keys(cityImages)[0];
        if (firstImageKey && cityImages[firstImageKey]?.[0]) {
          const rawImg = cityImages[firstImageKey][0];
          // Cloudinary URL formatına çeviriyoruz
          regionCoverImage = `https://res.cloudinary.com/dewd42ppf/image/upload/f_auto,q_auto:eco,w_1200,c_fill/${rawImg.replace(/^\/+/, "")}`;
        }
      }
    } catch (error) {
      console.error(`Metadata görseli okunamadı: ${imagePath}`, error);
    }
  }

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
          url: regionCoverImage,
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
      images: [regionCoverImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  const { lang, region } = resolvedParams;
  const regionName =
  regionNameMap[region]?.[lang === "en" ? "en" : "tr"] ??
  region.replace(/-/g, " ");

  if (!region) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
        }}
      >
        Geçersiz bölge parametresi.
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * ŞEHİR JSON DOSYALARINI SERVER TARAFINDA OKUYORUZ
   *
   * Örnek:
   *
   * data/ulkelerdata/turkiye/konya.json
   * data/ulkelerdata/turkiye/antalya.json
   *
   * data/ulkelerdata/fransa/paris.json
   * -------------------------------------------------------
   */

  const dataPath = path.join(
    process.cwd(),
    "data/ulkelerdata",
    region
  );

  let cityData: Record<string, any[]> = {};

  if (fs.existsSync(dataPath)) {
    const files = fs.readdirSync(dataPath);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const city = file.replace(".json", "");

      const filePath = path.join(dataPath, file);

      try {
        const content = fs.readFileSync(filePath, "utf-8");

        const parsed = JSON.parse(content);

        /*
         * Şehir JSON'u array olduğu için doğrudan saklıyoruz.
         */
        if (Array.isArray(parsed)) {
          cityData[city] = parsed;
        }
      } catch (error) {
        console.error(
          `Şehir JSON okunamadı: ${filePath}`,
          error
        );
      }
    }
  }

  /*
   * -------------------------------------------------------
   * ŞEHİR KAPAK GÖRSELLERİ
   * -------------------------------------------------------
   */

  const imagePath = path.join(
    process.cwd(),
    "data/ulkedataimages",
    `${region}.json`
  );

  let images: Record<string, any> = {};

  if (fs.existsSync(imagePath)) {
    try {
      images = JSON.parse(
        fs.readFileSync(imagePath, "utf-8")
      );
    } catch (error) {
      console.error(
        `Bölge görselleri okunamadı: ${imagePath}`,
        error
      );
    }
  }

  return (
<RegionClient 
  region={region}
  regionName={regionName}
  lang={lang}
  data={cityData}
  images={images}
/>
  );
}