"use client";

import Script from "next/script";

export default function Stay22Script() {
  return (
    <Script
      id="stay22-script"
      strategy="afterInteractive"
    >
      {`
        (function (s, t, a, y, twenty, two) {
          s.Stay22 = s.Stay22 || {};
          s.Stay22.params = {
            lmaID: '6aaaa45683570fc6d6a7b7a7'
          };

          twenty = t.createElement(a);
          two = t.getElementsByTagName(a)[0];

          twenty.async = 1;
          twenty.src = y;

          two.parentNode.insertBefore(twenty, two);
        })(window, document, 'script', 'https://scripts.stay22.com/letmeallez.js');
      `}
    </Script>
  );
}