import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

// ✔ direkt kullan (artık temizleme yok)
const slugToCityMap = rawSlugToCityMap as Record<string, string>;
const cityToCountryMap = rawCityToCountryMap as Record<string, string>;

// --- BOT FILTER ---
const GOOGLE_BOT_REGEX =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|google-inspectiontool/i;

const BAD_BOT_REGEX = /curl|wget|python|scrapy|node-fetch|go-http/i;

// --- DİL HELPER ---
function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "en" || cookieLocale === "tr") {
    return cookieLocale;
  }

  const country =
    request.headers.get("x-vercel-ip-country")?.toUpperCase() || "";

  if (country === "TR") return "tr";

  const acceptLang = request.headers.get("accept-language") || "";
  if (acceptLang.toLowerCase().includes("tr")) return "tr";

  return "en";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const { pathname, search } = request.nextUrl;

  // A. BOT FILTER
  if (BAD_BOT_REGEX.test(ua) && !GOOGLE_BOT_REGEX.test(ua)) {
    return new NextResponse("Blocked", { status: 403 });
  }

  // B. STATIC FILES
  const isFile = pathname.includes(".") || pathname.startsWith("/_next");
  if (isFile) return NextResponse.next();

  // C. SEGMENTS
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0];
  const isEn = currentLocale === "en";
  const isTr = currentLocale === "tr";

  // 🚀 1. LOCALE YOKSA
  if (!isEn && !isTr) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();

    const slug = segments[0] || null;
    const city = slug ? slugToCityMap[slug] : null;
    const country = city ? cityToCountryMap[city] : null;

    if (city && country) {
      url.pathname = `/${locale}/kesfet/${country}/${city}/${slug}`;
      url.search = search;
      return NextResponse.redirect(url, 301);
    }

    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    url.search = search;
    return NextResponse.redirect(url, 307);
  }

  // 🚀 2. SHORT URL HANDLING
  const slugSegment = segments[1];

  if (slugSegment !== "kesfet" && slugSegment && segments.length <= 2) {
    const slug = slugSegment;
    const city = slugToCityMap[slug];
    const country = city ? cityToCountryMap[city] : null;

    if (city && country) {
      const url = request.nextUrl.clone();
      url.pathname = `/${currentLocale}/kesfet/${country}/${city}/${slug}`;
      url.search = search;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};