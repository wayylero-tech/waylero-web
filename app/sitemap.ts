import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import cities from "@/app/data/cities.json";
import toursData from "@/data/tours.json";
import { wayleroLiveVideos, addSlugs } from "@/videos";

const baseUrl = "https://www.waylero.com";

const locales = ["tr", "en"];
const defaultLocale = "tr";

const buildUrl = (baseUrl: string, route: string, locale: string) => {
  if (locale === defaultLocale) return `${baseUrl}${route}`;
  return `${baseUrl}/${locale}${route}`;
};

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

// ACTIVITY CITIES
const activityCities = [
  "adana","adiyaman","afyon","afyonkarahisar","agri","aksaray","amasya",
  "ankara","antalya","ardahan","artvin","aydin","balikesir","bartin",
  "batman","bayburt","bilecik","bingol","bitlis","bolu","burdur",
  "bursa","canakkale","cankiri","corum","denizli","diyarbakir","duzce",
  "edirne","elazig","erzincan","erzurum","eskisehir","gaziantep","giresun",
  "gumushane","hakkari","hatay","igdir","isparta","istanbul","izmir",
  "kahramanmaras","karabuk","karaman","kars","kastamonu","kayseri","kilis",
  "kirikkale","kirklareli","kirsehir","kktc","kocaeli","konya","kutahya",
  "lefkosa","malatya","manisa","mardin","mersin","mugla","mus","nevsehir",
  "nigde","ordu","osmaniye","rize","sakarya","samsun","sanliurfa","siirt",
  "sinop","sirnak","sivas","tekirdag","tokat","trabzon","tunceli",
  "usak","van","yalova","yozgat","zonguldak"
];

// COUNTRIES
const countries = [
  "turkiye","fransa","almanya","italya","ispanya","ingiltere","hollanda",
  "avusturya","yunanistan","cek-cumhuriyeti","rusya","portekiz","romanya",
  "danimarka","isvec","norvec","isvicre","amerika","japonya","guney-kore",
  "kktc","belarus","endonezya","suudi-arabistan","malezya","misir","irlanda",
  "umman","bosna-hersek","cin","hindistan","tayland","urdun","galler","singapur"
];

const manualBlogPosts = [
  { category: "genel", slug: "muzekart-nedir-ucretleri" },
  { category: "genel", slug: "gezginler-icin-gerekli-mobil-uygulamalar" },
  { category: "genel", slug: "turkiyede-mutlaka-gorulmesi-gereken-antik-kentler" },
  { category: "konya", slug: "tinaztepe-magarasi-gezi-rehberi" },
  { category: "konya", slug: "kalender-baba-kesikbas-turbeleri" },
  { category: "konya", slug: "konya-gezilecek-yerler-rehberi" },
  { category: "turkiye", slug: "turkiye-en-guzel-selaleler-rehberi-2026" },
  { category: "turkiye", slug: "turkiye-onemli-magaralar-rehberi-2026" },
  { category: "turkiye", slug: "turkiyede-gezilecek-yerler-2026-81-il-detayli-rehber" },
  { category: "turkiye", slug: "turkiye-en-guzel-kanyonlar-rehberi-2026" },
  { category: "mersin", slug: "mersin-gezilecek-yerler-rehberi" },
  { category: "turkiye", slug: "turkiye-en-cok-ziyaret-edilen-10-yer-2026" },
  { category: "antalya", slug: "antalya-gezilecek-yerler-rehberi-2026" },
  { category: "antalya", slug: "likya-yolu-dunyanin-en-iyi-trekking-rotalarindan-biri" },
  { category: "istanbul", slug: "istanbul-gezilecek-yerler-rehberi" },
  { category: "antalya", slug: "antalya-3-gunluk-gezi-plani" },
  { category: "ispanya", slug: "ispanya-gezilecek-yerler-rehberi" },
  { category: "spain", slug: "ispanya-4-gunluk-gezi-plani-barselona-madrid" },
  { category: "nevsehir", slug: "kapadokya-gezilecek-yerler-rehberi" },
  { category: "nevsehir", slug: "kapadokya-2-gunluk-gezi-plani" },
  { category: "akdeniz", slug: "turkiyede-gezilecek-yerler-rehberi-2026-akdeniz-bolgesi" },
  { category: "ege", slug: "turkiyede-gezilecek-yerler-rehberi-2026-ege" },
  { category: "marmara", slug: "turkiyede-gezilecek-yerler-rehberi-2026-marmara" },
  { category: "ic-anadolu", slug: "turkiyede-gezilecek-yerler-2026-ic-anadolu" },
  { category: "karadeniz", slug: "turkiyede-gezilecek-yerler-rehberi-2026-karadeniz" },
  { category: "dogu-anadolu", slug: "turkiyede-gezilecek-yerler-2026-dogu-anadolu" },
  { category: "guneydogu-anadolu", slug: "turkiyede-gezilecek-yerler-2026-guneydogu-anadolu" },
  { category: "konya", slug: "catalhoyuk-gezi-rehberi-2026" }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // STATIC PAGES
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/kesfet", priority: 0.95 },
    { url: "/aktiviteler", priority: 0.9 },
    { url: "/videolar", priority: 0.9 },
    { url: "/etkinlikler", priority: 0.9 }, // Etkinlikler Ana Sayfası
  ];

  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(baseUrl, page.url, locale),
        lastModified: now,
        priority: page.priority,
      });
    });
  });

  // COUNTRIES
  countries.forEach((country) => {
    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(baseUrl, `/kesfet/${country}`, locale),
        lastModified: now,
        priority: 0.85,
      });
    });
  });

  // VIDEOS
  const videosWithSlugs = addSlugs(wayleroLiveVideos);

  videosWithSlugs.forEach((video) => {
    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(baseUrl, `/videolar/${video.slug}`, locale),
        lastModified: now,
        priority: 0.8,
      });
    });
  });

  // ACTIVITY CITIES
  activityCities.forEach((city) => {
    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(baseUrl, `/aktiviteler?city=${city}`, locale),
        lastModified: now,
        priority: 0.7,
      });
    });
  });

  // EVENT CITIES (Dinamik Etkinlik Şehirleri)
  const eventCities = Array.from(new Set(toursData.map((t: any) => t.city?.toLowerCase()))).filter(Boolean);

  eventCities.forEach((city) => {
    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(baseUrl, `/etkinlikler/${city}`, locale),
        lastModified: now,
        priority: 0.75,
      });
    });
  });

  // CITIES
  cities.forEach((city: any) => {
    locales.forEach((locale) => {
      const countrySlug = city.country.toLowerCase().replace(/ /g, "-");
      const citySlug = sanitize(city.slug);

      entries.push({
        url: buildUrl(baseUrl, `/${countrySlug}/${citySlug}`, locale),
        lastModified: now,
        priority: 0.8,
      });
    });
  });

  // ELLE EKLENEN BLOGLAR
  manualBlogPosts.forEach((post) => {
    locales.forEach((locale) => {
      const blogPath = `/blog/${post.category}/${post.slug}`;

      entries.push({
        url: buildUrl(baseUrl, blogPath, locale),
        lastModified: now,
        priority: 0.6,
      });
    });
  });

  // PLACES
  const dataRoot = path.join(process.cwd(), "app/data/ulkelerdata");

  if (fs.existsSync(dataRoot)) {
    const regions = fs.readdirSync(dataRoot);

    regions.forEach((region) => {
      const regionPath = path.join(dataRoot, region);
      if (!fs.statSync(regionPath).isDirectory()) return;

      const files = fs.readdirSync(regionPath);

      files.forEach((file) => {
        if (!file.endsWith(".json")) return;

        const cityName = file.replace(".json", "");
        const cleanCity = sanitize(cityName);

        const filePath = path.join(regionPath, file);
        const placesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const places = Array.isArray(placesData)
          ? placesData
          : Object.values(placesData || {}).flat();

        if (!Array.isArray(places)) return;

        places.forEach((place: any) => {
          locales.forEach((locale) => {
            entries.push({
              url: buildUrl(
                baseUrl,
                `/kesfet/${region}/${cleanCity}/${place.slug}`,
                locale
              ),
              lastModified: now,
              priority: 0.7,
            });
          });
        });
      });
    });
  }

  return entries;
}