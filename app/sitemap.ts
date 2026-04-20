import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import cities from "@/app/data/cities.json";
import { wayleroLiveVideos, addSlugs } from "@/videos";


import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { konyaPosts } from "@/app/data/blog/konya/posts";
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
import { catalhoyukPosts } from "@/app/data/blog/konya/posts4";



export const dynamic = "force-static";
export const revalidate = false;

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // STATIC PAGES
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/kesfet", priority: 0.95 },
    { url: "/aktiviteler", priority: 0.9 },
    { url: "/videolar", priority: 0.9 },
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

// BLOG
const allPosts = [
  ...generalPosts,
  ...uygulamaPosts,
  ...antikkentPosts,
  ...konyaPosts,
  ...konyaPosts2,
  ...konyaRehberPost,
  ...selalelerRehberPost,
  ...magaralarRehberPost,
  ...turkeyPost,
  ...kanyonlarRehberPosts,
  ...mersinRehberPosts,
  ...turkiyeEnCokZiyaretEdilen10YerPost,
  ...antalyaRehberPost,
  ...trekkingPosts,
  ...istanbulRehberPosts,
  ...antalyaPosts2,
  ...ispanyaRehberPosts,
  ...spainPosts,
  ...nevsehirRehberPosts,
  ...cappadociaPosts,
  ...turkeyPostsAkdeniz,
  ...turkeyPostEge,
  ...turkeyPostMarmara,
  ...turkeyPostIcAnadolu,
  ...turkeyPostKaradeniz,
  ...turkeyPostDoguAnadolu,
  ...turkeyPostGunaydogu,
  ...catalhoyukPosts
];

allPosts.forEach((post: any) => {
  locales.forEach((locale) => {
    const category = post.category || post.city || "genel";

    const blogPath = `/blog/${sanitize(category)}/${post.slug}`;

    entries.push({
      url: buildUrl(baseUrl, blogPath, locale),
      lastModified: new Date(post.updatedAt ?? post.createdAt ?? now),
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