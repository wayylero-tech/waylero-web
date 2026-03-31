
import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = false;

// Veriler
import turkey from "@/app/data/turkey.json";
import europa from "@/app/data/europa.json";
import asia from "@/app/data/asia.json";
import cities from "@/app/data/cities.json";

// Bloglar
import { konyaPosts } from "@/app/data/blog/konya/posts";
import { konyaPosts2 } from "@/app/data/blog/konya/posts2";
import { istanbulPosts } from "@/app/data/blog/istanbul/posts";
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";

// --- KRİTİK: Şehir-Ülke Eşleşme Haritası ---
// Middleware ile aynı olması lazım kanka
const cityToCountryMap: Record<string, string> = {
  // Türkiye
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "sirnak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  // Amerika
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "arizona": "amerika", "las-vegas": "amerika", "birmingham": "amerika", "montgomery": "amerika", "anchorage": "amerika", "fairbanks": "amerika", "juneau": "amerika", "sitka": "amerika", "mesa": "amerika", "scottsdale": "amerika", "phoenix": "amerika", "tucson": "amerika", "glendale": "amerika", "sandiego": "amerika", "sacramento": "amerika", "sanjose": "amerika", "miami": "amerika", "orlando": "amerika", "tampa": "amerika",
  // Almanya
  "berlin": "almanya", "bremen": "almanya", "hamburg": "almanya", "stuttgart": "almanya", "munih": "almanya", "frankfurt": "almanya", "dusseldorf": "almanya",  "leipzig": "almanya", "dresden": "almanya", "weil-am-rhein": "almanya","koln": "almanya",
  // Fransa
  "paris": "fransa", "lyon": "fransa", "amiens": "fransa", "chartes": "fransa", "nancy": "fransa", "strazburg": "fransa", "bourges": "fransa", "avignon": "fransa", "toulse": "fransa", "ordesa": "fransa", "brugge": "fransa",
  // İtalya
  "roma": "italya", "marche": "italya", "milano": "italya", "napoli": "italya", "torino": "italya", "venedik": "italya", "verona": "italya", "floransa": "italya", "bologna": "italya", "palermo": "italya", "catania": "italya",
  // İspanya
  "madrid": "ispanya", "barselona": "ispanya", "valencia": "ispanya", "sevilla": "ispanya", "malaga": "ispanya", "zaragoza": "ispanya", "bilbao": "ispanya", "palmademallorca": "ispanya", "alicante": "ispanya", "granada": "ispanya",
  // İngiltere
  "londra": "ingiltere", "manchester": "ingiltere", "liverpool": "ingiltere", "leeds": "ingiltere", "bristol": "ingiltere", "sheffield": "ingiltere", "nottingham": "ingiltere", "newcastle": "ingiltere", "cambridge": "ingiltere",
  // Hollanda
  "rotterdam": "hollanda", "guneyhollanda": "hollanda", "kuzeyhollanda": "hollanda", "utrecht": "hollanda", "limburg": "hollanda", "friesland": "hollanda", "groningen": "hollanda", "overijssel": "hollanda", "drenthe": "hollanda","lahey": "hollanda","eindhoven": "hollanda","tilburg": "hollanda","almere": "hollanda","breda": "hollanda","haarlem": "hollanda",
  // Avusturya
  "viyana": "avusturya", "salzburg": "avusturya", "innsbruck": "avusturya", "graz": "avusturya", "bregenz": "avusturya", "niederosterreich": "avusturya", "oberosterreich": "avusturya", "seefeld": "avusturya",
  // Danimarka
  "billund": "danimarka", "esbjerg": "danimarka", "helsingor": "danimarka", "roskilde": "danimarka", "skagen": "danimarka", "odense": "danimarka", "aarhus": "danimarka", "kopenhag": "danimarka",
// İsveç
"stockholm": "isvec", "uppsala": "isvec", "goteborg": "isvec", "malmo": "isvec", "vasteras": "isvec", "ostersund": "isvec", "linkoping": "isvec",
// Norveç
"oslo": "norvec", "bergen": "norvec", "stavanger": "norvec", "drammen": "norvec", "trondheim": "norvec", "tromso": "norvec", "kristiansand": "norvec", "fredrikstad": "norvec", "sandnes": "norvec", "arendal": "norvec",

// İsviçre
"zurich": "isvicre", "geneva": "isvicre", "bern": "isvicre", "basel": "isvicre", "lausanne": "isvicre", "lucerne": "isvicre", "st moritz": "isvicre", "interlaken": "isvicre", "lugano": "isvicre", "winterthur": "isvicre",
// Finlandiya
"helsinki": "finlandiya", "rovaniemi": "finlandiya", "espoo": "finlandiya", "tampere": "finlandiya", "vantaa": "finlandiya", "oulu": "finlandiya",

// Yunanistan
"atina": "yunanistan",
"santorini": "yunanistan",
"mykonos": "yunanistan",
"girit-adasi": "yunanistan",
"korint": "yunanistan",
"zakynhos": "yunanistan",
"peloponez-yarimadasi": "yunanistan",
"kafelonya-adasi": "yunanistan",
"delos-adasi": "yunanistan",
"rodos-adasi": "yunanistan",
"selanik": "yunanistan",
"veria": "yunanistan",
"greece": "yunanistan",

// Portekiz
"lizbon": "portekiz", "porto": "portekiz", "coimbra": "portekiz", "braga": "portekiz", "aveiro": "portekiz", "amadora": "portekiz", "funchal": "portekiz", "viseu": "portekiz", "evora": "portekiz", "almada": "portekiz",

// Peru
"peru": "peru",
// Çek Cumhuriyeti
"prague": "cek cumhuriyeti", "brno": "cek cumhuriyeti", "ostrava": "cek cumhuriyeti", "plzen": "cek cumhuriyeti", "liberec": "cek cumhuriyeti",

// Macaristan
"budapest": "macaristan", "debrecen": "macaristan", "szeged": "macaristan", "miskolc": "macaristan", "pecs": "macaristan",

// Slovakya
"bratislava": "slovakya", "kosice": "slovakya", "nitra": "slovakya", "presov": "slovakya", "zilina": "slovakya",
// İskoçya
"edinburgh": "iskocya", "glasgow": "iskocya", "aberdeen": "iskocya", "dundee": "iskocya", "inverness": "iskocya", "stirling": "iskocya", "st andrews": "iskocya", "oban": "iskocya",  "pitlochry": "iskocya",
// KKTC
"lefkosa": "kktc", "girne": "kktc", "gazimagusa": "kktc", "guzelyurt": "kktc",

// Romanya
"bukres": "romanya", "cluj-napoca": "romanya", "timisoara": "romanya", "iasi": "romanya", "constanta": "romanya", "brasov": "romanya", "galati": "romanya", "craiova": "romanya", "ploiesti": "romanya", "oradea": "romanya",
// Hindistan
"delhi": "hindistan", "agra": "hindistan", "jaipur": "hindistan", "varanasi": "hindistan", "mumbai": "hindistan", "goa": "hindistan", "kerala": "hindistan", "rishikesh-haridwar": "hindistan", "haridwar": "hindistan", "udaipur": "hindistan", "amritsar": "hindistan",

// Tayland
"bangkok": "tayland",

// Galler
"cardiff": "galler",

// Singapore
"singapore": "singapore",

// Güney Kore
"seul": "guney kore",

// BAE
"dubai": "bae",
// sri-lanka
"sri-lanka": "sri-lanka",

// Rusya
"moskova": "rusya", "stpeterburg": "rusya", "kazan": "rusya",

// Mısır
"cairo": "misir", "luksor": "misir", "iskenderiye": "misir", "giza": "misir", "sharm el-sheikh": "misir","kahire": "misir",

// Filipinler
"manila": "filipinler", "cebu": "filipinler", "boracay": "filipinler", "davao": "filipinler", "palawan": "filipinler", "bohol": "filipinler", "tagaytay": "filipinler", "iloilo": "filipinler", "vigan": "filipinler", "dumaguete": "filipinler",

// Avustralya
"sidney": "avustralya", "melbourne": "avustralya", "brisbane": "avustralya", "adelaide": "avustralya", "perth": "avustralya", "hobart": "avustralya", "canberra": "avustralya",    "darwin": "avustralya", "cairns": "avustralya", "whitsunday-adalari": "avustralya", "gold-coast": "avustralya",

// Gürcistan
"tiflis": "gurcistan", "batum": "gurcistan", "uplistsikhe": "gurcistan", "mtskheta": "gurcistan", "kazbegi": "gurcistan", "vardzia": "gurcistan", "sighnaghi": "gurcistan", "racha region": "gurcistan", "david-gareja": "gurcistan", "tskaltubo": "gurcistan",
// Belarus
"belarus": "belarus",

// Endonezya
"bali": "endonezya", "ubud": "endonezya", "seminyak": "endonezya", "canggu": "endonezya", "kuta": "endonezya", "uluwatu": "endonezya",

// Suudi Arabistan
"mekke": "suudi-arabistan", "medine": "suudi-arabistan", "riyad": "suudi-arabistan",

// Malezya
"kualalumpur": "malezya",

// İrlanda
"dublin": "irlanda", "galway": "irlanda", "cork": "irlanda", "limerick": "irlanda", "kilkenny": "irlanda", "waterford": "irlanda", "belfast": "irlanda",

// Umman
"muskat": "umman", "masirah-adasi": "umman", "ras-al-jinz": "umman", "sur": "umman", "jabel-shams": "umman", "salalah": "umman", "wahiba-sands": "umman", "nizwa": "umman",

// Bosna Hersek
"saraybosna": "bosna-hersek", "mostar": "bosna-hersek", "travnik": "bosna-hersek", "jajce": "bosna-hersek", "banja-luka": "bosna-hersek", "pocitel": "bosna-hersek", "ljubuski": "bosna-hersek", "neum": "bosna-hersek", "tuzla": "bosna-hersek",

// Japonya
"tokyo": "japonya", "kyoto": "japonya", "osaka": "japonya", "nara": "japonya", "hakone": "japonya", "fujikawaguchiko": "japonya", "hiroshima": "japonya", "kamakura": "japonya", "nikko": "japonya", "takayama": "japonya", "kanazawa": "japonya", "hokkaido": "japonya", "hakusan": "japonya", "nagano": "japonya", "yamaguchi": "japonya","hirosima": "japonya",
// Çin
"beijing": "cin", "shanghai": "cin", "xian": "cin", "guilin": "cin", "chengdu": "cin", "hongkong": "cin", "hangzhou": "cin", "lijiang": "cin","xi-anfianal": "cin",
  // Diğerleri
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.waylero.com";
  const now = new Date();

  const sanitize = (str: string) => str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, '')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // --- 0. Statik Sayfalar (Anasayfa & Keşfet) ---
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/kesfet", priority: 0.7 },
  ];

  staticPages.forEach(page => {
    // TR
    sitemapEntries.push({ url: `${baseUrl}${page.url}`, lastModified: now, priority: page.priority });
    // EN
    sitemapEntries.push({ url: `${baseUrl}/en${page.url}`, lastModified: now, priority: page.priority });
  });

  // --- 1. 🌍 Gezi Yerleri (Mekanlar) ---
  const regions: any = { turkey, europa, asia };
  
  Object.entries(regions).forEach(([regionKey, regionData]: [string, any]) => {
    Object.entries(regionData).forEach(([cityName, places]: [string, any]) => {
      const cleanCity = sanitize(cityName);
      let finalCountry = regionKey === "turkey" ? "turkiye" : (cityToCountryMap[cleanCity] || regionKey);

      places.forEach((place: any) => {
        const path = `/kesfet/${finalCountry}/${cleanCity}/${place.slug}`;
        // TR
        sitemapEntries.push({ url: `${baseUrl}${path}`, lastModified: now, priority: 0.8 });
        // EN
        sitemapEntries.push({ url: `${baseUrl}/en${path}`, lastModified: now, priority: 0.7 });
      });
    });
  });

  // --- 2. ⭐ Şehirler (waylero.com/istanbul) ---
  cities.forEach((city: any) => {
    const cityPath = `/${sanitize(city.slug)}`;
    // TR
    sitemapEntries.push({ url: `${baseUrl}${cityPath}`, lastModified: now, priority: 0.9 });
    // EN
    sitemapEntries.push({ url: `${baseUrl}/en${cityPath}`, lastModified: now, priority: 0.8 });
  });

  // --- 3. 📝 Blog Yazıları ---
  const allPosts = [...generalPosts, ...uygulamaPosts, ...antikkentPosts, ...konyaPosts, ...konyaPosts2, ...istanbulPosts];

  allPosts.forEach((post: any) => {
    const blogPath = `/blog/${sanitize(post.city)}/${post.slug}`;
    const postDate = new Date(post.updatedAt ?? post.createdAt ?? now);
    // TR
    sitemapEntries.push({ url: `${baseUrl}${blogPath}`, lastModified: postDate, priority: 0.6 });
    // EN
    sitemapEntries.push({ url: `${baseUrl}/en${blogPath}`, lastModified: postDate, priority: 0.5 });
  });

  return sitemapEntries;
}
