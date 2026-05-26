import { NextResponse } from "next/server";

// Sunucu tarafında çalışan ve API anahtarını gizleyen güvenli köprü
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coordinates, orsMode } = body;

    // 🛡️ Anahtarımız sunucu içinde güvende, tarayıcı burayı asla göremez
    const apiKey = process.env.ORS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Anahtarı sunucuda bulunamadı!" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/${orsMode}/geojson`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: apiKey,
        },
        body: JSON.stringify({ coordinates }),
      }
    );

    const data = await response.json();
    
    // ORS'den gelen veriyi doğrudan bizim frontend'e paslıyoruz
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Backend rota proxy hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 });
  }
}