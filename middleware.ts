import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

// --- 1. OPTİMİZASYON: MEMOIZATION ---
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

const slugToCityMap = Object.fromEntries(
  Object.entries(rawSlugToCityMap).map(([k, v]) => [sanitize(k), sanitize(v as string)])
);

const cityToCountryMap = Object.fromEntries(
  Object.entries(rawCityToCountryMap).map(([k, v]) => [sanitize(k), sanitize(v as string)])
);

// --- BOT FILTER ---
const GOOGLE_BOT_REGEX =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|google-inspectiontool/i;

const BAD_BOT_REGEX = /curl|wget|python|scrapy|node-fetch|go-http/i;

// --- DİL HELPER ---
function getLocale(request: NextRequest) {
  // 1. Çerezde (Cookie) daha önce yapılmış bir dil tercihi var mı?
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "en" || cookieLocale === "tr") {
    return cookieLocale;
  }

  // 2. Vercel veya benzeri platformlardan gelen ülke bilgisini al
  // request.geo.country genellikle "TR", "US" gibi iki harfli ülke kodları döner.
 const country =
  request.headers.get("x-vercel-ip-country")?.toUpperCase() || "";

  // 3. Konum Türkiye ise "tr", diğer ülkeler ise "en" yap
  if (country === "TR") {
    return "tr";
  }

  // 4. Tarayıcı dilini son çare olarak kontrol et
  const acceptLang = request.headers.get("accept-language") || "";
  
  if (acceptLang.toLowerCase().includes("tr")) {
    return "tr";
  }

  // Varsayılan olarak Türkiye dışındakiler için İngilizce
  return "en";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const { pathname, search } = request.nextUrl;

  // A. GÜVENLİK
  if (BAD_BOT_REGEX.test(ua) && !GOOGLE_BOT_REGEX.test(ua)) {
    return new NextResponse("Blocked", { status: 403 });
  }

  // B. DOSYA KONTROLÜ
  const isFile = pathname.includes(".") || pathname.startsWith("/_next");
  if (isFile) return NextResponse.next();

  // C. PATH + SEGMENTS
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0];
  const isEn = currentLocale === "en";
  const isTr = currentLocale === "tr";

  // 🚀 1. DİL YOKSA (TEK HAMLE REDIRECT)
  if (!isEn && !isTr) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();

    const possibleSlug = segments[0] ? sanitize(segments[0]) : null;
    const city = possibleSlug ? slugToCityMap[possibleSlug] : null;
    const country = city ? cityToCountryMap[city] : null;

    let response: NextResponse;

    if (city && country) {
      url.pathname = `/${locale}/kesfet/${country}/${city}/${possibleSlug}`;
      url.search = search; // ✅ query korunur
      response = NextResponse.redirect(url, 301);
    } else {
      url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
      url.search = search; // ✅ query korunur
      response = NextResponse.redirect(url, 307);
    }

    // ✅ Cookie sadece gerekliyse set edilir
    if (request.cookies.get("NEXT_LOCALE")?.value !== locale) {
      response.cookies.set("NEXT_LOCALE", locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  }

  // 🚀 2. DİL VAR AMA KISA URL
  const slugSegment = segments[1];

  if (slugSegment !== "kesfet" && slugSegment && segments.length <= 2) {
    const slug = sanitize(slugSegment);
    const city = slugToCityMap[slug];
    const country = city ? cityToCountryMap[city] : null;

    if (city && country) {
      const url = request.nextUrl.clone();
      url.pathname = `/${currentLocale}/kesfet/${country}/${city}/${slug}`;
      url.search = search; // ✅ query korunur
      return NextResponse.redirect(url, 301);
    }
}
  return NextResponse.next();
} // 👈

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
};