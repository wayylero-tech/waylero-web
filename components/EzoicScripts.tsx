import Script from 'next/script';

export default function EzoicScripts() {
  return (
    <>
      {/* 1. Gizlilik ve İzin Komut Dosyaları (Önce yüklenmesi zorunlu) */}
      <Script
        id="ezoic-cmp-1"
        strategy="beforeInteractive"
        src="https://cmp.gatekeeperconsent.com/min.js"
        data-cfasync="false"
      />
      <Script
        id="ezoic-cmp-2"
        strategy="beforeInteractive"
        src="https://the.gatekeeperconsent.com/cmp.min.js"
        data-cfasync="false"
      />

      {/* 2. Ezoic Ana Reklam Başlatıcı Komut Dosyaları */}
      <Script
        id="ezoic-main"
        strategy="afterInteractive"
        src="//www.ezojs.com/ezoic/sa.min.js"
        async
      />
      <Script id="ezoic-setup" strategy="afterInteractive">
        {`
          window.ezstandalone = window.ezstandalone || {};
          window.ezstandalone.cmd = window.ezstandalone.cmd || [];
        `}
      </Script>
      <Script
        id="ezoic-analytics"
        strategy="afterInteractive"
        src="//ezoicanalytics.com/analytics.js"
      />
    </>
  );
}