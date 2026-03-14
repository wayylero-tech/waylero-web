import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const cityOverrideMap: Record<string, string> = {
  "viyana": "avusturya",
  "dubai": "bae",
  "pekin": "cin",
  "tokyo": "japonya",
  "paris": "fransa",
  "londra": "ingiltere",
  "antalya": "turkiye",
  "hongkong": "cin",
  "bangkok": "tayland",
  "singapur": "singapur",
  "barselona": "ispanya",
  "roma": "italya",
  "mekke": "suudi-arabistan",
  "istanbul": "turkiye",
  "newyork": "amerika",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // URL'i parçalara ayırıyoruz: /avrupa/viyana -> ["", "avrupa", "viyana"]
  const parts = pathname.split('/');
  
  if (parts.length === 3) {
    const regionOrCountry = parts[1];
    const city = parts[2];

    // Eğer şehir bizim listemizde varsa ve şu anki ülke/bölge hatalıysa
    if (cityOverrideMap[city] && cityOverrideMap[city] !== regionOrCountry) {
      const newUrl = new URL(`/${cityOverrideMap[city]}/${city}`, request.url);
      return NextResponse.redirect(newUrl, { status: 301 }); // SEO için 301 kalıcı yönlendirme
    }
  }

  return NextResponse.next();
}

// Sadece dinamik rotalarda çalışması için kısıtlayabilirsin
export const config = {
  matcher: '/:path*',
};