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
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { konyaPosts } from "@/app/data/blog/konya/posts";
import { istanbulPosts } from "@/app/data/blog/istanbul/posts";
import { konyaPosts2 } from "@/app/data/blog/konya/posts2";
import { konyaRehberPost } from "@/app/data/blog/konya/posts3";
import { selalelerRehberPost } from "@/app/data/blog/selale/posts";
import { magaralarRehberPost } from "@/app/data/blog/magaralar/posts";
import { turkeyPost } from "@/app/data/blog/turkey/posts";
import { kanyonlarRehberPosts } from "@/app/data/blog/kanyonlar/posts";
import { mersinRehberPosts } from "@/app/data/blog/mersin/posts";
import { turkiyeEnCokZiyaretEdilen10YerPost } from "@/app/data/blog/ziyaretedilenonyer/posts";
import { antalyaRehberPost } from "@/app/data/blog/antalya/posts";
import { trekkingPosts } from "@/app/data/blog/likya/posts";
import { istanbulRehberPosts } from "@/app/data/blog/istanbul/post";
import { antalyaPosts2 } from "@/app/data/blog/antalya/posts2";
import { ispanyaRehberPosts } from "@/app/data/blog/ispanya/posts";
import { spainPosts } from "@/app/data/blog/ispanya/posts2";
import { nevsehirRehberPosts } from "@/app/data/blog/nevsehir/posts";
import { cappadociaPosts } from "@/app/data/blog/nevsehir/cappadociaPosts";
import { turkeyPostsAkdeniz } from "@/app/data/blog/turkey/postsakdeniz";
import { turkeyPostEge } from "@/app/data/blog/turkey/postsege";
import { turkeyPostMarmara } from "@/app/data/blog/turkey/postsmarmara";
import { turkeyPostIcAnadolu } from "@/app/data/blog/turkey/postsicanadolu";
import { turkeyPostKaradeniz } from "@/app/data/blog/turkey/postkaradeniz";
import { turkeyPostDoguAnadolu } from "@/app/data/blog/turkey/psostsdoguanadolu";
import { turkeyPostGunaydogu } from "@/app/data/blog/turkey/postsguneydoguanadolu";

// 🌍 Dil ayarları
const locales = ["tr", "en"];
const defaultLocale = "tr";

// 🌍 URL builder
const buildUrl = (baseUrl: string, path: string, locale: string) => {
  if (locale === defaultLocale) return `${baseUrl}${path}`;
  return `${baseUrl}/${locale}${path}`;
};


// --- Şehir-Ülke Eşleşme Haritası ---
const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "sirnak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "arizona": "amerika", "las-vegas": "amerika", "birmingham": "amerika", "montgomery": "amerika", "anchorage": "amerika", "fairbanks": "amerika", "juneau": "amerika", "sitka": "amerika", "mesa": "amerika", "scottsdale": "amerika", "phoenix": "amerika", "tucson": "amerika", "glendale": "amerika", "sandiego": "amerika", "sacramento": "amerika", "sanjose": "amerika", "miami": "amerika", "orlando": "amerika", "tampa": "amerika",
  "berlin": "almanya", "bremen": "almanya", "hamburg": "almanya", "stuttgart": "almanya", "munih": "almanya", "frankfurt": "almanya", "dusseldorf": "almanya",  "leipzig": "almanya", "dresden": "almanya", "weil-am-rhein": "almanya","koln": "almanya",
  "paris": "fransa", "lyon": "fransa", "amiens": "fransa", "chartes": "fransa", "nancy": "fransa", "strazburg": "fransa", "bourges": "fransa", "avignon": "fransa", "toulse": "fransa", "ordesa": "fransa", "brugge": "fransa",
  "roma": "italya", "marche": "italya", "milano": "italya", "napoli": "italya", "torino": "italya", "venedik": "italya", "verona": "italya", "floransa": "italya", "bologna": "italya", "palermo": "italya", "catania": "italya",
  "madrid": "ispanya", "barselona": "ispanya", "valencia": "ispanya", "sevilla": "ispanya", "malaga": "ispanya", "zaragoza": "ispanya", "bilbao": "ispanya", "palma-de-mallorca": "ispanya", "alicante": "ispanya", "granada": "ispanya",
  "londra": "ingiltere", "manchester": "ingiltere", "liverpool": "ingiltere", "leeds": "ingiltere", "bristol": "ingiltere", "sheffield": "ingiltere", "nottingham": "ingiltere", "newcastle": "ingiltere", "cambridge": "ingiltere",
  "rotterdam": "hollanda", "amsterdam": "hollanda","guneyhollanda": "hollanda", "kuzeyhollanda": "hollanda", "utrecht": "hollanda", "limburg": "hollanda", "friesland": "hollanda", "groningen": "hollanda", "overijssel": "hollanda", "drenthe": "hollanda","lahey": "hollanda","eindhoven": "hollanda","tilburg": "hollanda","almere": "hollanda","breda": "hollanda","haarlem": "hollanda",
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
  "beijing": "cin","pekin": "cin","sangay": "cin", "shanghai": "cin", "xian": "cin", "guilin": "cin", "chengdu": "cin", "hongkong": "cin", "hangzhou": "cin", "lijiang": "cin","xi-anfianal": "cin",
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

const countries = [
  "turkiye", "fransa", "almanya", "italya", "ispanya", "ingiltere", "hollanda", 
  "avusturya", "yunanistan", "cek-cumhuriyeti", "rusya", "portekiz", "romanya", 
  "danimarka", "isvec", "norvec", "isvicre", "amerika", "japonya", "guney-kore",
  "kktc", "belarus", "endonezya", "suudi-arabistan", "malezya", "misir", "irlanda",
  "umman", "bosna-hersek", "cin", "hindistan", "tayland", "urdun", "galler", "singapur"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.waylero.com";
  const now = new Date();

  const sanitize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "")
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c");

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // --- 1. Statik ---
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/kesfet", priority: 0.95 },
    { url: "/aktiviteler", priority: 0.9 },
    { url: "/videolar", priority: 0.9 },
  ];

  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: buildUrl(baseUrl, page.url, locale),
        lastModified: now,
        priority: page.priority,
      });
    });
  });

  // --- 2. Ülkeler ---
  countries.forEach((country) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: buildUrl(baseUrl, `/kesfet/${country}`, locale),
        lastModified: now,
        priority: 0.85,
      });
    });
  });

  // --- 3. Videolar ---
  const videosWithSlugs = addSlugs(wayleroLiveVideos);

  videosWithSlugs.forEach((video) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: buildUrl(baseUrl, `/videolar/${video.slug}`, locale),
        lastModified: now,
        priority: 0.8,
      });
    });
  });

  // --- 4. Aktiviteler ---
  activityCities.forEach((city) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: buildUrl(baseUrl, `/aktiviteler?city=${city}`, locale),
        lastModified: now,
        priority: 0.7,
      });
    });
  });

  // --- 5. Mekanlar ---
  const regions: any = { turkey, europa, asia };

  Object.entries(regions).forEach(([regionKey, regionData]: any) => {
    Object.entries(regionData).forEach(([cityName, places]: any) => {
      const cleanCity = sanitize(cityName);

      const finalCountry =
        regionKey === "turkey"
          ? "turkiye"
          : cityToCountryMap[cleanCity] || regionKey;

      places.forEach((place: any) => {
        locales.forEach((locale) => {
          const path = `/kesfet/${finalCountry}/${cleanCity}/${place.slug}`;

          sitemapEntries.push({
            url: buildUrl(baseUrl, path, locale),
            lastModified: now,
            priority: 0.7,
          });
        });
      });
    });
  });

  // --- 6. Şehir sayfaları ---
  cities.forEach((city: any) => {
  locales.forEach((locale) => {

    const countrySlug = city.country.toLowerCase().replace(/ /g, "-");
    const citySlug = sanitize(city.slug);

    const path = `/${countrySlug}/${citySlug}`;

    sitemapEntries.push({
      url: buildUrl(baseUrl, path, locale),
      lastModified: now,
      priority: 0.8,
    });

  });
});

  // --- 7. Blog ---
  const allPosts = [
    ...generalPosts,
    ...uygulamaPosts,
    ...antikkentPosts,
    ...konyaPosts,
    ...konyaPosts2,
    ...istanbulPosts,
  ];

  allPosts.forEach((post: any) => {
    locales.forEach((locale) => {
      const blogPath = `/blog/${sanitize(post.city)}/${post.slug}`;
      const postDate = new Date(post.updatedAt ?? post.createdAt ?? now);

      sitemapEntries.push({
        url: buildUrl(baseUrl, blogPath, locale),
        lastModified: postDate,
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}