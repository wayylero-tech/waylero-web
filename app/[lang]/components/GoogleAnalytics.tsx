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
    console.log("======================================");
    console.log("[GoogleAnalytics] Analiz bileşeni başladı.");

    const consent = localStorage.getItem("waylero_cookie_consent");

    console.log(
      "[GoogleAnalytics] localStorage izin durumu:",
      consent
    );

    if (consent === "accepted") {
      console.log(
        "[GoogleAnalytics] İZİN VERİLMİŞ → Google Analytics açılıyor."
      );

      setEnabled(true);
    } else {
      console.log(
        "[GoogleAnalytics] İZİN YOK / REDDEDİLMİŞ → Google Analytics kapalı."
      );

      setEnabled(false);
    }

    const handleConsent = (event: Event) => {
      const customEvent = event as CustomEvent<
        "accepted" | "rejected"
      >;

      console.log("======================================");
      console.log(
        "[GoogleAnalytics] İzin olayı yakalandı:"
      );

      console.log(
        "[GoogleAnalytics] Gelen izin:",
        customEvent.detail
      );

      if (customEvent.detail === "accepted") {
        console.log(
          "[GoogleAnalytics] KULLANICI KABUL ETTİ → Analytics açılıyor."
        );

        setEnabled(true);
      }

      if (customEvent.detail === "rejected") {
        console.log(
          "[GoogleAnalytics] KULLANICI REDDETTİ → Analytics kapalı kalacak."
        );

        setEnabled(false);
      }
    };

    window.addEventListener(
      "waylero-cookie-consent",
      handleConsent
    );

    return () => {
      console.log(
        "[GoogleAnalytics] İzin olay dinleyicisi kaldırılıyor."
      );

      window.removeEventListener(
        "waylero-cookie-consent",
        handleConsent
      );
    };
  }, [setEnabled]);

  useEffect(() => {
    console.log(
      "[GoogleAnalytics] Sayfa değişti:",
      pathname
    );

    const consent = localStorage.getItem(
      "waylero_cookie_consent"
    );

    console.log(
      "[GoogleAnalytics] Sayfa değişiminde izin:",
      consent
    );

    if (consent !== "accepted") {
      console.log(
        "[GoogleAnalytics] İzin kabul edilmediği için sayfa görüntüleme gönderilmiyor."
      );

      return;
    }

    if (typeof window.gtag !== "function") {
      console.log(
        "[GoogleAnalytics] window.gtag henüz hazır değil."
      );

      return;
    }

    const url =
      pathname +
      (searchParams?.toString()
        ? `?${searchParams}`
        : "");

    console.log(
      "[GoogleAnalytics] Sayfa görüntüleme gönderiliyor:",
      url
    );

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
            onLoad={() => {
              console.log(
                "[GoogleAnalytics] gtag.js başarıyla yüklendi."
              );
            }}
            onError={() => {
              console.log(
                "[GoogleAnalytics] gtag.js yüklenemedi."
              );
            }}
          />

          <Script id="ga-init" strategy="lazyOnload">
            {`
              console.log("[GoogleAnalytics] GA başlatma kodu çalıştı.");

              window.dataLayer = window.dataLayer || [];

              function gtag() {
                console.log(
                  "[GoogleAnalytics] gtag çağrıldı:",
                  arguments
                );

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