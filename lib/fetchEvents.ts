// src/lib/fetchEvents.ts

export async function fetchEtkinlikData(params: { 
  cityId?: string; 
  take?: string; 
  skip?: string; 
  startParam?: string; 
  endParam?: string; 
  lang?: string;
}) {
  const token = process.env.ETKINLIK_API_TOKEN?.replace(/['"]+/g, "").trim();
  const apiUrl = new URL("https://etkinlik.io/api/v2/events");

  if (params.cityId) {
    apiUrl.searchParams.set("city_ids", params.cityId);
  }
  
  apiUrl.searchParams.set("take", params.take || "50");
  apiUrl.searchParams.set("skip", params.skip || "0");

  if (params.startParam) {
    const formattedStart = params.startParam.includes(" ")
      ? params.startParam
      : `${params.startParam} 00:00:00`;

    apiUrl.searchParams.set("start_gte", formattedStart);

    if (params.endParam) {
      const formattedEnd = params.endParam.includes(" ")
        ? params.endParam
        : `${params.endParam} 23:59:59`;

      apiUrl.searchParams.set("end_lte", formattedEnd);
    }
  }

  const res = await fetch(apiUrl.toString(), {
    headers: {
      "X-Etkinlik-Token": token || "",
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
    next: { revalidate: 7200 }, // Kendi cache süreni burada koruyoruz
  });

  if (!res.ok) {
    throw new Error(`Etkinlik.io API hatası! Statü: ${res.status}`);
  }

  return res.json();
}