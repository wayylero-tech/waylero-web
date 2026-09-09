"use client";

export default function CookiePreferencesButton({
  label,
}: {
  label: string;
}) {
  const openPreferences = () => {
    window.dispatchEvent(
      new CustomEvent("waylero-open-cookie-preferences")
    );
  };

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-left transition hover:text-white"
    >
      {label}
    </button>
  );
}