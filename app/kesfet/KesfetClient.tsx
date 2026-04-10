"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import { cleanSearchQuery, fuzzyMatch, normalizeText } from "@/lib/search";


// Veri importları
import turkey from "../data/turkey.json";
import europa from "../data/europa.json";
import asia from "../data/asia.json";
import turkeyImages from "../data/images/turkey.json";
import europaImages from "../data/images/europa.json";
import asiaImages from "../data/images/asia.json";

// Ülke ve Şehir Map'leri
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

// Yer Kartı Bileşeni (Arama Sonuçları İçin)
const PlaceCard = memo(({ place, cityKey, region, lang, allImages, getLocalizedLink }: any) => {
  const cleanCitySlug = slugify(cityKey);
  const cleanPlaceSlug = slugify(place.slug);
  
  const targetImageKey = `${cleanCitySlug}-${cleanPlaceSlug}`;
  const regionImages = allImages[region]?.[cityKey] || {};
  const coverImage = regionImages[targetImageKey]?.[0] || regionImages[place.slug]?.[0];

  const countryPath = region === "turkey" ? "turkiye" : (region === "europa" ? "avrupa" : region);

  return (
    <Link href={getLocalizedLink(`/kesfet/${countryPath}/${cleanCitySlug}/${cleanPlaceSlug}`)} className="group block">
      <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 mb-3 shadow-sm group-hover:shadow-xl transition-all duration-500 relative">
        {coverImage ? (
          <img src={coverImage} alt={place.name.tr} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-2xl bg-gray-50">📍</div>
        )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 px-1 text-sm md:text-base">
        {place.name[lang] || place.name.tr}
      </h3>
    </Link>
  );
});

PlaceCard.displayName = "PlaceCard";

// 1. Props interface'ini ekliyoruz ki TypeScript kızmasın
interface KesfetClientProps {
  initialQuery: string;
  lang: string; // 👈 Burası kritik
}

// 2. Fonksiyonu bu props'u alacak şekilde güncelliyoruz
export default function KesfetClient({ initialQuery, lang: propLang }: KesfetClientProps) {
  // Senin mevcut useLang() hook'un context'ten alıyor, 
  // ama server'dan gelen lang değerini kullanmak SEO için daha tutarlı olur.
  const { lang: contextLang } = useLang(); 
  
  // Eğer propLang varsa onu kullan, yoksa context'tekine bak
  const lang = propLang || contextLang || "tr";

  const [submittedSearch, setSubmittedSearch] = useState(initialQuery);
  // ... (Geri kalan tüm kodun aynı kalabilir)

  const allData = useMemo(() => ({ turkey, europa, asia }), []);
  const allImages = useMemo(() => ({ turkey: turkeyImages, europa: europaImages, asia: asiaImages }), []);
  
  const getLocalizedLink = (path: string) => (lang === "tr" ? path : `/${lang}${path.startsWith("/") ? path : `/${path}`}`);

  useEffect(() => {
    setSubmittedSearch(cleanSearchQuery(initialQuery));
  }, [initialQuery]);

  // 🌍 DİL SÖZLÜĞÜ (Eksik olan her şeyi buraya ekledik)
  const t = {
    tr: { 
      title: "Dünyayı Keşfet", 
      subTitle: "Binlerce nokta, sınırsız macera.", 
      countrySuffix: "Gezilecek Yerler",
      cityLabel: "ŞEHİR",
      pointLabel: "NOKTA",
      regions: { turkey: "Türkiye", europa: "Avrupa", asia: "Asya" },
      loading: "Yükleniyor...",
      noResult: "Sonuç bulunamadı."
    },
    en: { 
      title: "Explore the World", 
      subTitle: "Thousands of spots, endless adventure.", 
      countrySuffix: "Travel Guide",
      cityLabel: "CITY",
      pointLabel: "POINTS",
      regions: { turkey: "Turkey", europa: "Europe", asia: "Asia" },
      loading: "Loading...",
      noResult: "No results found."
    }
  }[lang as "tr" | "en"];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {!submittedSearch && (
        <div className="mb-20">
          <div className="max-w-2xl mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">{t.title}</h1>
            <p className="text-xl text-gray-500 font-medium">{t.subTitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(countryToRegionMap).map(([countrySlug, regionKey]) => {
              const dataSource = regionKey === "turkey" ? turkey : regionKey === "europa" ? europa : asia;
              const citiesOfCountry = Object.entries(dataSource).filter(([cityKey]) => {
                const citySlug = slugify(cityKey);
                return cityToCountryMap[citySlug] === countrySlug;
              });

              if (citiesOfCountry.length === 0) return null;

              const cityCount = citiesOfCountry.length;
              const placeCount = citiesOfCountry.reduce((total, [, places]) => total + (places as any[]).length, 0);

              // Resim Bulma Mantığı
              const firstCityKey = citiesOfCountry[0][0];
              const firstCitySlug = slugify(firstCityKey);
              const firstPlace = (citiesOfCountry[0][1] as any[])[0];
              const regionImages = (allImages as any)[regionKey]?.[firstCityKey] || {};
              const imageKey = `${firstCitySlug}-${slugify(firstPlace.slug)}`;
              const countryCoverImage = regionImages[imageKey]?.[0] || regionImages[firstPlace.slug]?.[0];

              return (
                <Link key={countrySlug} href={getLocalizedLink(`/kesfet/${countrySlug}`)} className="group relative h-80 w-full overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-100 block">
                  {countryCoverImage ? (
                    <img src={countryCoverImage} alt={countrySlug} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-6xl">🌍</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-white text-3xl font-black capitalize mb-1">
                      {countrySlug.replace(/-/g, " ")}
                    </h3>
                    {/* ✅ DİNAMİK ETİKETLER (CITY / ŞEHİR) */}
                    <p className="text-blue-300 font-extrabold text-xs uppercase tracking-widest">
                      {cityCount} {t.cityLabel} • {placeCount} {t.pointLabel}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Arama Sonuçları Alanı */}
      {submittedSearch && (
        <div className="space-y-28">
          {Object.entries(allData).map(([region, cities]: [string, any]) =>
            Object.entries(cities).map(([cityKey, places]: [string, any]) => {
              const filtered = (places as any[]).filter(p => 
                fuzzyMatch(normalizeText(cityKey), submittedSearch) || 
                fuzzyMatch(normalizeText(p.name?.tr || ""), submittedSearch)
              );

              if (filtered.length === 0) return null;

              return (
                <section key={cityKey} className="scroll-mt-10">
                  <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{cityKey}</h2>
                      {/* ✅ DİNAMİK BÖLGE İSİMLERİ (Europe / Avrupa) */}
                      <p className="text-blue-500 font-bold text-xs uppercase mt-2 tracking-widest">
                        {(t.regions as any)[region]}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {filtered.map((place: any, index: number) => (
                      <PlaceCard 
                        key={`${cityKey}-${place.slug}-${index}`}
                        place={place}
                        cityKey={cityKey}
                        region={region}
                        lang={lang}
                        allImages={allImages}
                        getLocalizedLink={getLocalizedLink}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      )}
    </main>
  );
}