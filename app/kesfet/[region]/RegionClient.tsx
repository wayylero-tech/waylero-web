"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLang } from "../../context/LanguageContext";

// ✅ VERİLERİ İMPORT ET
import turkey from "../../data/turkey.json";
import europa from "../../data/europa.json";
import asia from "../../data/asia.json";
import turkeyImages from "../../data/images/turkey.json";
import europaImages from "../../data/images/europa.json";
import asiaImages from "../../data/images/asia.json";

// ✅ MAP'LER
const countryToRegionMap: Record<string, string> = {
  turkiye: "turkey", fransa: "europa", almanya: "europa", italya: "europa", kktc: "europa",
  ispanya: "europa", ingiltere: "europa", hollanda: "europa", 
  avusturya: "europa", yunanistan: "europa", "cek-cumhuriyeti": "europa", rusya: "europa",
  portekiz: "europa", romanya: "europa", danimarka: "europa", urdun: "asia",
  isvec: "europa", norvec: "europa", isvicre: "europa", endonezya: "europa", 
  irlanda: "europa", "bosna-hersek": "europa", avustralya: "europa", 
  gurcistan: "europa", iskocya: "europa", galler: "europa", malezya: "europa", 
  cin: "asia", hindistan: "asia", tayland: "europa", "guney-kore": "europa", filipinler: "europa", 
  japonya: "asia", "sri-lanka": "asia", singapur: "europa", amerika: "europa", umman: "europa", 
  "suudi-arabistan": "europa", misir: "europa", belarus: "europa"
};

const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "sirnak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "arizona": "amerika", "las-vegas": "amerika", "birmingham": "amerika", "montgomery": "amerika", "anchorage": "amerika", "fairbanks": "amerika", "juneau": "amerika", "sitka": "amerika", "mesa": "amerika", "scottsdale": "amerika", "phoenix": "amerika", "tucson": "amerika", "glendale": "amerika", "sandiego": "amerika", "sacramento": "amerika", "sanjose": "amerika", "miami": "amerika", "orlando": "amerika", "tampa": "amerika",
  "berlin": "almanya", "bremen": "almanya", "hamburg": "almanya", "stuttgart": "almanya", "munih": "almanya", "frankfurt": "almanya", "dusseldorf": "almanya",  "leipzig": "almanya", "dresden": "almanya", "weil-am-rhein": "almanya","koln": "almanya",
  "paris": "fransa", "lyon": "fransa", "amiens": "fransa", "chartes": "fransa", "nancy": "fransa", "strazburg": "fransa", "bourges": "fransa", "avignon": "fransa", "toulse": "fransa", "ordesa": "fransa", "brugge": "fransa",
  "roma": "italya", "marche": "italya", "milano": "italya", "napoli": "italya", "torino": "italya", "venedik": "italya", "verona": "italya", "floransa": "italya", "bologna": "italya", "palermo": "italya", "catania": "italya",
  "madrid": "ispanya", "barselona": "ispanya", "valencia": "ispanya", "sevilla": "ispanya", "malaga": "ispanya", "zaragoza": "ispanya", "bilbao": "ispanya", "palma-de-mallorca": "ispanya", "alicante": "ispanya", "granada": "ispanya",
  "londra": "ingiltere", "manchester": "ingiltere", "liverpool": "ingiltere", "leeds": "ingiltere", "bristol": "ingiltere", "sheffield": "ingiltere", "nottingham": "ingiltere", "newcastle": "ingiltere", "cambridge": "ingiltere",
  "rotterdam": "hollanda", "guneyhollanda": "hollanda", "kuzeyhollanda": "hollanda", "utrecht": "hollanda", "limburg": "hollanda", "friesland": "hollanda", "groningen": "hollanda", "overijssel": "hollanda", "drenthe": "hollanda","lahey": "hollanda","eindhoven": "hollanda","tilburg": "hollanda","almere": "hollanda","breda": "hollanda","haarlem": "hollanda",
  "viyana": "avusturya", "salzburg": "avusturya", "innsbruck": "avusturya", "graz": "avusturya", "bregenz": "avusturya", "niederosterreich": "avusturya", "oberosterreich": "avusturya", "seefeld": "avusturya",
  "billund": "danimarka", "esbjerg": "danimarka", "helsingor": "danimarka", "roskilde": "danimarka", "skagen": "danimarka", "odense": "danimarka", "aarhus": "danimarka", "kopenhag": "danimarka",
  "stockholm": "isvec", "uppsala": "isvec", "goteborg": "isvec", "malmo": "isvec", "vasteras": "isvec", "ostersund": "isvec", "linkoping": "isvec",
  "oslo": "norvec", "bergen": "norvec", "stavanger": "norvec", "drammen": "norvec", "trondheim": "norvec", "tromso": "norvec", "kristiansand": "norvec", "fredrikstad": "norvec", "sandnes": "norvec", "arendal": "norvec",
  "zurich": "isvicre", "geneva": "isvicre", "bern": "isvicre", "basel": "isvicre", "lausanne": "isvicre", "lucerne": "isvicre", "stmoritz": "isvicre", "interlaken": "isvicre", "lugano": "isvicre", "winterthur": "isvicre","lozan": "isvicre",
  "atina": "yunanistan", "santorini": "yunanistan", "mykonos": "yunanistan", "girit-adasi": "yunanistan", "korint": "yunanistan", "zakynhos": "yunanistan", "peloponez-yarimadasi": "yunanistan", "kafelonya-adasi": "yunanistan", "delos-adasi": "yunanistan", "rodos-adasi": "yunanistan", "selanik": "yunanistan", "veria": "yunanistan", "greece": "yunanistan",
  "lizbon": "portekiz", "porto": "portekiz", "coimbra": "portekiz", "braga": "portekiz", "aveiro": "portekiz", "amadora": "portekiz", "funchal": "portekiz", "viseu": "portekiz", "evora": "portekiz", "almada": "portekiz",
  "peru": "peru",
  "prague": "cek cumhuriyeti", "brno": "cek cumhuriyeti", "ostrava": "cek cumhuriyeti", "plzen": "cek cumhuriyeti", "liberec": "cek cumhuriyeti",
  "edinburgh": "iskocya", "glasgow": "iskocya", "aberdeen": "iskocya", "dundee": "iskocya", "inverness": "iskocya", "stirling": "iskocya", "st andrews": "iskocya", "oban": "iskocya",  "pitlochry": "iskocya",
  "lefkosa": "kktc", "girne": "kktc", "gazimagusa": "kktc", "guzelyurt": "kktc",
  "bukres": "romanya", "cluj-napoca": "romanya", "timisoara": "romanya", "iasi": "romanya", "constanta": "romanya", "brasov": "romanya", "galati": "romanya", "craiova": "romanya", "ploiesti": "romanya", "oradea": "romanya",
  "delhi": "hindistan", "agra": "hindistan", "jaipur": "hindistan", "varanasi": "hindistan", "mumbai": "hindistan", "goa": "hindistan", "kerala": "hindistan", "rishikesh-haridwar": "hindistan", "haridwar": "hindistan", "udaipur": "hindistan", "amritsar": "hindistan",
  "bangkok": "tayland",
  "wadi-musa": "urdun",
  "cardiff": "galler",
  "singapur": "singapur",
  "seul": "guney-kore",
  "dubai": "bae",
  "sri-lanka": "sri-lanka",
  "moskova": "rusya", "stpeterburg": "rusya", "kazan": "rusya",
  "manila": "filipinler", "cebu": "filipinler", "boracay": "filipinler", "davao": "filipinler", "palawan": "filipinler", "bohol": "filipinler", "tagaytay": "filipinler", "iloilo": "filipinler", "vigan": "filipinler", "dumaguete": "filipinler",
  "sidney": "avustralya", "melbourne": "avustralya", "brisbane": "avustralya", "adelaide": "avustralya", "perth": "avustralya", "hobart": "avustralya", "canberra": "avustralya",    "darwin": "avustralya", "cairns": "avustralya", "whitsunday-adalari": "avustralya", "gold-coast": "avustralya",
  "tiflis": "gurcistan", "batum": "gurcistan", "uplistsikhe": "gurcistan", "mtskheta": "gurcistan", "kazbegi": "gurcistan", "vardzia": "gurcistan", "sighnaghi": "gurcistan", "racha region": "gurcistan", "david-gareja": "gurcistan", "tskaltubo": "gurcistan",
  "belarus": "belarus",
  "bali": "endonezya", "ubud": "endonezya", "seminyak": "endonezya", "canggu": "endonezya", "kuta": "endonezya", "uluwatu": "endonezya",
  "mekke": "suudi-arabistan", "medine": "suudi-arabistan", "riyad": "suudi-arabistan",
  "kualalumpur": "malezya",
  "kahire": "misir","luksor": "misir","iskenderiye": "misir","giza": "misir","sarm-el-seyh": "misir",
  "dublin": "irlanda", "galway": "irlanda", "cork": "irlanda", "limerick": "irlanda", "kilkenny": "irlanda", "waterford": "irlanda", "belfast": "irlanda",
  "muskat": "umman", "masirah-adasi": "umman", "ras-al-jinz": "umman", "sur": "umman", "jabel-shams": "umman", "salalah": "umman", "wahiba-sands": "umman", "nizwa": "umman",
  "saraybosna": "bosna-hersek", "mostar": "bosna-hersek", "travnik": "bosna-hersek", "jajce": "bosna-hersek", "banja-luka": "bosna-hersek", "pocitel": "bosna-hersek", "ljubuski": "bosna-hersek", "neum": "bosna-hersek", "tuzla": "bosna-hersek",
  "tokyo": "japonya", "kyoto": "japonya", "osaka": "japonya", "nara": "japonya", "hakone": "japonya", "fujikawaguchiko": "japonya", "hiroshima": "japonya", "kamakura": "japonya", "nikko": "japonya", "takayama": "japonya", "kanazawa": "japonya", "hokkaido": "japonya", "hakusan": "japonya", "nagano": "japonya", "yamaguchi": "japonya","hirosima": "japonya",
  "beijing": "cin", "shanghai": "cin", "xian": "cin", "guilin": "cin", "chengdu": "cin", "hongkong": "cin", "hangzhou": "cin", "lijiang": "cin","xi-anfianal": "cin",
};


const slugify = (text: string) => {
  if (!text) return "";
  const trMap: any = { ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u", Ç: "C", Ğ: "G", İ: "I", I: "i", Ö: "O", Ş: "S", Ü: "U" };
  return text.toString().replace(/[çğışüöÇĞİŞÜÖ]/g, (m) => trMap[m]).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
};


// 1. Props interface'ini buraya ekle (TypeScript için)
interface RegionClientProps {
  region: string;
  lang: string; // 👈 Server'dan gelecek olan dil
}

// 2. Fonksiyonu bu props'u alacak şekilde güncelle
export default function RegionClient({ region, lang: propLang }: RegionClientProps) {
  // Mevcut useLang context'ini de yedek olarak tutabilirsin
  const { lang: contextLang } = useLang();
  
  // Hangisi doluysa onu kullan (Server prop'u öncelikli)
  const lang = propLang || contextLang || "tr";
  
  const isCountry = !!countryToRegionMap[region];
  // ... (Geri kalan kodun aynı devam ediyor)
  const targetRegion = isCountry ? countryToRegionMap[region] : region;
  
  const allData: any = { turkey, europa, asia };
  const allImages: any = { turkey: turkeyImages, europa: europaImages, asia: asiaImages };
  
  const dataKey = targetRegion === "turkiye" || targetRegion === "turkey" ? "turkey" : targetRegion;
  const dataSource = allData[dataKey] || {};

  // 🌍 DİL SÖZLÜĞÜ (Region Sayfası İçin)
  const t = {
    tr: {
      discoverTitle: "Keşfedin",
      countryDesc: "Bu ülkedeki en popüler şehirleri keşfedin.",
      regionDesc: "Bölgedeki şehirler.",
      placeSuffix: "GEZİLECEK YER",
      fallbackCity: "Şehir"
    },
    en: {
      discoverTitle: "Explore",
      countryDesc: "Explore the most popular cities in this country.",
      regionDesc: "Cities in this region.",
      placeSuffix: "PLACES TO VISIT",
      fallbackCity: "City"
    }
  }[lang as "tr" | "en"];

  const countryCities = useMemo(() => {
    return Object.entries(dataSource)
      .filter(([cityKey]) => {
        const citySlug = slugify(cityKey);
        return isCountry ? cityToCountryMap[citySlug] === region : true;
      })
      .map(([cityKey, places]: [string, any]) => {
        const citySlug = slugify(cityKey);
        const regionImages = allImages[dataKey]?.[cityKey] || {};
        const firstPlace = places[0];
        const imageKey = `${citySlug}-${slugify(firstPlace.slug)}`;
        const coverImage = regionImages[imageKey]?.[0] || regionImages[firstPlace.slug]?.[0];

        return {
          name: cityKey,
          slug: citySlug,
          placeCount: places.length,
          coverImage
        };
      });
  }, [region, isCountry, dataSource, dataKey, allImages]);

  const getLocalizedLink = (path: string) => (lang === "tr" ? path : `/${lang}${path.startsWith("/") ? path : `/${path}`}`);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans">
      <div className="mb-12">
        <h1 className="text-5xl font-black capitalize text-gray-900 drop-shadow-sm flex items-center gap-4">
          {region.replace(/-/g, " ")} 
          <span className="text-blue-600 text-3xl opacity-50">/ {t.discoverTitle}</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg font-medium">
          {isCountry ? t.countryDesc : t.regionDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {countryCities.map((city) => (
          <Link 
            key={city.slug}
            href={getLocalizedLink(`/kesfet/${targetRegion}/${city.slug}`)}
            className="group relative h-96 w-full overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-200 block"
          >
            {city.coverImage ? (
              <img 
                src={city.coverImage} 
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={`${city.name} ${t.fallbackCity}`}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-4xl">🏙️</div>
            )}
            
            {/* Karartma Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-white text-3xl font-black mb-1">{city.name}</h3>
              <p className="text-blue-400 font-extrabold tracking-widest text-xs uppercase">
                {city.placeCount} {t.placeSuffix}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}