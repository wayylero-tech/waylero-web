import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import cities from "@/data/cities.json";
import toursData from "@/data/tours.json";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import { allPosts } from "@/lib/blog/posts";

const baseUrl = "https://www.waylero.com";
const locales = ["tr", "en"];

// ✅ HER ZAMAN LOCALE VAR
const buildUrl = (route: string, locale: string) => {
  return `${baseUrl}/${locale}${route}`;
};

// ✅ Middleware ile AYNI sanitize
const sanitize = (str: string) =>
  str
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

// COUNTRIES
const countries = [
  "turkiye","fransa","almanya","italya","ispanya","ingiltere","hollanda",
  "avusturya","yunanistan","cek-cumhuriyeti","rusya","portekiz","romanya",
  "danimarka","isvec","norvec","isvicre","amerika","japonya","guney-kore",
  "kktc","belarus","endonezya","suudi-arabistan","malezya","misir","irlanda",
  "umman","bosna-hersek","cin","hindistan","tayland","urdun","galler","singapur"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ✅ STATIC
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/kesfet", priority: 0.95 },
    { url: "/aktiviteler", priority: 0.9 },
    { url: "/videolar", priority: 0.9 },
    { url: "/etkinlikler", priority: 0.9 },
    { url: "/trip-planner", priority: 0.9 }, // ✅ EKLENDİ
  ];

  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(page.url, locale),
        lastModified: now,
        priority: page.priority,
        alternates: {
          languages: {
            tr: buildUrl(page.url, "tr"),
            en: buildUrl(page.url, "en"),
          },
        },
      });
    });
  });

  // ✅ COUNTRIES
  countries.forEach((country) => {
    locales.forEach((locale) => {
      const route = `/kesfet/${country}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: now,
        priority: 0.85,
        alternates: {
          languages: {
            tr: buildUrl(route, "tr"),
            en: buildUrl(route, "en"),
          },
        },
      });
    });
  });

  // ✅ VIDEOS
  const videosWithSlugs = addSlugs(wayleroLiveVideos);

  videosWithSlugs.forEach((video) => {
    locales.forEach((locale) => {
      const route = `/videolar/${video.slug}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: now,
        priority: 0.8,
        alternates: {
          languages: {
            tr: buildUrl(route, "tr"),
            en: buildUrl(route, "en"),
          },
        },
      });
    });
  });

  // ✅ AKTİVİTELER (QUERY KORUNDU)
  const activityCities = [ "adana","adiyaman","afyon","afyonkarahisar","agri","aksaray","amasya", "ankara","antalya","ardahan","artvin","aydin","balikesir","bartin", "batman","bayburt","bilecik","bingol","bitlis","bolu","burdur", "bursa","canakkale","cankiri","corum","denizli","diyarbakir","duzce", "edirne","elazig","erzincan","erzurum","eskisehir","gaziantep","giresun", "gumushane","hakkari","hatay","igdir","isparta","istanbul","izmir", "kahramanmaras","karabuk","karaman","kars","kastamonu","kayseri","kilis", "kirikkale","kirklareli","kirsehir","kktc","kocaeli","konya","kutahya", "lefkosa","malatya","manisa","mardin","mersin","mugla","mus","nevsehir", "nigde","ordu","osmaniye","rize","sakarya","samsun","sanliurfa","siirt", "sinop","sirnak","sivas","tekirdag","tokat","trabzon","tunceli", "usak","van","yalova","yozgat","zonguldak" ];

  activityCities.forEach((city) => {
    locales.forEach((locale) => {
      const route = `/aktiviteler?city=${city}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: now,
        priority: 0.7,
      });
    });
  });

  // ✅ EVENT CITIES
  const eventCities = Array.from(
    new Set(toursData.map((t: any) => t.city?.toLowerCase()))
  ).filter(Boolean);

  eventCities.forEach((city) => {
    locales.forEach((locale) => {
      const route = `/etkinlikler/${city}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: now,
        priority: 0.75,
      });
    });
  });

  // ✅ CITIES (EN KRİTİK FIX)
  cities.forEach((city: any) => {
    locales.forEach((locale) => {
      const countrySlug = sanitize(city.country);
      const citySlug = sanitize(city.slug);

      const route = `/kesfet/${countrySlug}/${citySlug}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: now,
        priority: 0.8,
        alternates: {
          languages: {
            tr: buildUrl(route, "tr"),
            en: buildUrl(route, "en"),
          },
        },
      });
    });
  });

// ✅ BLOG POSTS AUTO
allPosts.forEach((post: any) => {
  if (!post?.slug) return;

  locales.forEach((locale) => {
    const category = sanitize(
      post.category ||
      post.city ||
      post.country ||
      "genel"
    );

    const slug = sanitize(post.slug);

    const route = `/blog/${category}/${slug}`;

    entries.push({
      url: buildUrl(route, locale),
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : now,
      priority: 0.6,
      alternates: {
        languages: {
          tr: buildUrl(route, "tr"),
          en: buildUrl(route, "en"),
        },
      },
    });
  });
});
  // ✅ PLACES
  const dataRoot = path.join(process.cwd(), "/data/ulkelerdata");

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
            const route = `/kesfet/${region}/${cleanCity}/${place.slug}`;

            entries.push({
              url: buildUrl(route, locale),
              lastModified: now,
              priority: 0.7,
              alternates: {
                languages: {
                  tr: buildUrl(route, "tr"),
                  en: buildUrl(route, "en"),
                },
              },
            });
          });
        });
      });
    });
  }

  return entries;
}