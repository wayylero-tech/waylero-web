import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = false;

// Veriler
import turkey from "@/app/data/turkey.json";
import europa from "@/app/data/europa.json";
import asia from "@/app/data/asia.json";
import cities from "@/app/data/cities.json";
import { wayleroLiveVideos, addSlugs } from "@/videos"; // 🎥 Videolar eklendi

// Bloglar
import { konyaPosts } from "@/app/data/blog/konya/posts";
import { konyaPosts2 } from "@/app/data/blog/konya/posts2";
import { istanbulPosts } from "@/app/data/blog/istanbul/posts";
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";

// --- Şehir-Ülke Eşleşme Haritası ---
const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "sirnak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "arizona": "amerika", "las-vegas": "amerika", "birmingham": "amerika", "montgomery": "amerika", "anchorage": "amerika", "fairbanks": "amerika", "juneau": "amerika", "sitka": "amerika", "mesa": "amerika", "scottsdale": "amerika", "phoenix": "amerika", "tucson": "amerika", "glendale": "amerika", "sandiego": "amerika", "sacramento": "amerika", "sanjose": "amerika", "miami": "amerika", "orlando": "amerika", "tampa": "amerika",
  "berlin": "almanya", "bremen": "almanya", "hamburg": "almanya", "stuttgart": "almanya", "munih": "almanya", "frankfurt": "almanya", "dusseldorf": "almanya", "leipzig": "almanya", "dresden": "almanya", "weil-am-rhein": "almanya", "koln": "almanya",
  "paris": "fransa", "lyon": "fransa", "amiens": "fransa", "chartes": "fransa", "nancy": "fransa", "strazburg": "fransa", "bourges": "fransa", "avignon": "fransa", "toulse": "fransa", "ordesa": "fransa", "brugge": "fransa",
  "roma": "italya", "marche": "italya", "milano": "italya", "napoli": "italya", "torino": "italya", "venedik": "italya", "verona": "italya", "floransa": "italya", "bologna": "italya", "palermo": "italya", "catania": "italya",
  "madrid": "ispanya", "barselona": "ispanya", "valencia": "ispanya", "sevilla": "ispanya", "malaga": "ispanya", "zaragoza": "ispanya", "bilbao": "ispanya", "palmademallorca": "ispanya", "alicante": "ispanya", "granada": "ispanya",
  "londra": "ingiltere", "manchester": "ingiltere", "liverpool": "ingiltere", "leeds": "ingiltere", "bristol": "ingiltere", "sheffield": "ingiltere", "nottingham": "ingiltere", "newcastle": "ingiltere", "cambridge": "ingiltere",
  "rotterdam": "hollanda", "guneyhollanda": "hollanda", "kuzeyhollanda": "hollanda", "utrecht": "hollanda", "limburg": "hollanda", "friesland": "hollanda", "groningen": "hollanda", "overijssel": "hollanda", "drenthe": "hollanda", "lahey": "hollanda", "eindhoven": "hollanda", "tilburg": "hollanda", "almere": "hollanda", "breda": "hollanda", "haarlem": "hollanda",
  "viyana": "avusturya", "salzburg": "avusturya", "innsbruck": "avusturya", "graz": "avusturya", "bregenz": "avusturya", "niederosterreich": "avusturya", "oberosterreich": "avusturya", "seefeld": "avusturya",
  "billund": "danimarka", "esbjerg": "danimarka", "helsingor": "danimarka", "roskilde": "danimarka", "skagen": "danimarka", "odense": "danimarka", "aarhus": "danimarka", "kopenhag": "danimarka",
  "stockholm": "isvec", "uppsala": "isvec", "goteborg": "isvec", "malmo": "isvec", "vasteras": "isvec", "ostersund": "isvec", "linkoping": "isvec",
  "oslo": "norvec", "bergen": "norvec", "stavanger": "norvec", "drammen": "norvec", "trondheim": "norvec", "tromso": "norvec", "kristiansand": "norvec", "fredrikstad": "norvec", "sandnes": "norvec", "arendal": "norvec",
  "zurich": "isvicre", "geneva": "isvicre", "bern": "isvicre", "basel": "isvicre", "lausanne": "isvicre", "lucerne": "isvicre", "st moritz": "isvicre", "interlaken": "isvicre", "lugano": "isvicre", "winterthur": "isvicre",
  "helsinki": "finlandiya", "rovaniemi": "finlandiya", "espoo": "finlandiya", "tampere": "finlandiya", "vantaa": "finlandiya", "oulu": "finlandiya",
  "atina": "yunanistan", "santorini": "yunanistan", "mykonos": "yunanistan", "girit-adasi": "yunanistan", "korint": "yunanistan", "zakynhos": "yunanistan", "peloponez-yarimadasi": "yunanistan", "kafelonya-adasi": "yunanistan", "delos-adasi": "yunanistan", "rodos-adasi": "yunanistan", "selanik": "yunanistan", "veria": "yunanistan", "greece": "yunanistan",
  "lizbon": "portekiz", "porto": "portekiz", "coimbra": "portekiz", "braga": "portekiz", "aveiro": "portekiz", "amadora": "portekiz", "funchal": "portekiz", "viseu": "portekiz", "evora": "portekiz", "almada": "portekiz",
  "peru": "peru", "prague": "cek cumhuriyeti", "brno": "cek cumhuriyeti", "ostrava": "cek cumhuriyeti", "plzen": "cek cumhuriyeti", "liberec": "cek cumhuriyeti",
  "budapest": "macaristan", "debrecen": "macaristan", "szeged": "macaristan", "miskolc": "macaristan", "pecs": "macaristan",
  "bratislava": "slovakya", "kosice": "slovakya", "nitra": "slovakya", "presov": "slovakya", "zilina": "slovakya",
  "edinburgh": "iskocya", "glasgow": "iskocya", "aberdeen": "iskocya", "dundee": "iskocya", "inverness": "iskocya", "stirling": "iskocya", "st andrews": "iskocya", "oban": "iskocya", "pitlochry": "iskocya",
  "lefkosa": "kktc", "girne": "kktc", "gazimagusa": "kktc", "guzelyurt": "kktc",
  "bukres": "romanya", "cluj-napoca": "romanya", "timisoara": "romanya", "iasi": "romanya", "constanta": "romanya", "brasov": "romanya", "galati": "romanya", "craiova": "romanya", "ploiesti": "romanya", "oradea": "romanya",
  "delhi": "hindistan", "agra": "hindistan", "jaipur": "hindistan", "varanasi": "hindistan", "mumbai": "hindistan", "goa": "hindistan", "kerala": "hindistan", "rishikesh-haridwar": "hindistan", "haridwar": "hindistan", "udaipur": "hindistan", "amritsar": "hindistan",
  "bangkok": "tayland", "cardiff": "galler", "singapore": "singapore", "seul": "guney kore", "dubai": "bae", "sri-lanka": "sri-lanka", "moskova": "rusya", "stpeterburg": "rusya", "kazan": "rusya",
  "cairo": "misir", "luksor": "misir", "iskenderiye": "misir", "giza": "misir", "sharm el-sheikh": "misir", "kahire": "misir",
  "manila": "filipinler", "cebu": "filipinler", "boracay": "filipinler", "davao": "filipinler", "palawan": "filipinler", "bohol": "filipinler", "tagaytay": "filipinler", "iloilo": "filipinler", "vigan": "filipinler", "dumaguete": "filipinler",
  "sidney": "avustralya", "melbourne": "avustralya", "brisbane": "avustralya", "adelaide": "avustralya", "perth": "avustralya", "hobart": "avustralya", "canberra": "avustralya", "darwin": "avustralya", "cairns": "avustralya", "whitsunday-adalari": "avustralya", "gold-coast": "avustralya",
  "tiflis": "gurcistan", "batum": "gurcistan", "uplistsikhe": "gurcistan", "mtskheta": "gurcistan", "kazbegi": "gurcistan", "vardzia": "gurcistan", "sighnaghi": "gurcistan", "racha region": "gurcistan", "david-gareja": "gurcistan", "tskaltubo": "gurcistan",
  "belarus": "belarus", "bali": "endonezya", "ubud": "endonezya", "seminyak": "endonezya", "canggu": "endonezya", "kuta": "endonezya", "uluwatu": "endonezya",
  "mekke": "suudi-arabistan", "medine": "suudi-arabistan", "riyad": "suudi-arabistan", "kualalumpur": "malezya",
  "dublin": "irlanda", "galway": "irlanda", "cork": "irlanda", "limerick": "irlanda", "kilkenny": "irlanda", "waterford": "irlanda", "belfast": "irlanda",
  "muskat": "umman", "masirah-adasi": "umman", "ras-al-jinz": "umman", "sur": "umman", "jabel-shams": "umman", "salalah": "umman", "wahiba-sands": "umman", "nizwa": "umman",
  "saraybosna": "bosna-hersek", "mostar": "bosna-hersek", "travnik": "bosna-hersek", "jajce": "bosna-hersek", "banja-luka": "bosna-hersek", "pocitel": "bosna-hersek", "ljubuski": "bosna-hersek", "neum": "bosna-hersek", "tuzla": "bosna-hersek",
  "tokyo": "japonya", "kyoto": "japonya", "osaka": "japonya", "nara": "japonya", "hakone": "japonya", "fujikawaguchiko": "japonya", "hiroshima": "japonya", "kamakura": "japonya", "nikko": "japonya", "takayama": "japonya", "kanazawa": "japonya", "hokkaido": "japonya", "hakusan": "japonya", "nagano": "japonya", "yamaguchi": "japonya", "hirosima": "japonya",
  "beijing": "cin", "shanghai": "cin", "xian": "cin", "guilin": "cin", "chengdu": "cin", "hongkong": "cin", "hangzhou": "cin", "lijiang": "cin", "xi-anfianal": "cin",
};

// Aktiviteler için sitemap'e eklenecek ana şehirler
const activityCities = [
  "adana", "adiyaman", "afyon", "afyonkarahisar", "agri", "aksaray", "amasya", 
  "ankara", "antalya", "ardahan", "artvin", "aydin", "balikesir", "bartin", 
  "batman", "bayburt", "bilecik", "bingol", "bitlis", "bolu", "burdur", 
  "bursa", "canakkale", "cankiri", "corum", "denizli", "diyarbakir", "duzce", 
  "edirne", "elazig", "erzincan", "erzurum", "eskisehir", "gaziantep", "giresun", 
  "gumushane", "hakkari", "hatay", "igdir", "isparta", "istanbul", "izmir", 
  "kahramanmaras", "karabuk", "karaman", "kars", "kastamonu", "kayseri", "kilis", 
  "kirikkale", "kirklareli", "kirsehir", "kktc", "kocaeli", "konya", "kutahya", 
  "lefkosa", "malatya", "manisa", "mardin", "mersin", "mugla", "mus", "nevsehir", 
  "nigde", "ordu", "osmaniye", "rize", "sakarya", "samsun", "sanliurfa", "siirt", 
  "sinop", "sirnak", "sivas", "tekirdag", "tokat", "trabzon", "tunceli", 
  "usak", "van", "yalova", "yozgat", "zonguldak"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.waylero.com";
  const now = new Date();

  const sanitize = (str: string) => str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, '')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // --- 0. Statik Sayfalar ---
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/kesfet", priority: 0.8 },
    { url: "/aktiviteler", priority: 0.9 },
    { url: "/videolar", priority: 0.9 }, // 🎥 Videolar Ana Sayfası
  ];

  staticPages.forEach(page => {
    sitemapEntries.push({ url: `${baseUrl}${page.url}`, lastModified: now, priority: page.priority });
  });

  // --- 1. 🎥 Videolar (Waylero Live) ---
  const videosWithSlugs = addSlugs(wayleroLiveVideos);
  videosWithSlugs.forEach(video => {
    sitemapEntries.push({
      url: `${baseUrl}/videolar/${video.slug}`,
      lastModified: now,
      priority: 0.8,
      // Not: Next.js standart sitemap tipinde henüz video desteği kısıtlıdır 
      // ama URL olarak eklemek Google'ın indexlemesi için yeterlidir.
    });
  });

  // --- 2. 🎤 Aktiviteler (Şehir Bazlı) ---
  activityCities.forEach(city => {
    sitemapEntries.push({ 
      url: `${baseUrl}/aktiviteler?city=${city}`, 
      lastModified: now, 
      priority: 0.7 
    });
  });

  // --- 3. 🌍 Gezi Yerleri (Mekanlar) ---
  const regions: any = { turkey, europa, asia };
  
  Object.entries(regions).forEach(([regionKey, regionData]: [string, any]) => {
    Object.entries(regionData).forEach(([cityName, places]: [string, any]) => {
      const cleanCity = sanitize(cityName);
      let finalCountry = regionKey === "turkey" ? "turkiye" : (cityToCountryMap[cleanCity] || regionKey);

      places.forEach((place: any) => {
        const path = `/kesfet/${finalCountry}/${cleanCity}/${place.slug}`;
        sitemapEntries.push({ url: `${baseUrl}${path}`, lastModified: now, priority: 0.8 });
      });
    });
  });

  // --- 4. ⭐ Şehirler ---
  cities.forEach((city: any) => {
    const cityPath = `/${sanitize(city.slug)}`;
    sitemapEntries.push({ url: `${baseUrl}${cityPath}`, lastModified: now, priority: 0.9 });
  });

  // --- 5. 📝 Blog Yazıları ---
  const allPosts = [...generalPosts, ...uygulamaPosts, ...antikkentPosts, ...konyaPosts, ...konyaPosts2, ...istanbulPosts];

  allPosts.forEach((post: any) => {
    const blogPath = `/blog/${sanitize(post.city)}/${post.slug}`;
    const postDate = new Date(post.updatedAt ?? post.createdAt ?? now);
    sitemapEntries.push({ url: `${baseUrl}${blogPath}`, lastModified: postDate, priority: 0.6 });
  });

  return sitemapEntries;
}