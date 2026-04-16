"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = "G-XC5RZVYFEF";

export default function GoogleAnalytics() {
  useEffect(() => {
    const sendPageView = () => {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: window.location.pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    };

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
          gtag('config', '${GA_ID}'); // <--- BU SATIR HAYATİ ÖNEMDE!
        `}
      </Script>
    </>
  );
}