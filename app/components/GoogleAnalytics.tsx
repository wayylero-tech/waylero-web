"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = "G-7KN4TB8167";

export default function GoogleAnalytics() {
  useEffect(() => {
    // SAYFA AÇILINCA ZORLA EVENT GÖNDER
    const sendPageView = () => {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: window.location.pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    };

    // biraz gecikmeli çalıştır (script load için)
    setTimeout(sendPageView, 1000);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
        `}
      </Script>
    </>
  );
}