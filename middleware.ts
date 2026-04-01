import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 🛡️ 1. ŞEHİR-ÜLKE HARİTASI (Hepsi burada)
const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "sirnak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "arizona": "amerika", "las-vegas": "amerika", "birmingham": "amerika", "montgomery": "amerika", "anchorage": "amerika", "fairbanks": "amerika", "juneau": "amerika", "sitka": "amerika", "mesa": "amerika", "scottsdale": "amerika", "phoenix": "amerika", "tucson": "amerika", "glendale": "amerika", "sandiego": "amerika", "sacramento": "amerika", "sanjose": "amerika", "miami": "amerika", "orlando": "amerika", "tampa": "amerika",
  "berlin": "almanya", "bremen": "almanya", "hamburg": "almanya", "stuttgart": "almanya", "munih": "almanya", "frankfurt": "almanya", "dusseldorf": "almanya",  "leipzig": "almanya", "dresden": "almanya", "weil-am-rhein": "almanya","koln": "almanya",
  "paris": "fransa", "lyon": "fransa", "amiens": "fransa", "chartes": "fransa", "nancy": "fransa", "strazburg": "fransa", "bourges": "fransa", "avignon": "fransa", "toulse": "fransa", "ordesa": "fransa", "brugge": "fransa",
  "roma": "italya", "marche": "italya", "milano": "italya", "napoli": "italya", "torino": "italya", "venedik": "italya", "verona": "italya", "floransa": "italya", "bologna": "italya", "palermo": "italya", "catania": "italya",
  "madrid": "ispanya", "barselona": "ispanya", "valencia": "ispanya", "sevilla": "ispanya", "malaga": "ispanya", "zaragoza": "ispanya", "bilbao": "ispanya", "palmademallorca": "ispanya", "alicante": "ispanya", "granada": "ispanya",
  "londra": "ingiltere", "manchester": "ingiltere", "liverpool": "ingiltere", "leeds": "ingiltere", "bristol": "ingiltere", "sheffield": "ingiltere", "nottingham": "ingiltere", "newcastle": "ingiltere", "cambridge": "ingiltere",
  "rotterdam": "hollanda", "guneyhollanda": "hollanda", "kuzeyhollanda": "hollanda", "utrecht": "hollanda", "limburg": "hollanda", "friesland": "hollanda", "groningen": "hollanda", "overijssel": "hollanda", "drenthe": "hollanda","lahey": "hollanda","eindhoven": "hollanda","tilburg": "hollanda","almere": "hollanda","breda": "hollanda","haarlem": "hollanda",
  "viyana": "avusturya", "salzburg": "avusturya", "innsbruck": "avusturya", "graz": "avusturya", "bregenz": "avusturya", "niederosterreich": "avusturya", "oberosterreich": "avusturya", "seefeld": "avusturya",
  "billund": "danimarka", "esbjerg": "danimarka", "helsingor": "danimarka", "roskilde": "danimarka", "skagen": "danimarka", "odense": "danimarka", "aarhus": "danimarka", "kopenhag": "danimarka",
  "stockholm": "isvec", "uppsala": "isvec", "goteborg": "isvec", "malmo": "isvec", "vasteras": "isvec", "ostersund": "isvec", "linkoping": "isvec",
  "oslo": "norvec", "bergen": "norvec", "stavanger": "norvec", "drammen": "norvec", "trondheim": "norvec", "tromso": "norvec", "kristiansand": "norvec", "fredrikstad": "norvec", "sandnes": "norvec", "arendal": "norvec",
  "zurich": "isvicre", "geneva": "isvicre", "bern": "isvicre", "basel": "isvicre", "lausanne": "isvicre", "lucerne": "isvicre", "st moritz": "isvicre", "interlaken": "isvicre", "lugano": "isvicre", "winterthur": "isvicre",
  "helsinki": "finlandiya", "rovaniemi": "finlandiya", "espoo": "finlandiya", "tampere": "finlandiya", "vantaa": "finlandiya", "oulu": "finlandiya",
  "atina": "yunanistan", "santorini": "yunanistan", "mykonos": "yunanistan", "girit-adasi": "yunanistan", "korint": "yunanistan", "zakynhos": "yunanistan", "peloponez-yarimadasi": "yunanistan", "kafelonya-adasi": "yunanistan", "delos-adasi": "yunanistan", "rodos-adasi": "yunanistan", "selanik": "yunanistan", "veria": "yunanistan", "greece": "yunanistan",
  "lizbon": "portekiz", "porto": "portekiz", "coimbra": "portekiz", "braga": "portekiz", "aveiro": "portekiz", "amadora": "portekiz", "funchal": "portekiz", "viseu": "portekiz", "evora": "portekiz", "almada": "portekiz",
  "peru": "peru",
  "prague": "cek cumhuriyeti", "brno": "cek cumhuriyeti", "ostrava": "cek cumhuriyeti", "plzen": "cek cumhuriyeti", "liberec": "cek cumhuriyeti",
  "budapest": "macaristan", "debrecen": "macaristan", "szeged": "macaristan", "miskolc": "macaristan", "pecs": "macaristan",
  "bratislava": "slovakya", "kosice": "slovakya", "nitra": "slovakya", "presov": "slovakya", "zilina": "slovakya",
  "edinburgh": "iskocya", "glasgow": "iskocya", "aberdeen": "iskocya", "dundee": "iskocya", "inverness": "iskocya", "stirling": "iskocya", "st andrews": "iskocya", "oban": "iskocya",  "pitlochry": "iskocya",
  "lefkosa": "kktc", "girne": "kktc", "gazimagusa": "kktc", "guzelyurt": "kktc",
  "bukres": "romanya", "cluj-napoca": "romanya", "timisoara": "romanya", "iasi": "romanya", "constanta": "romanya", "brasov": "romanya", "galati": "romanya", "craiova": "romanya", "ploiesti": "romanya", "oradea": "romanya",
  "delhi": "hindistan", "agra": "hindistan", "jaipur": "hindistan", "varanasi": "hindistan", "mumbai": "hindistan", "goa": "hindistan", "kerala": "hindistan", "rishikesh-haridwar": "hindistan", "haridwar": "hindistan", "udaipur": "hindistan", "amritsar": "hindistan",
  "bangkok": "tayland",
  "cardiff": "galler",
  "singapur": "singapur",
  "seul": "guney-kore",
  "dubai": "bae",
  "sri-lanka": "sri-lanka",
  "moskova": "rusya", "stpeterburg": "rusya", "kazan": "rusya",
  "cairo": "misir", "luksor": "misir", "iskenderiye": "misir", "giza": "misir", "sharm-el-sheikh": "misir","kahire": "misir",
  "manila": "filipinler", "cebu": "filipinler", "boracay": "filipinler", "davao": "filipinler", "palawan": "filipinler", "bohol": "filipinler", "tagaytay": "filipinler", "iloilo": "filipinler", "vigan": "filipinler", "dumaguete": "filipinler",
  "sidney": "avustralya", "melbourne": "avustralya", "brisbane": "avustralya", "adelaide": "avustralya", "perth": "avustralya", "hobart": "avustralya", "canberra": "avustralya",    "darwin": "avustralya", "cairns": "avustralya", "whitsunday-adalari": "avustralya", "gold-coast": "avustralya",
  "tiflis": "gurcistan", "batum": "gurcistan", "uplistsikhe": "gurcistan", "mtskheta": "gurcistan", "kazbegi": "gurcistan", "vardzia": "gurcistan", "sighnaghi": "gurcistan", "racha region": "gurcistan", "david-gareja": "gurcistan", "tskaltubo": "gurcistan",
  "belarus": "belarus",
  "bali": "endonezya", "ubud": "endonezya", "seminyak": "endonezya", "canggu": "endonezya", "kuta": "endonezya", "uluwatu": "endonezya",
  "mekke": "suudi-arabistan", "medine": "suudi-arabistan", "riyad": "suudi-arabistan",
  "kualalumpur": "malezya",
  "dublin": "irlanda", "galway": "irlanda", "cork": "irlanda", "limerick": "irlanda", "kilkenny": "irlanda", "waterford": "irlanda", "belfast": "irlanda",
  "muskat": "umman", "masirah-adasi": "umman", "ras-al-jinz": "umman", "sur": "umman", "jabel-shams": "umman", "salalah": "umman", "wahiba-sands": "umman", "nizwa": "umman",
  "saraybosna": "bosna-hersek", "mostar": "bosna-hersek", "travnik": "bosna-hersek", "jajce": "bosna-hersek", "banja-luka": "bosna-hersek", "pocitel": "bosna-hersek", "ljubuski": "bosna-hersek", "neum": "bosna-hersek", "tuzla": "bosna-hersek",
  "tokyo": "japonya", "kyoto": "japonya", "osaka": "japonya", "nara": "japonya", "hakone": "japonya", "fujikawaguchiko": "japonya", "hiroshima": "japonya", "kamakura": "japonya", "nikko": "japonya", "takayama": "japonya", "kanazawa": "japonya", "hokkaido": "japonya", "hakusan": "japonya", "nagano": "japonya", "yamaguchi": "japonya","hirosima": "japonya",
  "beijing": "cin", "shanghai": "cin", "xian": "cin", "guilin": "cin", "chengdu": "cin", "hongkong": "cin", "hangzhou": "cin", "lijiang": "cin","xi-anfianal": "cin",
};

// 🛡️ 2. SANITIZE FONKSİYONU (Dışarıda tanımlanmalı)
const sanitize = (str: string) => str.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/ /g, '')
  .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔥 1. ADIM: DİL YÖNETİMİ VE HEADER HAZIRLIĞI
  const isEn = pathname.startsWith('/en/') || pathname === '/en';
  
  // Request header'larını kopyalayıp yenisini ekliyoruz
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url-lang', isEn ? 'en' : 'tr');

  // Tek bir response tanımlıyoruz ve içine request header'larını gömüyoruz
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Eğer İngilizce ise çerezi de güncelle
  if (isEn) {
    response.cookies.set('lang', 'en', { path: '/' });
  } else {
    // Normal yollarda da x-url-lang 'tr' kalsın (isteğe bağlı)
    response.headers.set('x-url-lang', 'tr');
  }

  // 🔥 2. ADIM: MEVCUT YÖNLENDİRME MANTIĞIN
  // Eğer EN ise direkt bu response ile devam et
  if (isEn) {
     return response; 
  }

  const parts = pathname.split('/');

  // Mekan sayfaları yönlendirmesi
  if (pathname.startsWith('/kesfet/') && parts.length >= 4) {
    const regionOrCountry = parts[2];
    const cityInUrl = sanitize(parts[3]);
    const targetCountry = cityToCountryMap[cityInUrl];

    if (targetCountry && targetCountry !== regionOrCountry) {
      const slug = parts.slice(4).join('/');
      let newPath = `/kesfet/${targetCountry}/${parts[3]}`;
      if (slug) newPath += `/${slug}`;
      
      // Redirect yaparken dilden bağımsız 301 atıyoruz
      return NextResponse.redirect(new URL(newPath, request.url), { status: 301 });
    }
  }

  // Şehir sayfaları yönlendirmesi
  if (parts.length === 2 && !pathname.startsWith('/kesfet/') && pathname !== '/' && !pathname.includes('.')) {
    const cityInUrl = sanitize(parts[1]);
    const targetCountry = cityToCountryMap[cityInUrl];

    if (targetCountry) {
      return NextResponse.redirect(new URL(`/${targetCountry}/${parts[1]}`, request.url), { status: 301 });
    }
  }

  // Hiçbirine girmezse hazırladığımız dilli response'u dön
  return response;
<<<<<<< HEAD
}
=======
}
>>>>>>> 48a16b0 (cms ignore)
