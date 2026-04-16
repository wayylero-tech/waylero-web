"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = "G-XC5RZVYFEF";

export default function GoogleAnalytics() {
  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        page_path: window.location.pathname,
      });
    }
  }, []);

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
  );
}