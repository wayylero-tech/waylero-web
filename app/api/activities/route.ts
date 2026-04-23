import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Şehir bilgisini al
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'istanbul';

  // 2. Anahtarı kontrol et
  const apiKey = process.env.TRAVELPAYOUTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API Anahtarı bulunamadı (.env.local)' }, { status: 500 });
  }

  // 3. API Uç Noktası (Endpoint) - Burayı dokümantasyona göre teyit edeceğiz
  const url = `https://api.travelpayouts.com/tours/v1/city/${city}/tours.json`;
  
  // Terminalde neye istek attığımızı görelim
  console.log("✈️ [DEBUG] İstek atılan adres:", url);

  try {
    const res = await fetch(url, {
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      // Hata detayını yakala
      const errorText = await res.text();
      console.error(`❌ [API HATASI] Status: ${res.status}, Message: ${errorText}`);
      
      return NextResponse.json({ 
        error: `API hata verdi`, 
        details: errorText,
        status: res.status 
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("🔥 [SUNUCU HATASI]:", error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 });
  }
}