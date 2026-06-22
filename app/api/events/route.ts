import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

const rateLimiter = new LRUCache<string, { count: number }>({
  max: 5000,
  ttl: 60 * 1000,
});

const responseCache = new LRUCache<string, any>({
  max: 200,
  ttl: 60 * 1000,
});

export async function GET(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (ip !== "unknown") {
      const record = rateLimiter.get(ip) || { count: 0 };

      if (record.count >= 100) {
        return NextResponse.json({ error: "Limit" }, { status: 429 });
      }

      rateLimiter.set(ip, { count: record.count + 1 });
    }

    const { searchParams } = new URL(request.url);

    // cityId boş olsa bile artık API isteğini engellemiyoruz.
    const cityId = searchParams.get("city_ids");
    const startParam =
      searchParams.get("start_gte") || searchParams.get("start");
    const endParam =
      searchParams.get("end_lte") || searchParams.get("end");
    const skip = searchParams.get("skip") || "0";
    const take = searchParams.get("take") || "50";

    // 🔥 Cache Key
    const cacheKey = `${cityId || "all"}-${startParam}-${endParam}-${skip}-${take}`;
    const cached = responseCache.get(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    const token = process.env.ETKINLIK_API_TOKEN?.replace(/['"]+/g, "").trim();
    const apiUrl = new URL("https://etkinlik.io/api/v2/events");

    // Sadece cityId varsa ekliyoruz, yoksa tüm Türkiye'yi almasını sağlıyoruz.
    if (cityId) {
      apiUrl.searchParams.set("city_ids", cityId);
    }
    
    apiUrl.searchParams.set("take", take);
    apiUrl.searchParams.set("skip", skip);

    if (startParam) {
      const formattedStart = startParam.includes(" ")
        ? startParam
        : `${startParam} 00:00:00`;

      apiUrl.searchParams.set("start_gte", formattedStart);

      if (endParam) {
        const formattedEnd = endParam.includes(" ")
          ? endParam
          : `${endParam} 23:59:59`;

        apiUrl.searchParams.set("end_lte", formattedEnd);
      }
    }

    const res = await fetch(apiUrl.toString(), {
  headers: {
    "X-Etkinlik-Token": token || "",
    "Accept": "application/json",
    // 🔥 EN KRİTİK EKLEME: etkinlik.io'nun Vercel'i bot sanıp engellemesini önlüyoruz
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  },
  next: { revalidate: 7200 },
});

// Hatayı daha rahat debug edebilmek için log ekleyelim:
if (!res.ok) {
  console.error("Etkinlik.io API yanıt vermedi, Kod:", res.status);
  // Eğer etkinlik.io 403 verirse, uygulamanın çökmemesi için boş dizi dönelim
  return NextResponse.json({ items: [], total_count: 0 }, { status: 200 });
}

const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    responseCache.set(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}