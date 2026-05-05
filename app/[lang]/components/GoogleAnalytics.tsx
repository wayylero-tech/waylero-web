"use client";

import Script from "next/script";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-SMS2634C53";

// 1. Asıl çalışan kısmı küçük bir bileşene alıyoruz
function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      const url =
        pathname + (searchParams?.toString() ? `?${searchParams}` : "");

      window.gtag("config", GA_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null; // Görsel bir şey göstermesine gerek yok, sadece çalışacak.
}

// 2. Ana dışa aktarılan bileşeni Suspense içine alıyoruz
export default function GoogleAnalytics() {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());

            gtag('config', '${GA_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
}