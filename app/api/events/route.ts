import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Frontend'den gelen parametreleri yakalıyoruz
  const cityId = searchParams.get("city_ids");
  const query = searchParams.get("q");

  const token = process.env.ETKINLIK_API_TOKEN;

  // Temel URL
  let url = `https://etkinlik.io/api/v2/events?limit=24`;

  // Filtreleri ekliyoruz
  if (cityId && cityId !== "undefined") {
    url += `&city_ids=${cityId}`;
  } else if (query && query !== "undefined") {
    url += `&q=${encodeURIComponent(query)}`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "X-Etkinlik-Token": token || "",
        "Accept": "application/json",
      },
      cache: 'no-store'
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}