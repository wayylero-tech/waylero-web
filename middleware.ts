import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const cityOverrideMap: Record<string, string> = {
  dubai: "bae",
  pekin: "cin",
  tokyo: "japonya",
  viyana: "avusturya",
  paris: "fransa",
  londra: "ingiltere",
  antalya: "turkiye",
  hongkong: "cin",
  bangkok: "tayland",
  singapur: "singapur",
  barselona: "ispanya",
  roma: "italya",
  mekke: "suudi-arabistan",
  istanbul: "turkiye",
  newyork: "amerika",
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 2) {
    const [oldRegion, city] = parts;

    const newCountry = cityOverrideMap[city];

    if (newCountry) {
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/${newCountry}/${city}`;
      return NextResponse.redirect(newUrl);
    }
  }

  return NextResponse.next();
}
