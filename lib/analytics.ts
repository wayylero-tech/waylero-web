// lib/analytics.ts

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

export const trackSearch = (search: string) => {
  trackEvent("search", { search_term: search });
};

export const trackPlaceClick = (place: string, city: string) => {
  trackEvent("place_click", { place, city });
};