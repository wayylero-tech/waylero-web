import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

// ✅ STATIC MAPS
const slugToCityMap = rawSlugToCityMap as Record<string, string>;
const cityToCountryMap = rawCityToCountryMap as Record<string, string>;

// ✅ REAL BOT BLOCK
const BAD_BOT_REGEX = /curl|wget|python|scrapy|node-fetch|go-http/i;

// 🌐 LOCALE HELPER
function getLocale(request: NextRequest) {
  console.log("----------- GET LOCALE -----------");

  // ✅ REFERER FIRST
  const referer = request.headers.get("referer");

  console.log("REFERER:", referer);

  if (referer) {
    try {
      const refererUrl = new URL(referer);

      const firstSegment = refererUrl.pathname
        .split("/")
        .filter(Boolean)[0];

      console.log("REFERER SEGMENT:", firstSegment);

      if (firstSegment === "tr" || firstSegment === "en") {
        console.log("LOCALE FROM REFERER:", firstSegment);
        return firstSegment;
      }
    } catch (e) {
      console.log("REFERER ERROR:", e);
    }
  }

  // ✅ COOKIE
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  console.log("COOKIE:", cookieLocale);

  if (cookieLocale === "en" || cookieLocale === "tr") {
    console.log("LOCALE FROM COOKIE:", cookieLocale);
    return cookieLocale;
  }

  // ✅ COUNTRY
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();

  console.log("COUNTRY:", country);

  if (country === "TR") {
    console.log("LOCALE FROM COUNTRY: tr");
    return "tr";
  }

  // ✅ ACCEPT LANGUAGE
  const lang = request.headers.get("accept-language") || "";

  console.log("ACCEPT LANGUAGE:", lang);

  const detected = lang.toLowerCase().includes("tr") ? "tr" : "en";

  console.log("LOCALE FROM ACCEPT LANGUAGE:", detected);

  return detected;
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const { pathname, search } = request.nextUrl;

  console.log("\n=================================");
  console.log("PATHNAME:", pathname);
  console.log("SEARCH:", search);
  console.log("USER AGENT:", ua);

  // ⚡ BOT BLOCK
  if (BAD_BOT_REGEX.test(ua)) {
    console.log("BLOCKED BOT");
    return new NextResponse("Blocked", { status: 403 });
  }

  // ⚡ STATIC & INTERNAL SKIP
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    console.log("STATIC/API SKIP");
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  console.log("SEGMENTS:", segments);

  const currentLocale = segments[0]?.toLowerCase();

  console.log("CURRENT LOCALE:", currentLocale);

  const isLocale = currentLocale === "en" || currentLocale === "tr";

  console.log("IS LOCALE:", isLocale);

  // 🚀 ROOT → LOCALE
  if (pathname === "/") {
    const locale = getLocale(request);

    console.log("ROOT REDIRECT:", locale);

    const url = new URL(`/${locale}`, request.url);

    return NextResponse.redirect(url, 307);
  }

  // 🚀 LOCALE YOK
  if (!isLocale) {
    const locale = getLocale(request);

    console.log("DETECTED LOCALE:", locale);

    const slug = (segments[0] || "").toLowerCase();

    console.log("SLUG:", slug);

    const city = slugToCityMap[slug];

    console.log("CITY:", city);

    const country = city ? cityToCountryMap[city] : null;

    console.log("COUNTRY:", country);

    // ✅ SEO URL
    if (city && country) {
      const redirectPath =
        `/${locale}/kesfet/${country}/${city}/${slug}${search}`;

      console.log("SEO REDIRECT:", redirectPath);

      const url = new URL(redirectPath, request.url);

      return NextResponse.redirect(url, 301);
    }

    // ✅ NORMAL REDIRECT
    const redirectPath = `/${locale}${pathname}${search}`;

    console.log("NORMAL REDIRECT:", redirectPath);

    const url = new URL(redirectPath, request.url);

    return NextResponse.redirect(url, 307);
  }

  // 🚀 SHORT URL FIX
  const slugSegment = segments[1]?.toLowerCase();

  console.log("SLUG SEGMENT:", slugSegment);

  if (slugSegment && slugSegment !== "kesfet" && segments.length <= 2) {
    const city = slugToCityMap[slugSegment];

    console.log("SHORT URL CITY:", city);

    const country = city ? cityToCountryMap[city] : null;

    console.log("SHORT URL COUNTRY:", country);

    if (city && country) {
      const redirectPath =
        `/${currentLocale}/kesfet/${country}/${city}/${slugSegment}${search}`;

      console.log("SHORT URL REDIRECT:", redirectPath);

      const url = new URL(redirectPath, request.url);

      return NextResponse.redirect(url, 301);
    }
  }

  console.log("NEXT()");
  console.log("=================================\n");

  return NextResponse.next();
}

// 🎯 CLEAN MATCHER
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};