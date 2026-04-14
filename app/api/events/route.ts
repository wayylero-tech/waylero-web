import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

const rateLimiter = new LRUCache<string, { count: number }>({
  max: 5000,
  ttl: 60 * 1000,
});

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("city_ids");
    const start = searchParams.get("start"); // Örn: 2026-06-15
    const end = searchParams.get("end");

    console.log("\n--- 🚀 YENİ İSTEK GELDİ ---");
    console.log(`📅 Parametreler: Şehir: ${cityId}, Başlangıç: ${start}, Bitiş: ${end}`);

    if (!cityId) {
      return NextResponse.json({ items: [], meta: { total_count: 0 } });
    }

    const token = process.env.ETKINLIK_API_TOKEN?.replace(/['"]+/g, '').trim();
    if (!token) {
      console.error("❌ Hata: API Token bulunamadı!");
      return NextResponse.json({ error: "Token config error" }, { status: 500 });
    }

    const apiUrl = new URL("https://etkinlik.io/api/v2/events");
    apiUrl.searchParams.set("city_ids", cityId);
    apiUrl.searchParams.set("limit", "100");

    if (start) {
      // API'yi ileri tarihe bakmaya zorlamak için saatli format
      apiUrl.searchParams.set("start", `${start} 00:00:00`);
      
      if (end) {
        apiUrl.searchParams.set("end", `${end} 23:59:59`);
      } else {
        // Kullanıcı bitiş seçmediyse 30 günlük bir pencere açıyoruz ki biletleri görebilsin
        const d = new Date(start);
        d.setDate(d.getDate() + 30);
        const autoEnd = d.toISOString().split('T')[0];
        apiUrl.searchParams.set("end", `${autoEnd} 23:59:59`);
        console.log(`🕒 Otomatik 30 günlük pencere: ${start} -> ${autoEnd}`);
      }
    }

    console.log(`🔗 API'YE GİDEN URL: ${apiUrl.toString()}`);

    const res = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "X-Etkinlik-Token": token,
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    const fetchDuration = Date.now() - startTime;

    if (!res.ok) {
      console.error(`❌ API HATASI:`, data);
      return NextResponse.json(data, { status: res.status });
    }

    const initialCount = data.items?.length || 0;
    console.log(`📥 API'den Gelen Ham Veri: ${initialCount} adet (${fetchDuration}ms)`);

    // 🔥 AKILLI FİLTRELEME (B Planı 2.0)
    if (data.items && start) {
      const today = new Date().toISOString().split('T')[0];

      // Eğer kullanıcı BUGÜNÜ seçtiyse, araya yarının konserleri girmesin diye sıkı filtre yapıyoruz
      if (start === today && (!end || end === today)) {
        console.log(`🛠️ Bugün filtresi uygulanıyor (Sadece ${start})`);
        data.items = data.items.filter((event: any) => event.start.startsWith(start));
      } 
      // Eğer kullanıcı GELECEK bir tarih seçtiyse, API'nin getirdiği en yakın sonuçları 
      // silmiyoruz ki adam ileri tarihli biletleri görebilsin.
      else {
        console.log("ℹ️ Gelecek/Aralık araması: Filtreleme gevşetildi (Geniş liste gösteriliyor)");
      }
    }

    const finalCount = data.items?.length || 0;
    console.log(`✅ UI'a Gönderilen: ${finalCount}`);
    
    if (finalCount > 0) {
      console.log(`📍 Örnek Veri: ${data.items[0].name} | ${data.items[0].start}`);
    }

    console.log("--- ✅ İSTEK TAMAMLANDI ---\n");
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("🔥 KRİTİK HATA:", error.message);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}