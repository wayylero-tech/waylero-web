"use client";

import Script from "next/script";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-SMS2634C53";

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("waylero_cookie_consent");

      if (consent !== "accepted") {
        return;
      }

      if (typeof window.gtag !== "function") {
        return;
      }

      const url =
        pathname + (searchParams?.toString() ? `?${searchParams}` : "");

      window.gtag("config", GA_ID, {
        page_path: url,
      });
    };

    checkConsent();

    const handleConsent = (event: Event) => {
      const customEvent = event as CustomEvent<"accepted" | "rejected">;

      if (customEvent.detail !== "accepted") {
        return;
      }

      const url =
        pathname + (searchParams?.toString() ? `?${searchParams}` : "");

      if (typeof window.gtag === "function") {
        window.gtag("config", GA_ID, {
          page_path: url,
        });
      }
    };

    window.addEventListener(
      "waylero-cookie-consent",
      handleConsent
    );

    return () => {
      window.removeEventListener(
        "waylero-cookie-consent",
        handleConsent
      );
    };
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>

      {/* strategy="lazyOnload" ile Google Analytics ertelemesi sağlandı */}
      <Script
        id="ga-loader"
        strategy="lazyOnload"
      >
        {`
          (function() {
            var consent = localStorage.getItem("waylero_cookie_consent");

            if (consent !== "accepted") {
              return;
            }

            var script = document.createElement("script");
            script.src = "https://www.googletagmanager.com/gtag/js?id=${GA_ID}";
            script.async = true;
            document.head.appendChild(script);
          })();
        `}
      </Script>

      <Script
        id="ga-init"
        strategy="lazyOnload"
      >
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            dataLayer.push(arguments);
          }

          window.gtag = gtag;

          gtag('js', new Date());

          if (localStorage.getItem("waylero_cookie_consent") === "accepted") {
            gtag('config', '${GA_ID}', {
              send_page_view: false
            });
          }
        `}
      </Script>
    </>
  );
}