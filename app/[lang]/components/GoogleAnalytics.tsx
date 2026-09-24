
"use client";

import Script from "next/script";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-SMS2634C53";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function AnalyticsContent({
  setEnabled,
}: {
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const consent = localStorage.getItem("waylero_cookie_consent");

    if (consent === "accepted") {
      setEnabled(true);
    } else {
      setEnabled(false);
    }

    const handleConsent = (event: Event) => {
      const customEvent = event as CustomEvent<"accepted" | "rejected">;

      if (customEvent.detail === "accepted") {
        setEnabled(true);
      }

      if (customEvent.detail === "rejected") {
        setEnabled(false);
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
  }, [setEnabled]);

  useEffect(() => {
    const consent = localStorage.getItem(
      "waylero_cookie_consent"
    );

    if (consent !== "accepted") {
      return;
    }

    if (typeof window.gtag !== "function") {
      return;
    }

    const url =
      pathname +
      (searchParams?.toString()
        ? `?${searchParams}`
        : "");

    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsContent setEnabled={setEnabled} />
      </Suspense>

      {enabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
          />

          <Script id="ga-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];

              function gtag() {
                window.dataLayer.push(arguments);
              }

              window.gtag = gtag;

              gtag('js', new Date());

              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });

              gtag('consent', 'update', {
                analytics_storage: 'granted'
              });

              gtag('config', '${GA_ID}', {
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}