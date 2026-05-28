import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coordinates, travelMode } = body;

    const apiKey = process.env.MAPBOX_ACCESS_TOKEN;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Mapbox API key bulunamadı" },
        { status: 500 }
      );
    }

    // [lng, lat];[lng, lat]
    const coordinatesString = coordinates
      .map((coord: [number, number]) => `${coord[0]},${coord[1]}`)
      .join(";");

    // driving / walking / cycling
    const profile =
      travelMode === "walking"
        ? "walking"
        : travelMode === "cycling"
        ? "cycling"
        : "driving";

    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinatesString}?geometries=geojson&overview=full&steps=false&access_token=${apiKey}`;

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      console.error("Mapbox Hatası:", data);

      return NextResponse.json(
        { error: "Mapbox rota alınamadı" },
        { status: response.status }
      );
    }

    // ORS formatına benzer hale getiriyoruz
    const adaptedData = {
      features: [
        {
          geometry: {
            coordinates: data.routes[0].geometry.coordinates,
          },
          properties: {
            summary: {
              distance: data.routes[0].distance,
              duration: data.routes[0].duration,
            },
          },
        },
      ],
    };

    return NextResponse.json(adaptedData);
  } catch (error) {
    console.error("Mapbox backend hatası:", error);

    return NextResponse.json(
      { error: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}