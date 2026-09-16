import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import cities from "@/data/cities.json";
import globalPlaces from "@/data/globalPlaces.json";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import { allPosts } from "@/lib/blog/posts";

const baseUrl = "https://www.waylero.com";
const locales = ["tr", "en"];

const buildUrl = (route: string, locale: string) =>
  `${baseUrl}/${locale}${route}`;

const sanitize = (str: string) => {
  if (!str) return "";

  return str
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
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // =========================================================
  // GLOBAL JSON'DAKİ TÜM ŞEHİRLER
  // =========================================================

  const globalCities = Array.from(
    new Set(
      (globalPlaces as any[])
        .map((place) => place?.city)
        .filter(Boolean)
        .map((city) => sanitize(city))
        .filter(Boolean)
    )
  );

  // =========================================================
  // 1️⃣ ANA SAYFA
  // =========================================================

  locales.forEach((locale) => {
    entries.push({
      url: buildUrl("", locale),
      lastModified: now,
      priority: 1.0,
      alternates: {
        languages: {
          tr: buildUrl("", "tr"),
          en: buildUrl("", "en"),
        },
      },
    });
  });

  // =========================================================
  // 2️⃣ MEKANLAR
  // =========================================================

  const dataRoot = path.join(process.cwd(), "/data/ulkelerdata");

  if (fs.existsSync(dataRoot)) {
    const regions = fs.readdirSync(dataRoot);

    regions.forEach((region) => {
      const regionPath = path.join(dataRoot, region);

      if (!fs.statSync(regionPath).isDirectory()) return;

      fs.readdirSync(regionPath).forEach((file) => {
        if (!file.endsWith(".json")) return;

        const cleanCity = sanitize(file.replace(".json", ""));

        const placesData = JSON.parse(
          fs.readFileSync(path.join(regionPath, file), "utf-8")
        );

        const places = Array.isArray(placesData)
          ? placesData
          : Object.values(placesData || {}).flat();

        places.forEach((place: any) => {
          if (!place?.slug) return;

          locales.forEach((locale) => {
            const route = `/kesfet/${region}/${cleanCity}/${place.slug}`;

            entries.push({
              url: buildUrl(route, locale),
              lastModified: now,
              priority: 0.95,
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

  // =========================================================
  // 3️⃣ KEŞFET ANA
  // =========================================================

  locales.forEach((locale) => {
    entries.push({
      url: buildUrl("/kesfet", locale),
      lastModified: now,
      priority: 0.9,
    });
  });

  // =========================================================
  // 4️⃣ ÜLKELER VE ŞEHİRLER
  // =========================================================

  const countries = [
    "turkiye",
    "fransa",
    "almanya",
    "italya",
    "ispanya",
    "ingiltere",
    "hollanda",
    "avusturya",
    "yunanistan",
    "cek-cumhuriyeti",
    "rusya",
    "portekiz",
    "romanya",
    "danimarka",
    "isvec",
    "norvec",
    "isvicre",
    "amerika",
    "japonya",
    "guney-kore",
    "kktc",
    "belarus",
    "endonezya",
    "suudi-arabistan",
    "malezya",
    "misir",
    "irlanda",
    "umman",
    "bosna-hersek",
    "cin",
    "hindistan",
    "tayland",
    "urdun",
    "galler",
    "singapur",
  ];

  countries.forEach((country) => {
    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(`/kesfet/${country}`, locale),
        lastModified: now,
        priority: 0.85,
      });
    });
  });

  cities.forEach((city: any) => {
    if (!city?.slug || !city?.country) return;

    locales.forEach((locale) => {
      const route = `/kesfet/${sanitize(city.country)}/${sanitize(
        city.slug
      )}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: now,
        priority: 0.8,
      });
    });
  });

  // =========================================================
  // 5️⃣ BLOG POSTS
  // =========================================================

  allPosts.forEach((post: any) => {
    if (!post?.slug) return;

    locales.forEach((locale) => {
      const city = sanitize(post.city || "genel");
      const route = `/blog/${city}/${sanitize(post.slug)}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: post.updatedAt
          ? new Date(post.updatedAt)
          : now,
        priority: 0.75,
      });
    });
  });

  // =========================================================
  // 6️⃣ AKTİVİTELER
  // =========================================================

  const activityCities = [
    "adana",
    "adiyaman",
    "afyon",
    "afyonkarahisar",
    "agri",
    "aksaray",
    "amasya",
    "ankara",
    "antalya",
    "ardahan",
    "artvin",
    "aydin",
    "balikesir",
    "bartin",
    "batman",
    "bayburt",
    "bilecik",
    "bingol",
    "bitlis",
    "bolu",
    "burdur",
    "bursa",
    "canakkale",
    "cankiri",
    "corum",
    "denizli",
    "diyarbakir",
    "duzce",
    "edirne",
    "elazig",
    "erzincan",
    "erzurum",
    "eskisehir",
    "gaziantep",
    "giresun",
    "gumushane",
    "hakkari",
    "hatay",
    "igdir",
    "isparta",
    "istanbul",
    "izmir",
    "kahramanmaras",
    "karabuk",
    "karaman",
    "kars",
    "kastamonu",
    "kayseri",
    "kilis",
    "kirikkale",
    "kirklareli",
    "kirsehir",
    "kktc",
    "kocaeli",
    "konya",
    "kutahya",
    "lefkosa",
    "malatya",
    "manisa",
    "mardin",
    "mersin",
    "mugla",
    "mus",
    "nevsehir",
    "nigde",
    "ordu",
    "osmaniye",
    "rize",
    "sakarya",
    "samsun",
    "sanliurfa",
    "siirt",
    "sinop",
    "sirnak",
    "sivas",
    "tekirdag",
    "tokat",
    "trabzon",
    "tunceli",
    "usak",
    "van",
    "yalova",
    "yozgat",
    "zonguldak",
  ];

  activityCities.forEach((city) => {
    if (!city) return;

    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(`/aktiviteler/${city}`, locale),
        lastModified: now,
        priority: 0.7,
      });
    });
  });

  // =========================================================
  // 7️⃣ ETKİNLİKLER
  // GLOBAL PLACES JSON'DAKİ TÜM ŞEHİRLER
  // =========================================================

  globalCities.forEach((city) => {
    locales.forEach((locale) => {
      const route = `/etkinlikler/${city}`;

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

  // =========================================================
  // 8️⃣ HOTELS
  // GLOBAL PLACES JSON'DAKİ TÜM ŞEHİRLER
  // =========================================================

  globalCities.forEach((city) => {
    locales.forEach((locale) => {
      const route = `/hotels/${city}`;

      entries.push({
        url: buildUrl(route, locale),
        lastModified: now,
        priority: 0.7,
      });
    });
  });

  // =========================================================
  // 9️⃣ VİDEOLAR
  // =========================================================

  const videosWithSlugs = addSlugs(wayleroLiveVideos);

  videosWithSlugs.forEach((video) => {
    if (!video.slug) return;

    locales.forEach((locale) => {
      entries.push({
        url: buildUrl(`/videolar/${video.slug}`, locale),
        lastModified: now,
        priority: 0.6,
      });
    });
  });

  // =========================================================
  // SONUÇ
  // =========================================================

  return entries;
}