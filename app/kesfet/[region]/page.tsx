import { Metadata } from "next";
import RegionClient from "./RegionClient";

type Props = {
  params: Promise<{ region: string }>;
};

// ✅ Senin elindeki listeyi buraya koyuyoruz (Bölge tespiti için)
const countryToRegionMap: Record<string, string> = {
  turkiye: "turkey", fransa: "europa", almanya: "europa", italya: "europa", kktc: "europa",
  ispanya: "europa", ingiltere: "europa", hollanda: "europa", 
  avusturya: "europa", yunanistan: "europa", "cek-cumhuriyeti": "europa", rusya: "europa",
  portekiz: "europa", romanya: "europa", danimarka: "europa", urdun: "asia",
  isvec: "europa", norvec: "europa", isvicre: "europa", endonezya: "europa", 
  irlanda: "europa", "bosna-hersek": "europa", avustralya: "europa", 
  gurcistan: "europa", iskocya: "europa", galler: "europa", malezya: "europa", 
  cin: "asia", hindistan: "asia", tayland: "europa", "guney-kore": "asia", filipinler: "europa", 
  japonya: "asia", "sri-lanka": "asia", singapur: "europa", amerika: "europa", umman: "europa", 
  "suudi-arabistan": "europa", misir: "europa", belarus: "europa"
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = (await params).region;
  
  // ✅ Başlığı güzelleştirelim: "fransa" -> "Fransa"
  // Eğer url'de "cek-cumhuriyeti" varsa -> "Cek Cumhuriyeti" yapar.
  const displayTitle = region
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // ✅ Eğer gelen "region" bir ülkeyse farklı, bölgeyse (europa/asia) farklı açıklama yazdıralım
  const isCountry = !!countryToRegionMap[region];
  const description = isCountry 
    ? `${displayTitle} ülkesindeki en popüler şehirleri ve gezilecek yerleri keşfedin. En güncel ${displayTitle} gezi rehberi.`
    : `${displayTitle} bölgesindeki ülkeleri ve şehirleri keşfedin. Waylero ile seyahatinizi planlayın.`;

  return {
    title: `${displayTitle} Gezilecek Yerler | Waylero`,
    description: description,
    alternates: {
      canonical: `https://www.waylero.com/kesfet/${region}`,
    },
    openGraph: {
      title: `${displayTitle} Gezilecek Yerler`,
      description: description,
      images: [`/assets/seo/${region}.jpg`], // Opsiyonel: Her ülkeye bir kapak resmi koyarsan efsane olur
    }
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  return <RegionClient region={resolvedParams.region} />;
}