import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import rawSlugToCityMap from "./slug-city-map.json";
import rawCityToCountryMap from "./maps/city-to-country-map.json";

const isProd = process.env.NODE_ENV === "production";

// 🔧 SANITIZE - Middleware dışında kalsın
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

// 🚀 MAPS - BURASI KRİTİK! 
// Bu işlem Vercel instance'ı başladığında 1 kere yapılır.
// Artık her istekte (request) binlerce satır dönmeyecek.
const slugToCityMap: Record<string, string> = {};
for (const [k, v] of Object.entries(rawSlugToCityMap)) {
  slugToCityMap[sanitize(k)] = sanitize(v as string);
}

const cityToCountryMap: Record<string, string> = {};
for (const [k, v] of Object.entries(rawCityToCountryMap)) {
  cityToCountryMap[sanitize(k)] = sanitize(v as string);
}

// 🤖 BOT DETECT - Regex'leri dışarı aldık (CPU dostu)
const GOOGLE_BOT_REGEX = /googlebot|bingbot|slurp|duckduckbot|baiduspider|google-inspectiontool/i;
const BAD_BOT_REGEX = /curl|wget|python|scrapy|axios|httpclient|node-fetch|go-http|spider|crawler|bot/i;

const isGoogleBot = (ua: string) => GOOGLE_BOT_REGEX.test(ua);
const isBadBot = (ua: string) => BAD_BOT_REGEX.test(ua);

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
  // Bellek temizliği: Map çok büyürse temizle (basit önlem)
  if (rateMap.size > 5000) rateMap.clear(); 
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

// ---------------------------------------------------------
// 🛠️ ACTUAL MIDDLEWARE
// ---------------------------------------------------------
export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const ip = getIP(request);

  // 🔥 1. BOT PROTECTION (En hızlı kontrol)
  if (isBadBot(ua) && !isGoogleBot(ua)) {
    return new NextResponse("Blocked", { status: 403 });
  }

  // ⚡ 2. RATE LIMIT
  if (isProd && isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const { search } = request.nextUrl;

  // 🚨 3. SUSPICIOUS
  if (isSuspiciousPath(pathname)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const segments = pathname.split("/").filter(Boolean);
  const offset = isEn ? 1 : 0;
  const isKesfet = segments[offset] === "kesfet";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url-lang", isEn ? "en" : "tr");

  // 🔥 4. SLUG → CITY → COUNTRY (Şimdi uçuyor 🚀)
  const slugSegment = isEn ? segments[1] : segments[0];

  if (!isKesfet && slugSegment && segments.length <= (isEn ? 2 : 1)) {
    const slug = sanitize(slugSegment);
    const city = slugToCityMap[slug]; // Direkt hafızadan okuyor
    const country = city ? cityToCountryMap[city] : undefined;

    if (city && country) {
      const url = request.nextUrl.clone();
      url.pathname = `${isEn ? "/en" : ""}/kesfet/${country}/${city}/${slug}`;
      url.search = search;
      return safeRedirect(request, url);
    }
  }

  // 🔥 5. KESFET LOGIC
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
      // Doğru slug'ı bul (Bu kısım nadir çalışır, CPU'yu üzmez)
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

  // 🌐 6. FINAL RESPONSES
  const res = isEn 
    ? NextResponse.rewrite(new URL(pathname.replace(/^\/en/, "") || "/", request.url), { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  res.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  
  if (!request.cookies.has("lang")) {
    res.cookies.set("lang", isEn ? "en" : "tr", { path: "/" });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};