import Script from "next/script";

export default function GoogleTagManager() {
  return (
    <>
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtm.js?id=G-SMS2634C53"
      />
      <Script
        id="gtm-initializer"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SMS2634C53');
          `,
        }}
      />
    </>
  );
}