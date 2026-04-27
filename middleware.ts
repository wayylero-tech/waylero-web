import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import slugToCityMap from "./slug-city-map.json";


// 🛡️ 1. ŞEHİR-ÜLKE HARİTASI (Hepsi burada)
const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "arizona": "amerika", "las-vegas": "amerika", "birmingham": "amerika", "montgomery": "amerika", "anchorage": "amerika", "fairbanks": "amerika", "juneau": "amerika", "sitka": "amerika", "mesa": "amerika", "scottsdale": "amerika", "phoenix": "amerika", "tucson": "amerika", "glendale": "amerika", "sandiego": "amerika", "sacramento": "amerika", "sanjose": "amerika", "miami": "amerika", "orlando": "amerika", "tampa": "amerika",
  "berlin": "almanya", "bremen": "almanya", "hamburg": "almanya", "stuttgart": "almanya", "munih": "almanya", "frankfurt": "almanya", "dusseldorf": "almanya",  "leipzig": "almanya", "dresden": "almanya", "weil-am-rhein": "almanya","koln": "almanya",
  "paris": "fransa", "lyon": "fransa", "amiens": "fransa", "chartes": "fransa", "nancy": "fransa", "strazburg": "fransa", "bourges": "fransa", "avignon": "fransa", "toulse": "fransa", "ordesa": "fransa", "brugge": "fransa",
  "roma": "italya", "marche": "italya", "milano": "italya", "napoli": "italya", "torino": "italya", "venedik": "italya", "verona": "italya", "floransa": "italya", "bologna": "italya", "palermo": "italya", "catania": "italya",
  "madrid": "ispanya", "barselona": "ispanya", "valencia": "ispanya", "sevilla": "ispanya", "malaga": "ispanya", "zaragoza": "ispanya", "bilbao": "ispanya", "palma-de-mallorca": "ispanya", "alicante": "ispanya", "granada": "ispanya",
  "londra": "ingiltere", "manchester": "ingiltere", "liverpool": "ingiltere", "leeds": "ingiltere", "bristol": "ingiltere", "sheffield": "ingiltere", "nottingham": "ingiltere", "newcastle": "ingiltere", "cambridge": "ingiltere",
 "amsterdam": "hollanda", "rotterdam": "hollanda", "guneyhollanda": "hollanda", "kuzeyhollanda": "hollanda", "utrecht": "hollanda", "limburg": "hollanda", "friesland": "hollanda", "groningen": "hollanda", "overijssel": "hollanda", "drenthe": "hollanda","lahey": "hollanda","eindhoven": "hollanda","tilburg": "hollanda","almere": "hollanda","breda": "hollanda","haarlem": "hollanda",
  "viyana": "avusturya", "salzburg": "avusturya", "innsbruck": "avusturya", "graz": "avusturya", "bregenz": "avusturya", "niederosterreich": "avusturya", "oberosterreich": "avusturya", "seefeld": "avusturya",
  "billund": "danimarka", "esbjerg": "danimarka", "helsingor": "danimarka", "roskilde": "danimarka", "skagen": "danimarka", "odense": "danimarka", "aarhus": "danimarka", "kopenhag": "danimarka",
  "stockholm": "isvec", "uppsala": "isvec", "goteborg": "isvec", "malmo": "isvec", "vasteras": "isvec", "ostersund": "isvec", "linkoping": "isvec",
  "oslo": "norvec", "bergen": "norvec", "stavanger": "norvec", "drammen": "norvec", "trondheim": "norvec", "tromso": "norvec", "kristiansand": "norvec", "fredrikstad": "norvec", "sandnes": "norvec", "arendal": "norvec",
  "zurich": "isvicre", "geneva": "isvicre", "bern": "isvicre", "basel": "isvicre", "lausanne": "isvicre", "lucerne": "isvicre", "stmoritz": "isvicre", "interlaken": "isvicre", "lugano": "isvicre", "winterthur": "isvicre","lozan": "isvicre",
  "atina": "yunanistan", "santorini": "yunanistan", "mykonos": "yunanistan", "girit-adasi": "yunanistan", "korint": "yunanistan", "zakynhos": "yunanistan", "peloponez-yarimadasi": "yunanistan", "kafelonya-adasi": "yunanistan", "delos-adasi": "yunanistan", "rodos-adasi": "yunanistan", "selanik": "yunanistan", "veria": "yunanistan", "greece": "yunanistan",
  "lizbon": "portekiz", "porto": "portekiz", "coimbra": "portekiz", "braga": "portekiz", "aveiro": "portekiz", "amadora": "portekiz", "funchal": "portekiz", "viseu": "portekiz", "evora": "portekiz", "almada": "portekiz",
  "cusco": "peru",
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
  "kahire": "misir","luksor": "misir","iskenderiye": "misir","giza": "misir",
  "dublin": "irlanda", "galway": "irlanda", "cork": "irlanda", "limerick": "irlanda", "kilkenny": "irlanda", "waterford": "irlanda", "belfast": "irlanda",
  "muskat": "umman", "masirah-adasi": "umman", "ras-al-jinz": "umman", "sur": "umman", "jabel-shams": "umman", "salalah": "umman", "wahiba-sands": "umman", "nizwa": "umman",
  "saraybosna": "bosna-hersek", "mostar": "bosna-hersek", "travnik": "bosna-hersek", "jajce": "bosna-hersek", "banja-luka": "bosna-hersek", "pocitel": "bosna-hersek", "ljubuski": "bosna-hersek", "neum": "bosna-hersek", "tuzla": "bosna-hersek",
  "tokyo": "japonya", "kyoto": "japonya", "osaka": "japonya", "nara": "japonya", "hakone": "japonya", "fujikawaguchiko": "japonya", "hiroshima": "japonya", "kamakura": "japonya", "nikko": "japonya", "takayama": "japonya", "kanazawa": "japonya", "hokkaido": "japonya", "hakusan": "japonya", "nagano": "japonya", "yamaguchi": "japonya","hirosima": "japonya",
  "beijing": "cin", "pekin": "cin","sangay": "cin", "xian": "cin", "guilin": "cin", "chengdu": "cin", "hongkong": "cin", "hangzhou": "cin", "lijiang": "cin","xi-anfianal": "cin",
};



// 🌍 2. ÜLKE -> BÖLGE EŞLEŞTİRMESİ (Senin verdiğin liste)
const countryToRegionMap: Record<string, string> = {
  turkiye: "turkiye", // Türkiye her zaman turkiye kalsın demiştin
  fransa: "europa", almanya: "almanya", italya: "europa", kktc: "europa",
  ispanya: "europa", ingiltere: "europa", hollanda: "europa", 
  avusturya: "europa", yunanistan: "europa", "cek-cumhuriyeti": "europa", rusya: "europa",
  portekiz: "europa", romanya: "europa", danimarka: "europa", urdun: "asia",
  isvec: "europa", norvec: "europa", isvicre: "europa", "suudi-arabistan": "europa", 
  misir: "europa", "bosna-hersek": "europa", cin: "asia", hindistan: "asia", 
  tayland: "europa", japonya: "asia", amerika: "europa", "sri-lanka": "asia", 
  singapur: "europa", umman: "europa", belarus: "europa", endonezya: "europa", 
  irlanda: "europa", avustralya: "europa", "guney-kore": "europa", filipinler: "europa", 
  gurcistan: "europa", iskocya: "europa", galler: "europa", malezya: "europa",
};

const sanitize = (str: string) =>
  str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "")
    .replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ö/g, "o").replace(/ç/g, "c");

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. GEREKSİZ İŞLEMLERİ ELE: Eğer /kesfet/ içermiyorsa veya ana sayfa değilse 
  // çoğu zaman işlem yapmana gerek kalmaz.
  const isKesfet = pathname.includes("/kesfet/");
  const isEn = pathname.startsWith("/en");

  // Eğer URL /kesfet/ veya slug formatında değilse, doğrudan devam et. 
  // En büyük performans kazancı burada.
  if (!isKesfet && !pathname.match(/^\/[a-zA-Z0-9-]+$/) && !isEn) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url-lang", isEn ? "en" : "tr");
  requestHeaders.set("x-url", pathname + search);

  const segments = pathname.split("/").filter(Boolean);
  const slugSegment = isEn ? segments[1] : segments[0];

  // 2. REDIRECT MANTIĞI: Sadece slug gibi görünen kısımlar için çalıştır.
  if (!isKesfet && slugSegment && slugSegment !== "en") {
    const slug = sanitize(slugSegment);
    const city = (slugToCityMap as any)[slug];

    if (city) {
      const country = cityToCountryMap[city];
      if (country) {
        const url = request.nextUrl.clone();
        url.pathname = `${isEn ? "/en" : ""}/kesfet/${country}/${city}/${slug}`;
        url.search = search;
        return NextResponse.redirect(url, 301);
      }
    }
  }

  // 3. PATH DÜZELTME: Sadece /kesfet/ rotasındaysak çalıştır.
  if (isKesfet) {
    const offset = isEn ? 1 : 0;
    // URL yapısı beklediğimizden kısaysa işleme girme
    if (segments.length >= 4 + offset) {
      const regionInUrl = segments[2 + offset];
      const cityInUrl = sanitize(segments[3 + offset]);
      const targetCountry = cityToCountryMap[cityInUrl];

      if (targetCountry && regionInUrl !== targetCountry) {
        const url = request.nextUrl.clone();
        segments[2 + offset] = targetCountry;
        url.pathname = "/" + segments.join("/");
        url.search = search;
        return NextResponse.redirect(url, 301);
      }
    }
  }

  // 4. COOKIE İŞLEMLERİ: Sadece gerekli durumlarda set et
  const response = isEn 
    ? NextResponse.rewrite(request.nextUrl, { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  response.cookies.set("lang", isEn ? "en" : "tr", { path: "/", maxAge: 60 * 60 * 24 });
  return response;
}