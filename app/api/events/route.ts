import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

// Bellek yönetimi: En fazla 5000 farklı IP tutar, 
// 1 dakika (60000ms) sonra kayıtları otomatik siler.
const rateLimiter = new LRUCache<string, { count: number }>({
  max: 5000, 
  ttl: 60 * 1000, 
});

export async function GET(request: Request) {
  try {
    // 1) IP Al
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // 2) Rate Limit Kontrolü
    const maxReq = 30;
    const record = rateLimiter.get(ip) || { count: 0 };

    if (record.count >= maxReq) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderdiniz. Lütfen 1 dakika bekleyin." },
        { 
          status: 429, 
          headers: { "Retry-After": "60" } 
        }
      );
    }

    // İstek sayısını artır ve kaydı güncelle
    rateLimiter.set(ip, { count: record.count + 1 });

    // 3) Parametreleri Hazırla
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("city_ids");
    const query = searchParams.get("q");

    const token = process.env.ETKINLIK_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    // 4) Dış API İsteği
    const url = new URL("https://etkinlik.io/api/v2/events");
    url.searchParams.set("limit", "120");

    if (cityId && cityId !== "undefined") {
      url.searchParams.set("city_ids", cityId);
    } else if (query && query !== "undefined") {
      url.searchParams.set("q", query);
    }

    const res = await fetch(url.toString(), {
      headers: {
        "X-Etkinlik-Token": token,
        "Accept": "application/json",
      },
      // Burada da önbellek kullanabilirsin (Opsiyonel)
      next: { revalidate: 1800 } 
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Etkinlik API hatası", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}