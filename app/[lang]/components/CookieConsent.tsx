"use client";

import { useEffect, useState } from "react";

type ConsentStatus = "accepted" | "rejected" | null;

type Props = {
  lang: "tr" | "en";
};

export default function CookieConsent({ lang }: Props) {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isEn = lang === "en";

  useEffect(() => {
    const savedConsent = localStorage.getItem("waylero_cookie_consent");

    if (savedConsent === "accepted" || savedConsent === "rejected") {
      setConsent(savedConsent);
    }

    setMounted(true);

    const openPreferences = () => {
      setShowPreferences(true);
      setIsOpen(true);
    };

    window.addEventListener(
      "waylero-open-cookie-preferences",
      openPreferences
    );

    return () => {
      window.removeEventListener(
        "waylero-open-cookie-preferences",
        openPreferences
      );
    };
  }, []);

  const startClarity = () => {
    if (typeof window === "undefined") return;

    if (typeof (window as any).clarity === "function") {
      return;
    }

    if (
      document.querySelector(
        'script[data-waylero-clarity="true"]'
      )
    ) {
      return;
    }

    const script = document.createElement("script");

    script.async = true;
    script.src =
      "https://www.clarity.ms/tag/x3v9pxahkm?ref=bwt";

    script.setAttribute(
      "data-waylero-clarity",
      "true"
    );

    document.head.appendChild(script);
  };

  const saveConsent = (value: ConsentStatus) => {
    if (!value) return;

    localStorage.setItem(
      "waylero_cookie_consent",
      value
    );

    setConsent(value);
    setShowPreferences(false);
    setIsOpen(false);

    window.dispatchEvent(
      new CustomEvent("waylero-cookie-consent", {
        detail: value,
      })
    );

    if (value === "accepted") {
      startClarity();
    }
  };

  if (!mounted) {
    return null;
  }

  if (consent !== null && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Ana cookie bildirimi */}
      <div className="fixed bottom-3 left-3 right-3 z-[9999] sm:bottom-5 sm:left-5 sm:right-5">
        <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md sm:px-5 sm:py-4">

          {!showPreferences ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">

              {/* Açıklama */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-xl">
                  🍪
                </span>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {isEn
                      ? "Your Privacy and Cookie Preferences"
                      : "Gizlilik ve Çerez Tercihleriniz"}
                  </p>

                  <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-gray-500">
                    {isEn
                      ? "Waylero uses cookies and similar technologies to optimize platform performance, personalize your experience and analyze traffic."
                      : "Waylero, platform performansını optimize etmek, ziyaretçi deneyimini kişiselleştirmek ve trafik analizlerini gerçekleştirmek amacıyla çerezler ve benzeri teknolojiler kullanmaktadır."}
                  </p>

                  <a
                    href={
                      isEn
                        ? "/en/cerez-politikasi"
                        : "/tr/cerez-politikasi"
                    }
                    className="mt-1 inline-block text-xs font-medium text-gray-700 underline underline-offset-2 hover:text-black"
                  >
                    {isEn
                      ? "Cookie Policy and Privacy Notice"
                      : "Çerez Politikası ve Aydınlatma Metni"}
                  </a>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">

                <button
                  type="button"
                  onClick={() => saveConsent("rejected")}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  {isEn
                    ? "Reject All"
                    : "Tümünü Reddet"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  {isEn
                    ? "Manage Preferences"
                    : "Tercihleri Yönet"}
                </button>

                <button
                  type="button"
                  onClick={() => saveConsent("accepted")}
                  className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  {isEn
                    ? "Accept All"
                    : "Tümünü Kabul Et"}
                </button>

              </div>
            </div>
          ) : (
            /* Tercihler */
            <div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {isEn
                      ? "Cookie Preferences and Consent Management"
                      : "Çerez Tercihleri ve İzin Yönetimi"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {isEn
                      ? "You can customize your cookie preferences at any time in accordance with applicable data protection standards, including GDPR."
                      : "KVKK, GDPR ve uluslararası veri koruma standartları kapsamında çerez tercihlerinizi dilediğiniz zaman özelleştirebilirsiniz."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  {isEn
                    ? "Close / Back"
                    : "Kapat / Geri"}
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">

                {/* Gerekli */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold text-gray-900">
                    {isEn
                      ? "Essential Cookies"
                      : "Gerekli (Zorunlu) Çerezler"}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    {isEn
                      ? "Required for website security, session management and basic functionality."
                      : "Sitenin güvenliği, oturum yönetimi ve temel işlevselliğinin sağlanması için zorunludur."}
                  </p>

                  <span className="mt-2 inline-block text-[10px] font-semibold text-gray-500">
                    {isEn
                      ? "Always Active"
                      : "Her Zaman Aktif"}
                  </span>
                </div>

                {/* Analitik */}
                <div className="rounded-xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold text-gray-900">
                    {isEn
                      ? "Performance and Analytics"
                      : "Performans ve Analitik"}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    {isEn
                      ? "Allows us to measure visitor traffic and usage patterns anonymously (GA4 / Clarity)."
                      : "Ziyaretçi trafiğini ve kullanım kalıplarını anonim olarak ölçümlememize imkan tanır (GA4 / Clarity)."}
                  </p>

                  <span className="mt-2 inline-block text-[10px] font-semibold text-gray-600">
                    {isEn
                      ? "Requires Consent"
                      : "Açık Rıza Gerektirir"}
                  </span>
                </div>

                {/* Reklam */}
                <div className="rounded-xl border border-gray-200 p-3">
                  <p className="text-xs font-semibold text-gray-900">
                    {isEn
                      ? "Marketing and Advertising"
                      : "Pazarlama ve Reklam"}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    {isEn
                      ? "Used to provide content and advertisements that may be relevant to your interests (Google AdSense integration)."
                      : "İlgi alanlarınıza uygun içerik ve reklamların sunulmasını sağlar (Google AdSense entegrasyonu)."}
                  </p>

                  <span className="mt-2 inline-block text-[10px] font-semibold text-gray-400">
                    {isEn
                      ? "Optional"
                      : "Opsiyonel"}
                  </span>
                </div>

              </div>

              <div className="mt-4 flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => saveConsent("rejected")}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  {isEn
                    ? "Essential Cookies Only"
                    : "Sadece Zorunlu Çerezler"}
                </button>

                <button
                  type="button"
                  onClick={() => saveConsent("accepted")}
                  className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  {isEn
                    ? "Save and Confirm My Choices"
                    : "Seçimlerimi Kaydet ve Onayla"}
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}