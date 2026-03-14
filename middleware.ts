import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Şehir - Ülke Eşleşme Haritası (Senin listenin tamamı burada kanka)
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
"edinburgh": "iskocya", "glasgow": "iskocya", "aberdeen": "iskocya", "dundee": "iskocya", "inverness": "iskocya", "stirling": "iskocya", "st andrews": "iskocya", "oban": "iskocya", "perth": "iskocya", "pitlochry": "iskocya",
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
"sidney": "avustralya", "melbourne": "avustralya", "brisbane": "avustralya", "adelaide": "avustralya", "perth": "avustralya", "hobart": "avustralya", "canberra": "avustralya",    "idarwin": "avustralya", "cairns": "avustralya", "whitsunday-adalari": "avustralya", "gold-coast": "avustralya",

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
"beijing": "cin", "shanghai": "cin", "xian": "cin", "guilin": "cin", "chengdu": "cin", "hong-kong": "cin", "hangzhou": "cin", "lijiang": "cin","xi-anfianal": "cin",
  // Diğerleri
"pekin": "cin", "sangay": "cin", "hongkong": "cin", "dubai": "bae", "bangkok": "tayland", "singapore": "singapur", "seul": "guney-kore", "moskova": "rusya", "stpetersburg": "rusya", "atina": "yunanistan", "santorini": "yunanistan", "prag": "cek-cumhuriyeti", "budapeste": "macaristan", "tokyo": "japonya", "lizbon": "portekiz", "porto": "portekiz", "helsinki": "finlandiya", "bruksel": "belcika", "bratislava": "slovakya"
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const parts = pathname.split('/');

  // URL'deki şehir ismini temizleme (boşluk sil, küçük harf yap, türkçe karakterleri düzelt)
  const sanitize = (str: string) => str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, '')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

  // --- DURUM 1: /kesfet/europa/paris/... (Mekan Sayfaları) ---
  if (pathname.startsWith('/kesfet/') && parts.length >= 4) {
    const regionOrCountry = parts[2];
    const cityInUrl = sanitize(parts[3]);
    const targetCountry = cityToCountryMap[cityInUrl];

    if (targetCountry && targetCountry !== regionOrCountry) {
      const slug = parts.slice(4).join('/');
      let newPath = `/kesfet/${targetCountry}/${parts[3]}`;
      if (slug) newPath += `/${slug}`;
      return NextResponse.redirect(new URL(newPath, request.url), { status: 301 });
    }
  }

  // --- DURUM 2: /avrupa/viyana (Sade Şehir Sayfaları) ---
  if (parts.length === 3 && !pathname.startsWith('/kesfet/')) {
    const regionOrCountry = parts[1];
    const cityInUrl = sanitize(parts[2]);
    const targetCountry = cityToCountryMap[cityInUrl];

    if (targetCountry && targetCountry !== regionOrCountry) {
      return NextResponse.redirect(new URL(`/${targetCountry}/${parts[2]}`, request.url), { status: 301 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};