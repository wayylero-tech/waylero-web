import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

// ✅ STATIC MAPS
const slugToCityMap = rawSlugToCityMap as Record<string, string>;
const cityToCountryMap = rawCityToCountryMap as Record<string, string>;

// ✅ GERÇEK BOTLAR
const BAD_BOT_REGEX = /curl|wget|python|scrapy|node-fetch|go-http/i;

// 🌐 LOCALE HELPER
function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "en" || cookieLocale === "tr") return cookieLocale;

  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country === "TR") return "tr";

  const lang = request.headers.get("accept-language") || "";
  return lang.toLowerCase().includes("tr") ? "tr" : "en";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const { pathname, search } = request.nextUrl;

  // ⚡ 1. BOT BLOCK
  if (BAD_BOT_REGEX.test(ua)) {
    return new NextResponse("Blocked", { status: 403 });
  }

  // ⚡ 2. STATIC & INTERNAL SKIP
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  const currentLocale = segments[0]?.toLowerCase();
  const isLocale = currentLocale === "en" || currentLocale === "tr";

  // 🚀 3. ROOT → LOCALE REDIRECT
  if (pathname === "/") {
    const locale = getLocale(request);
    const url = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(url, 307);
  }

  // 🚀 4. LOCALE YOKSA
  if (!isLocale) {
    const locale = getLocale(request);

    const slug = (segments[0] || "").toLowerCase();
    const city = slugToCityMap[slug];
    const country = city ? cityToCountryMap[city] : null;

    // ✅ SEO URL
    if (city && country) {
      const url = new URL(
        `/${locale}/kesfet/${country}/${city}/${slug}${search}`,
        request.url
      );
      return NextResponse.redirect(url, 301);
    }

    // ✅ sadece locale ekle
    const url = new URL(`/${locale}${pathname}${search}`, request.url);
    return NextResponse.redirect(url, 307);
  }

  // 🚀 5. SHORT URL FIX (/tr/istanbul → full URL)
  const slugSegment = segments[1]?.toLowerCase();

  if (slugSegment && slugSegment !== "kesfet" && segments.length <= 2) {
    const city = slugToCityMap[slugSegment];
    const country = city ? cityToCountryMap[city] : null;

    if (city && country) {
      const url = new URL(
        `/${currentLocale}/kesfet/${country}/${city}/${slugSegment}${search}`,
        request.url
      );
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

// 🎯 CLEAN MATCHER
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
