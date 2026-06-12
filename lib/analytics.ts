declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Genel event gönderici
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

// Genel arama
export const trackSearch = (search: string) => {
  trackEvent("search", {
    search_term: search,
  });
};

// Place click
export const trackPlaceClick = (place: string, city: string) => {
  trackEvent("place_click", {
    place,
    city,
  });
};

// Planner açıldı
export const trackPlannerStarted = (city: string, lang: string) => {
  trackEvent("planner_started", {
    city,
    lang,
  });
};

// Şehir seçildi
export const trackCitySelected = (city: string, lang: string) => {
  trackEvent("city_selected", {
    city,
    lang,
  });
};

// Yer seçildi
export const trackPlaceSelected = (city: string, place: string) => {
  trackEvent("place_selected", {
    city,
    place,
  });
};

// Yer kaldırıldı
export const trackPlaceUnselected = (city: string, place: string) => {
  trackEvent("place_unselected", {
    city,
    place,
  });
};

// Rota oluşturuldu
export const trackRouteGenerated = (
  city: string,
  placeCount: number,
  travelMode: string,
  lang: string
) => {
  trackEvent("route_generated", {
    city,
    place_count: placeCount,
    travel_mode: travelMode,
    lang,
  });
};

// Google login
export const trackGoogleLogin = () => {
  trackEvent("google_login", {
    method: "google",
  });
};

// Gezi kaydedildi
export const trackTripSaved = (
  city: string,
  placeCount: number,
  tripId: string
) => {
  trackEvent("trip_saved", {
    city,
    place_count: placeCount,
    trip_id: tripId,
  });
};

// Kaydetme başarısız
export const trackTripSaveFailed = (city: string) => {
  trackEvent("trip_save_failed", {
    city,
  });
};

// Gezi paylaşıldı
export const trackTripShared = (city: string, tripId?: string) => {
  trackEvent("trip_shared", {
    city,
    trip_id: tripId,
  });
};

// Link kopyalandı
export const trackTripLinkCopied = (city: string, tripId?: string) => {
  trackEvent("trip_link_copied", {
    city,
    trip_id: tripId,
  });
};

export const trackPlaceViewed = (
  place: string,
  city: string,
  region: string,
  lang: string
) => {
  trackEvent("place_viewed", {
    place,
    city,
    region,
    lang,
  });
};