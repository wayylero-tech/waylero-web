import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

const slugToCityMap = rawSlugToCityMap as Record<string, string>;
const cityToCountryMap = rawCityToCountryMap as Record<string, string>;
const BAD_BOT_REGEX = /curl|wget|python|scrapy|node-fetch|go-http/i;

function getLocale(request: NextRequest) {
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const firstSegment = refererUrl.pathname.split("/").filter(Boolean)[0];
      if (firstSegment === "tr" || firstSegment === "en") return firstSegment;
    } catch (e) {}
  }
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "en" || cookieLocale === "tr") return cookieLocale;
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country === "TR") return "tr";
  const lang = request.headers.get("accept-language") || "";
  return lang.toLowerCase().includes("tr") ? "tr" : "en";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const { pathname, search, searchParams } = request.nextUrl;

  // ⚡ BOT BLOCK & STATIC SKIP
  if (BAD_BOT_REGEX.test(ua)) return new NextResponse("Blocked", { status: 403 });
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0]?.toLowerCase();
  const isLocale = currentLocale === "en" || currentLocale === "tr";

  // 🚀 1. ROOT REDIRECT
  if (pathname === "/") {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
  }

  // 🚀 2. LOCALE OLMAYAN URL'LERİ YAKALA
  if (!isLocale) {
    const locale = getLocale(request);
    const slug = (segments[0] || "").toLowerCase();

    // --- SEO URL (KEŞFET) ---
    const city = slugToCityMap[slug];
    const country = city ? cityToCountryMap[city] : null;
    if (city && country) {
      return NextResponse.redirect(new URL(`/${locale}/kesfet/${country}/${city}/${slug}${search}`, request.url), 301);
    }

    // --- AKTİVİTELER PARAMETRE DÖNÜŞTÜRÜCÜ (?city=ankara -> /aktiviteler/ankara) ---
    const cityParam = searchParams.get("city");
    if (pathname.includes("/aktiviteler") && cityParam) {
      return NextResponse.redirect(new URL(`/${locale}/aktiviteler/${cityParam.toLowerCase()}`, request.url), 301);
    }

    // --- HAYALET "q" TEMİZLİĞİ VE NORMAL REDIRECT ---
    let finalSearch = search;
    if (pathname.includes("/kesfet") && searchParams.has("q")) {
      finalSearch = ""; 
    }

    return NextResponse.redirect(new URL(`/${locale}${pathname}${finalSearch}`, request.url), 301);
  }

  // 🚀 3. LOCALE VAR AMA PARAMETRE HALA URL'DEYSE (SEO Düzeltmesi)
  // Örn: /tr/aktiviteler?city=ankara gelirse /tr/aktiviteler/ankara'ya at
  const cityParam = searchParams.get("city");
  if (pathname.endsWith("/aktiviteler") && cityParam) {
    return NextResponse.redirect(new URL(`${pathname}/${cityParam.toLowerCase()}`, request.url), 301);
  }

  // Hayalet "q" parametresi locale varken de gelirse temizle
  if (pathname.includes("/kesfet") && searchParams.has("q")) {
    const url = new URL(request.url);
    url.searchParams.delete("q");
    return NextResponse.redirect(url, 301);
  }

  // 🚀 4. SHORT URL FIX
  const slugSegment = segments[1]?.toLowerCase();
  if (slugSegment && slugSegment !== "kesfet" && segments.length <= 2) {
    const city = slugToCityMap[slugSegment];
    const country = city ? cityToCountryMap[city] : null;
    if (city && country) {
      return NextResponse.redirect(new URL(`/${currentLocale}/kesfet/${country}/${city}/${slugSegment}${search}`, request.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};