// app/api/events/route.ts

import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";
import { fetchEtkinlikData } from "@/lib/fetchEvents"; // Fonksiyonumuzu import ettik

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
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    if (ip !== "unknown") {
      const record = rateLimiter.get(ip) || { count: 0 };
      if (record.count >= 100) {
        return NextResponse.json({ error: "Limit" }, { status: 429 });
      }
      rateLimiter.set(ip, { count: record.count + 1 });
    }

    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("city_ids");
    const startParam = searchParams.get("start_gte") || searchParams.get("start");
    const endParam = searchParams.get("end_lte") || searchParams.get("end");
    const skip = searchParams.get("skip") || "0";
    const take = searchParams.get("take") || "50";

    const cacheKey = `${cityId || "all"}-${startParam}-${endParam}-${skip}-${take}`;
    const cached = responseCache.get(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    // 🔥 ESKİ FETCH YERİNE ORTAK FONKSİYONU ÇAĞIRIYORUZ:
    const data = await fetchEtkinlikData({
      cityId: cityId || undefined,
      startParam: startParam || undefined,
      endParam: endParam || undefined,
      skip,
      take
    });

    responseCache.set(cacheKey, data);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API rotasında hata oluştu:", error);
    return NextResponse.json(
      { error: "Sunucu hatası veya dış API engeli", details: error.message },
      { status: 500 }
    );
  }
}