import { Metadata } from "next";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";
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

async function getActiveLang() {
  const headerList = await headers();
  const currentPath = headerList.get("x-url") || "";
  const middlewareLang = headerList.get("x-url-lang");
  
  if (middlewareLang === "en" || currentPath.includes("/en/")) {
    return "en";
  }
  return "tr";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const lang = await getActiveLang(); // Kendi fonksiyonun
  const baseUrl = "https://www.waylero.com";

  // Bölge ismini düzenle (regionNameMap'in tanımlı olduğunu varsayıyorum)
  const displayTitle = regionNameMap[region]?.[lang] ?? 
                       region.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const isEn = lang === "en";
  const texts = {
    tr: { 
        title: `${displayTitle} Gezilecek Yerler`, 
        desc: `${displayTitle} bölgesindeki en popüler şehirleri keşfedin ve rehberinizi oluşturun.` 
    },
    en: { 
        title: `Places to Visit in ${displayTitle}`, 
        desc: `Discover the best cities and travel guides in ${displayTitle}.` 
    }
  }[lang];

  const pathUrl = `/kesfet/${region}`;
  const canonical = isEn ? `${baseUrl}/en${pathUrl}` : `${baseUrl}${pathUrl}`;

  return {
    title: `${texts.title} | Waylero`,
    description: texts.desc,

    // 🔥 CANONICAL + HREFLANG (SEO'nun kalbi)
    alternates: {
      canonical,
      languages: {
        "tr-TR": `${baseUrl}${pathUrl}`,
        "en-US": `${baseUrl}/en${pathUrl}`,
      },
    },

    // 🔥 OPEN GRAPH (WhatsApp, Facebook, Twitter, LinkedIn paylaşımı)
    openGraph: {
      title: texts.title,
      description: texts.desc,
      url: canonical,
      siteName: "Waylero",
      type: "website",
      locale: isEn ? "en_US" : "tr_TR",
      // Eğer bölge için genel bir görselin varsa buraya ekle:
      // images: [`${baseUrl}/og-images/${region}.jpg`], 
    },

    // 🔥 TWITTER CARD
    twitter: {
      card: "summary_large_image",
      title: texts.title,
      description: texts.desc,
      site: "@waylero", // Varsa twitter kullanıcı adın
    },

    // 🔥 INDEX CONTROL (Google'ın sayfayı taraması için)
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function Page({ params }: Props) {
  const { region } = await params;
  const lang = await getActiveLang();

  const dataFolderPath = path.join(
    process.cwd(),
    "app/data/ulkelerdata",
    region
  );

  let cityData: any = {};

  if (fs.existsSync(dataFolderPath)) {
    const files = fs.readdirSync(dataFolderPath);

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const cityName = file.replace(".json", "");
        const filePath = path.join(dataFolderPath, file);
        const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        cityData[cityName] = fileContent;
      }
    });
  }

  const imagesPath = path.join(
    process.cwd(),
    "app/data/ulkedataimages",
    `${region}.json`
  );

  let images: any = {};

  if (fs.existsSync(imagesPath)) {
    try {
      const fileContent = fs.readFileSync(imagesPath, "utf-8");
      images = JSON.parse(fileContent);
    } catch (e) {
      console.error("❌ Görsel dosyası okunamadı");
    }
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
