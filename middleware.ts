import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import turkey from "@/app/data/turkey.json";
import europa from "@/app/data/europa.json";
import asia from "@/app/data/asia.json";

const allRegions: any[] = [
  { data: turkey, region: "turkey" },
  { data: europa, region: "europa" },
  { data: asia, region: "asia" },
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // sadece /slug formatını yakala
  if (pathname.split("/").length === 2) {
    const slug = pathname.replace("/", "");

    for (const regionObj of allRegions) {
      const regionData: any = regionObj.data;

      for (const city in regionData) {
        const places = regionData[city] as any[];

        const found = places.find(
          (place) => place.slug === slug
        );

        if (found) {
          const newUrl = request.nextUrl.clone();
          newUrl.pathname = `/kesfet/${regionObj.region}/${city}/${slug}`;
          return NextResponse.redirect(newUrl, 301);
        }
      }
    }
  }

  return NextResponse.next();
}
