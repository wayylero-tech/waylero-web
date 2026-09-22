import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

const slugToCityMap = rawSlugToCityMap as Record<string, string>;
const cityToCountryMap = rawCityToCountryMap as Record<string, string>;

// Eski slug -> Yeni slug yönlendirme haritası
const LEGACY_REDIRECTS: Record<string, string> = {
  "hagios-stephanos-church-aziz-stefan-kilisesi":
    "hagios-georgios-metropolitik-kilisesi",
};

// Eski tam URL -> Yeni tam URL yönlendirme haritası
// Şehir veya ülke bilgisi de değişen URL'ler burada tutulur.
const SPECIAL_LEGACY_REDIRECTS: Record<string, string> = {
  // --- MEVCUT YÖNLENDİRMELER ---
  "/tr/kesfet/turkiye/afyonkarahisar/ihsaniye-taskinpasa-camii":
    "/tr/kesfet/turkiye/nevsehir/taskinpasa-camii",

  "/en/kesfet/turkey/afyonkarahisar/ihsaniye-taskinpasa-camii":
    "/en/kesfet/turkey/nevsehir/taskinpasa-camii",

  "/tr/kesfet/turkiye/mersin/ayvagedigi-plaji":
    "/tr/kesfet/turkiye/mersin/ayvagedigi-yaylasi",

  "/en/kesfet/turkey/mersin/ayvagedigi-plaji":
    "/en/kesfet/turkey/mersin/ayvagedigi-yaylasi",
    
// --- BRUGGE / ÇAN KULESİ ---
  "/tr/kesfet/fransa/brugge/belcika-ve-fransa-nin-can-kulesi":
    "/tr/kesfet/belcika/brugge/brugge-can-kulesi",

  "/en/kesfet/fransa/brugge/belcika-ve-fransa-nin-can-kulesi":
    "/en/kesfet/belcika/brugge/brugge-can-kulesi",

  // --- HONG KONG (TR & EN) ---
  "/tr/kesfet/cin/hong-kong": "/tr/kesfet/cin/hongkong",
  "/tr/cin/hongkong": "/tr/kesfet/cin/hongkong",
  "/en/kesfet/cin/hong-kong": "/en/kesfet/cin/hongkong",

  // --- ORDESA ---
  "/tr/kesfet/fransa/ordesa": "/tr/kesfet/ispanya/ordesa",
  "/en/kesfet/fransa/ordesa": "/en/kesfet/ispanya/ordesa",

  // --- TOULOUSE & CHARTRES DÜZELTMELERİ ---
  "/tr/kesfet/fransa/toulse": "/tr/kesfet/fransa/toulouse",
  "/en/kesfet/fransa/toulse": "/en/kesfet/fransa/toulouse",

 "/tr/kesfet/fransa/chartes": "/tr/kesfet/fransa/chartres",
  "/en/kesfet/fransa/chartes": "/en/kesfet/fransa/chartres",

// --- XI'AN ESKİ URL'LER (TR & EN) ---
"/tr/kesfet/cin/xi-anfianal":
  "/tr/kesfet/cin/xi-an",

"/en/kesfet/cin/xi-anfianal":
  "/en/kesfet/cin/xi-an",

"/tr/kesfet/cin/xi-anfiana":
  "/tr/kesfet/cin/xi-an",

"/en/kesfet/cin/xi-anfiana":
  "/en/kesfet/cin/xi-an",

  // --- NEW YORK (TR & EN) ---
  "/tr/amerika/newyork": "/tr/kesfet/amerika/newyork",
  "/en/kesfet/amerika/new-york": "/en/kesfet/amerika/newyork",

  // --- AFYONKARAHİSAR (TR & EN) ---
  "/tr/aktiviteler/afyon": "/tr/aktiviteler/afyonkarahisar",
  "/en/aktiviteler/afyon": "/en/aktiviteler/afyonkarahisar",

  "/tr/kesfet/fransa/brugge":
  "/tr/kesfet/belcika/brugge",

"/en/kesfet/fransa/brugge":
  "/en/kesfet/belcika/brugge",

  // --- SRI LANKA / POLONNARUWA ---
"/tr/kesfet/sri-lanka/sri-lanka":
  "/tr/kesfet/sri-lanka/polonnaruwa",

"/en/kesfet/sri-lanka/sri-lanka":
  "/en/kesfet/sri-lanka/polonnaruwa",

  // --- SRI LANKA ESKİ ŞEHİR URL'LERİ ---

"/tr/kesfet/sri-lanka/sri-lanka/sigiriya-kayasi":
  "/tr/kesfet/sri-lanka/sigiriya/sigiriya-kayasi",

"/en/kesfet/sri-lanka/sri-lanka/sigiriya-kayasi":
  "/en/kesfet/sri-lanka/sigiriya/sigiriya-kayasi",

"/tr/kesfet/sri-lanka/sri-lanka/polonnaruwa-antik-kenti":
  "/tr/kesfet/sri-lanka/polonnaruwa/polonnaruwa-antik-kenti",

"/en/kesfet/sri-lanka/sri-lanka/polonnaruwa-antik-kenti":
  "/en/kesfet/sri-lanka/polonnaruwa/polonnaruwa-antik-kenti",

"/tr/kesfet/sri-lanka/sri-lanka/kandy-golu":
  "/tr/kesfet/sri-lanka/kandy/kandy-golu",

"/en/kesfet/sri-lanka/sri-lanka/kandy-golu":
  "/en/kesfet/sri-lanka/kandy/kandy-golu",

  // --- BELARUS ESKİ URL'LERİ ---

"/tr/kesfet/belarus/belarus":
  "/tr/kesfet/belarus/brest",

"/en/kesfet/belarus/belarus":
  "/en/kesfet/belarus/brest",

"/tr/kesfet/belarus/belarus/minsk-baskent":
  "/tr/kesfet/belarus/minsk/minsk-baskent",

"/en/kesfet/belarus/belarus/minsk-baskent":
  "/en/kesfet/belarus/minsk/minsk-baskent",

"/tr/kesfet/belarus/belarus/brest-kalesi":
  "/tr/kesfet/belarus/brest/brest-kalesi",

"/en/kesfet/belarus/belarus/brest-kalesi":
  "/en/kesfet/belarus/brest/brest-kalesi",

  // --- TIMISOARA / PIATA UNIRII ---
  "/tr/kesfet/romanya/timisoara/unirii-meydani":
    "/tr/kesfet/romanya/timisoara/piata-unirii-timisoara",

  "/en/kesfet/romanya/timisoara/unirii-meydani":
    "/en/kesfet/romanya/timisoara/piata-unirii-timisoara",

    // --- MERSIN / KANLIDIVANE ---
  "/tr/kesfet/turkiye/mersin/kanlidivane-oren-yeri":
    "/tr/kesfet/turkiye/mersin/kanli-divane-oren-yeri",

  "/en/kesfet/turkey/mersin/kanlidivane-oren-yeri":
    "/en/kesfet/turkey/mersin/kanli-divane-oren-yeri",

    // --- LİZBON / BELÉM KULESİ ---
  "/tr/kesfet/portekiz/lizbon/bel-m-kulesi":
    "/tr/kesfet/portekiz/lizbon/belem-kulesi",

  "/en/kesfet/portekiz/lizbon/bel-m-kulesi":
    "/en/kesfet/portekiz/lizbon/belem-kulesi",

    // --- CLUJ-NAPOCA / BOTANİK BAHÇESİ ---
  "/tr/kesfet/romanya/cluj-napoca/botanik-bahcesi":
    "/tr/kesfet/romanya/cluj-napoca/alexandru-borza-botanik-bahcesi",

  "/en/kesfet/romanya/cluj-napoca/botanik-bahcesi":
    "/en/kesfet/romanya/cluj-napoca/alexandru-borza-botanik-bahcesi",

    // --- MONTGOMERY / ROSA PARKS MUSEUM ---
  "/tr/kesfet/amerika/montgomery/montgomery-medeniyetler-muzesi":
    "/tr/kesfet/amerika/montgomery/rosa-parks-museum",

  "/en/kesfet/amerika/montgomery/montgomery-medeniyetler-muzesi":
    "/en/kesfet/amerika/montgomery/rosa-parks-museum",

    // --- ORLANDO / EPCOT ---
  "/tr/kesfet/amerika/orlando/epcot-center":
    "/tr/kesfet/amerika/orlando/epcot",

  "/en/kesfet/amerika/orlando/epcot-center":
    "/en/kesfet/amerika/orlando/epcot",
};

const BAD_BOT_REGEX = /curl|wget|python|scrapy|node-fetch|go-http/i;

function getLocale(request: NextRequest): "tr" | "en" {
  const referer = request.headers.get("referer");

  if (referer) {
    try {
      const refererUrl = new URL(referer);

      const firstSegment = refererUrl.pathname
        .split("/")
        .filter(Boolean)[0]
        ?.toLowerCase();

      if (firstSegment === "tr" || firstSegment === "en") {
        return firstSegment;
      }
    } catch {}
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  if (cookieLocale === "en" || cookieLocale === "tr") {
    return cookieLocale;
  }

  const country = request.headers
    .get("x-vercel-ip-country")
    ?.toUpperCase();

  if (country === "TR") {
    return "tr";
  }

  const acceptLanguage =
    request.headers.get("accept-language") || "";

  return acceptLanguage.toLowerCase().includes("tr")
    ? "tr"
    : "en";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";

  const { pathname, search, searchParams } =
    request.nextUrl;

  // BOT BLOCK
  if (BAD_BOT_REGEX.test(ua)) {
    return new NextResponse("Blocked", {
      status: 403,
    });
  }

  // STATIC / API SKIP
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ESKİ KEŞFET URL'LERİ (410 GONE)
  const gonePaths = [
    "/kesfet/turkey",
    "/en/kesfet/turkey",
    "/kesfet/europa",
    "/en/kesfet/europa",
    "/kesfet/asia",
    "/en/kesfet/asia",
  ];

  if (
    gonePaths.includes(
      pathname.toLowerCase()
    )
  ) {
    return new NextResponse("Gone", {
      status: 410,
    });
  }

  const segments = pathname
    .split("/")
    .filter(Boolean);

  const currentLocale =
    segments[0]?.toLowerCase();

  const isLocale =
    currentLocale === "tr" ||
    currentLocale === "en";

  // =====================================================
  // ÖZEL ESKİ URL YÖNLENDİRMELERİ
  // =====================================================

  const normalizedPathname =
    pathname.toLowerCase();


 if (
    normalizedPathname ===
      "/blog/genel/albay-koyu-gezi-rehberi-akyaka" ||
    normalizedPathname ===
      "/tr/blog/genel/albay-koyu-gezi-rehberi-akyaka" ||
    normalizedPathname ===
      "/en/blog/genel/albay-koyu-gezi-rehberi-akyaka"
  ) {
    const legacyLocale =
      currentLocale === "en"
        ? "en"
        : "tr";

    const newBlogPath =
      legacyLocale === "en"
        ? "/en/blog/mugla/albay-koyu-gezi-rehberi-akyaka"
        : "/tr/blog/mugla/albay-koyu-gezi-rehberi-akyaka";

    return NextResponse.redirect(
      new URL(
        `${newBlogPath}${search}`,
        request.url
      ),
      301
    );
  }


  if (
    SPECIAL_LEGACY_REDIRECTS[
      normalizedPathname
    ]
  ) {
    const newPath =
      SPECIAL_LEGACY_REDIRECTS[
        normalizedPathname
      ];

    return NextResponse.redirect(
      new URL(
        `${newPath}${search}`,
        request.url
      ),
      301
    );
  }

  // =====================================================
  // LEGACY SLUG / URL YÖNLENDİRMESİ (301)
  // =====================================================

  const lastSegment =
    segments[
      segments.length - 1
    ]?.toLowerCase();

  if (
    lastSegment &&
    LEGACY_REDIRECTS[lastSegment]
  ) {
    const newSlug =
      LEGACY_REDIRECTS[lastSegment];

    const newPathname =
      pathname.replace(
        lastSegment,
        newSlug
      );

    return NextResponse.redirect(
      new URL(
        `${newPathname}${search}`,
        request.url
      ),
      301
    );
  }

  // =====================================================
  // URL'DEKİ DİLİ KULLAN
  // =====================================================

  const detectedLocale: "tr" | "en" =
    isLocale
      ? (currentLocale as "tr" | "en")
      : getLocale(request);

  // =====================================================
  // ROOT REDIRECT
  // =====================================================

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(
        `/${detectedLocale}`,
        request.url
      ),
      307
    );
  }

  // =====================================================
  // LOCALE OLMAYAN URL'LER
  // =====================================================

  if (!isLocale) {
    const locale =
      getLocale(request);

    const slug =
      (segments[0] || "").toLowerCase();

    // SEO URL - KEŞFET
    const city =
      slugToCityMap[slug];

    const country =
      city
        ? cityToCountryMap[city]
        : null;

    if (city && country) {
      return NextResponse.redirect(
        new URL(
          `/${locale}/kesfet/${country}/${city}/${slug}${search}`,
          request.url
        ),
        301
      );
    }

    // AKTİVİTELER
    const cityParam =
      searchParams.get("city");

    if (
      pathname.includes("/aktiviteler") &&
      cityParam
    ) {
      return NextResponse.redirect(
        new URL(
          `/${locale}/aktiviteler/${cityParam.toLowerCase()}`,
          request.url
        ),
        301
      );
    }

    // q PARAMETRESİ
    let finalSearch = search;

    if (
      pathname.includes("/kesfet") &&
      searchParams.has("q")
    ) {
      finalSearch = "";
    }

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname}${finalSearch}`,
        request.url
      ),
      301
    );
  }

  // =====================================================
  // AKTİVİTELER CITY PARAMETRESİ
  // =====================================================

  const cityParam =
    searchParams.get("city");

  if (
    pathname.endsWith("/aktiviteler") &&
    cityParam
  ) {
    return NextResponse.redirect(
      new URL(
        `${pathname}/${cityParam.toLowerCase()}`,
        request.url
      ),
      301
    );
  }

  // =====================================================
  // q PARAMETRESİNİ TEMİZLE
  // =====================================================

  if (
    pathname.includes("/kesfet") &&
    searchParams.has("q")
  ) {
    const url =
      new URL(request.url);

    url.searchParams.delete("q");

    return NextResponse.redirect(
      url,
      301
    );
  }

  // =====================================================
  // SHORT URL FIX
  // =====================================================

  const slugSegment =
    segments[1]?.toLowerCase();

  if (
    slugSegment &&
    slugSegment !== "kesfet" &&
    segments.length <= 2
  ) {
    const city =
      slugToCityMap[slugSegment];

    const country =
      city
        ? cityToCountryMap[city]
        : null;

    if (city && country) {
      return NextResponse.redirect(
        new URL(
          `/${currentLocale}/kesfet/${country}/${city}/${slugSegment}${search}`,
          request.url
        ),
        301
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};