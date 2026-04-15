import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

const rateLimiter = new LRUCache<string, { count: number }>({
  max: 5000,
  ttl: 60 * 1000,
});

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const record = rateLimiter.get(ip) || { count: 0 };

    if (record.count >= 50) {
      return NextResponse.json({ error: "Limit" }, { status: 429 });
    }
    rateLimiter.set(ip, { count: record.count + 1 });

    const { searchParams } = new URL(request.url);
    
    // 🔥 ÖNEMLİ: ActivityList'ten gelecek yeni parametre isimlerini karşılayalım
    const cityId = searchParams.get("city_ids");
    const startParam = searchParams.get("start_gte") || searchParams.get("start"); // İki ismi de kontrol et
    const endParam = searchParams.get("end_lte") || searchParams.get("end");
    const skip = searchParams.get("skip") || "0";
    const take = searchParams.get("take") || "50";

    if (!cityId) {
      return NextResponse.json({ items: [], meta: { total_count: 0 } });
    }

    const token = process.env.ETKINLIK_API_TOKEN?.replace(/['"]+/g, "").trim();
    const apiUrl = new URL("https://etkinlik.io/api/v2/events");

    apiUrl.searchParams.set("city_ids", cityId);
    apiUrl.searchParams.set("take", take);
    apiUrl.searchParams.set("skip", skip);

    // 🔥 Tarih işleme mantığını temizleyelim
    if (startParam) {
      // Eğer gelen veride zaten saat varsa (boşluk içeriyorsa) direkt kullan, yoksa ekle
      const formattedStart = startParam.includes(" ") ? startParam : `${startParam} 00:00:00`;
      apiUrl.searchParams.set("start_gte", formattedStart);

      if (endParam) {
        const formattedEnd = endParam.includes(" ") ? endParam : `${endParam} 23:59:59`;
        apiUrl.searchParams.set("end_lte", formattedEnd);
      } else {
        // Otomatik 30 gün ekleme mantığı (Gelen start verisinden saati ayırıp işlem yapalım)
        const pureDate = startParam.split(" ")[0];
        const d = new Date(pureDate);
        d.setDate(d.getDate() + 30);
        const autoEnd = d.toISOString().split("T")[0];
        apiUrl.searchParams.set("end_lte", `${autoEnd} 23:59:59`);
      }
    }

    const res = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "X-Etkinlik-Token": token || "",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}