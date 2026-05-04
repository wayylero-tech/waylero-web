import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

const isProd = process.env.NODE_ENV === "production";

// 🔧 SANITIZE
const sanitize = (str: string) =>
  str
    .toLowerCase()
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

// 🚀 MAPS
const slugToCityMap = Object.fromEntries(
  Object.entries(rawSlugToCityMap).map(([k, v]) => [
    sanitize(k),
    sanitize(v as string),
  ])
);

const cityToCountryMap = Object.fromEntries(
  Object.entries(rawCityToCountryMap).map(([k, v]) => [
    sanitize(k),
    sanitize(v as string),
  ])
);

// 🤖 BOT DETECT
const isGoogleBot = (ua: string) =>
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|google-inspectiontool/i.test(
    ua.toLowerCase()
  );

const isBadBot = (ua: string) =>
  /curl|wget|python|scrapy|axios|httpclient|node-fetch|go-http|spider|crawler|bot/i.test(
    ua.toLowerCase()
  );

// 🌐 IP
const getIP = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0] ||
  req.headers.get("x-real-ip") ||
  "unknown";

// ⚡ RATE LIMIT
const RATE_LIMIT = 60;
const WINDOW = 10;

const rateMap = new Map<string, { count: number; time: number }>();

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const record = rateMap.get(ip);

  if (!record) {
    rateMap.set(ip, { count: 1, time: now });
    return false;
  }

  if (now - record.time > WINDOW * 1000) {
    rateMap.set(ip, { count: 1, time: now });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT;
};

// 🚨 SUSPICIOUS PATH
const isSuspiciousPath = (pathname: string) =>
  pathname.includes(".php") ||
  pathname.includes("wp-admin") ||
  pathname.includes("wp-login") ||
  pathname.includes(".env") ||
  pathname.includes("config") ||
  pathname.length > 200;

// 🔁 SAFE REDIRECT
const safeRedirect = (req: NextRequest, url: URL) => {
  if (
    req.nextUrl.pathname === url.pathname &&
    req.nextUrl.search === url.search
  ) {
    return NextResponse.next();
  }
  return NextResponse.redirect(url, isProd ? 301 : 307);
};

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const ip = getIP(request);

  // 🔥 BOT PROTECTION (GOOGLE SAFE)
  if (isBadBot(ua) && !isGoogleBot(ua)) {
    return new NextResponse("Blocked", { status: 403 });
  }

  // ⚡ RATE LIMIT
  if (isProd && isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const { search } = request.nextUrl;

  if (isSuspiciousPath(pathname)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 🌐 LANG DETECT
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const segments = pathname.split("/").filter(Boolean);
  const offset = isEn ? 1 : 0;

  const isKesfet = segments[offset] === "kesfet";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url-lang", isEn ? "en" : "tr");

  // 🔥 SLUG → CITY → COUNTRY
  const slugSegment = isEn ? segments[1] : segments[0];

  if (!isKesfet && slugSegment && segments.length <= (isEn ? 2 : 1)) {
    const slug = sanitize(slugSegment);
    const city = slugToCityMap[slug];
    const country = city ? cityToCountryMap[city] : undefined;

    if (city && country) {
      const url = request.nextUrl.clone();
      url.pathname = `${isEn ? "/en" : ""}/kesfet/${country}/${city}/${slug}`;
      url.search = search;
      return safeRedirect(request, url);
    }
  }

  // 🔥 KESFET LOGIC
  if (isKesfet && segments.length > 2 + offset) {
    const regionInUrl = sanitize(segments[1 + offset] || "");
    const cityInUrl = sanitize(segments[2 + offset] || "");
    const slugInUrl = sanitize(segments[3 + offset] || "");

    const targetCountry = cityToCountryMap[cityInUrl];

    if (!targetCountry) {
      return new NextResponse(null, { status: 404 });
    }

    if (regionInUrl !== targetCountry) {
      const url = request.nextUrl.clone();
      const newSegments = [...segments];
      newSegments[1 + offset] = targetCountry;
      url.pathname = "/" + newSegments.join("/");
      url.search = search;
      return safeRedirect(request, url);
    }

    const expectedCity = slugToCityMap[slugInUrl];

    if (slugInUrl && expectedCity && expectedCity !== cityInUrl) {
      const correctSlug = Object.keys(slugToCityMap).find(
        (k) => slugToCityMap[k] === cityInUrl
      );

      if (correctSlug) {
        const url = request.nextUrl.clone();
        const newSegments = [...segments];
        newSegments[3 + offset] = correctSlug;
        url.pathname = "/" + newSegments.join("/");
        url.search = search;
        return safeRedirect(request, url);
      }

      return new NextResponse(null, { status: 404 });
    }
  }

  // 🌐 EN REWRITE
  if (isEn) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    url.search = search;

    const res = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });

    res.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=3600"
    );

    if (!request.cookies.has("lang")) {
      res.cookies.set("lang", "en", { path: "/" });
    }

    return res;
  }

  // 🌐 DEFAULT TR
  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });

  res.headers.set(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=3600"
  );

  if (!request.cookies.has("lang")) {
    res.cookies.set("lang", "tr", { path: "/" });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};