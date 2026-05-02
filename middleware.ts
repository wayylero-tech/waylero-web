import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import slugToCityMap from "./slug-city-map.json";

// 🌐 Map dosyaları
import cityToCountryMap from "./maps/city-to-country-map.json";

// ✅ Type çıkarımı
type CityToCountryMap = typeof cityToCountryMap;

// 🔧 SANITIZE
const sanitize = (str: string) =>
  str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "")
    .replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ö/g, "o").replace(/ç/g, "c");

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { pathname, search } = request.nextUrl;

  const isEn = pathname.startsWith("/en");
  const isKesfet = pathname.includes("/kesfet/");
  const segments = pathname.split("/").filter(Boolean);

  const slugSegment = isEn ? segments[1] : segments[0];

  // 🔥 SLUG → CITY → COUNTRY REDIRECT
  if (!isKesfet && slugSegment && segments.length === (isEn ? 2 : 1)) {
    const slug = sanitize(slugSegment);

    const city =
      slug in slugToCityMap
        ? (slugToCityMap as Record<string, string>)[slug]
        : undefined;

    if (city && city in cityToCountryMap) {
      const country = cityToCountryMap[city as keyof CityToCountryMap];

      if (country) {
        const url = request.nextUrl.clone();
        url.pathname = `${isEn ? "/en" : ""}/kesfet/${country}/${city}/${slug}`;
        url.search = search;

        return NextResponse.redirect(url, 301);
      }
    }
  }

  requestHeaders.set("x-url-lang", isEn ? "en" : "tr");
  requestHeaders.set("x-url", pathname + search);

  const parts = pathname.split("/");
  const offset = isEn ? 1 : 0;

  // 🔥 URL FIX (yanlış country varsa düzelt)
  if (isKesfet && parts.length >= 4 + offset) {
    const regionInUrl = parts[2 + offset];
    const cityInUrl = sanitize(parts[3 + offset]);

    const targetCountry =
      cityInUrl in cityToCountryMap
        ? cityToCountryMap[cityInUrl as keyof CityToCountryMap]
        : undefined;

    if (targetCountry && regionInUrl !== targetCountry) {
      const url = request.nextUrl.clone();
      const newParts = [...parts];
      newParts[2 + offset] = targetCountry;

      url.pathname = newParts.join("/");
      url.search = search;

      return NextResponse.redirect(url, 301);
    }
  }

  // 🌐 EN rewrite
  if (isEn) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    url.search = search;

    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=3600'
    );
    response.cookies.set("lang", "en", { path: "/" });

    return response;
  }

  // 🌐 DEFAULT (TR)
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=3600'
  );
  response.cookies.set("lang", "tr", { path: "/" });

  return response;
}

export const config = {
  matcher: [
    "/",
    "/:slug((?!_next|api|favicon|.*\\..*).*)",
    "/kesfet/:path*",
    "/aktiviteler/:path*",
    "/etkinlikler/:path*",
    "/blog/:path*",
    "/en/:path*",
    "/tr/:path*",
  ],
};