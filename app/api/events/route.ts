import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

const rateLimiter = new LRUCache<string, { count: number }>({
  max: 5000,
  ttl: 60 * 1000,
});

export async function GET(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const record = rateLimiter.get(ip) || { count: 0 };

    if (record.count >= 50) {
      return NextResponse.json({ error: "Limit" }, { status: 429 });
    }

    rateLimiter.set(ip, { count: record.count + 1 });

    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("city_ids");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!cityId) {
      return NextResponse.json({ items: [], meta: { total_count: 0 } });
    }

    const token = process.env.ETKINLIK_API_TOKEN
      ?.replace(/['"]+/g, "")
      .trim();

    const apiUrl = new URL("https://etkinlik.io/api/v2/events");

    apiUrl.searchParams.set("city_ids", cityId);
    apiUrl.searchParams.set("take", "50");
    apiUrl.searchParams.set("skip", "0");

    if (start) {
      apiUrl.searchParams.set("start_gte", `${start} 00:00:00`);

      if (end) {
        apiUrl.searchParams.set("end_lte", `${end} 23:59:59`);
      } else {
        const d = new Date(start);
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
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}