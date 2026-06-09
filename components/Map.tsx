"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents, // 👈 Kullanıcı hareketlerini yakalamak için eklendi
} from "react-leaflet";

import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import { divIcon } from "leaflet";

const CLOUDINARY_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_120,h_120,q_auto,f_auto/`;


function FitBounds({ places }: { places: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (!places || places.length === 0) return;

    const bounds = L.latLngBounds(
      places.map((p) => [p.lat, p.lng])
    );

    map.fitBounds(bounds, {
      padding: [80, 80],
      maxZoom: 14,
    });
  }, [places, map]);

  return null;
}

function getDistanceInMetres(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// 🧠 EN YAKIN KOMŞU ALGORİTMASI: Başlangıç noktasına göre rotayı optimize eder
function sortPlacesByNearestNeighbor(startLocation: [number, number], placesToSort: any[]) {
  if (!startLocation || !placesToSort || placesToSort.length === 0) return placesToSort;

  let remainingPlaces = [...placesToSort];
  let sortedPlaces = [];
  let currentLocation = startLocation;

  while (remainingPlaces.length > 0) {
    let closestIndex = 0;
    let minDistance = Infinity;

    // Kalan mekanlar arasında şu anki konuma en yakın olanı bul
    for (let i = 0; i < remainingPlaces.length; i++) {
      const distance = getDistanceInMetres(
        currentLocation[0], currentLocation[1],
        remainingPlaces[i].lat, remainingPlaces[i].lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    // En yakını listeye ekle, onu yeni "şu anki konum" yap ve kalanlardan çıkar
    const closestPlace = remainingPlaces[closestIndex];
    sortedPlaces.push(closestPlace);
    currentLocation = [closestPlace.lat, closestPlace.lng];
    remainingPlaces.splice(closestIndex, 1);
  }

  return sortedPlaces;
}

function LiveLocation({ setUserLocation }: { setUserLocation: (loc: [number, number]) => void }) {
  const map = useMap();
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.log("Konum hatası:", err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, setUserLocation]);
  return null;
}

// 🎯 YENİLENEN KONTROLLER: Kullanıcı haritaya dokunduysa takibi engeller
function MapController({ center, isMapInteracted }: { center: [number, number]; isMapInteracted: boolean }) {
  const map = useMap();
  useEffect(() => {
    // Eğer kullanıcı haritayı kaydırdıysa/zoomladıysa flyTo işlemine izin verme!
    if (center && !isMapInteracted) {
      map.flyTo(center, map.getZoom(), { duration: 1.5 });
    }
  }, [center, map, isMapInteracted]);
  return null;
}

// 🛑 HARİTA HAREKETLERİNİ DİNLEYEN YENİ BİLEŞEN
function MapEventsHandler({ setIsMapInteracted }: { setIsMapInteracted: (val: boolean) => void }) {
  useMapEvents({
    dragstart: () => {
      setIsMapInteracted(true); // Kullanıcı haritayı sürüklemeye başladı, takibi dondur
    },
    zoomstart: () => {
      setIsMapInteracted(true); // Kullanıcı zoom yapmaya başladı, takibi dondur
    },
  });
  return null;
}

export default function Map({ 
  places, 
  onFullscreen,
  showControls = false 
}: { 
  places: any[]; 
  onFullscreen?: () => void; 
  showControls?: boolean;
}) {
  const [orderedPlaces, setOrderedPlaces] = useState<any[]>(places);
  
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isTripStarted, setIsTripStarted] = useState<boolean>(false);
  const [travelMode, setTravelMode] = useState<"driving" | "walking" | "cycling">("driving");

  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  // 🌟 KRİTİK EKLEME: Kullanıcının haritayı manuel kontrol edip etmediğini tutan kilit state
  const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);

  const lastFetchedLocationRef = useRef<[number, number] | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  
  const requestTimestampsRef = useRef<number[]>([]);
  const routeCacheRef = useRef<{ [key: string]: { coords: [number, number][]; distance: number; duration: number } }>({});

  
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (!isTripStarted) {
      setOrderedPlaces(places);
    }
  }, [places, isTripStarted]);

  const mapCenter: [number, number] = isTripStarted && userLocation
    ? userLocation
    : orderedPlaces.length > 0
    ? [orderedPlaces[0].lat, orderedPlaces[0].lng]
    : [41.0082, 28.9784];

  useEffect(() => {
    const fetchRoute = async () => {
      if (!showControls) return;

      if (!isTripStarted) {
        setRouteCoords([]);
        setDistance(0);
        setDuration(0);
        return;
      }

      if (isTripStarted && !userLocation) return;

      const now = Date.now();

      let minTime = 10000;
      let minDistance = 30;

      if (travelMode === "driving") {
        if (distance > 0 && distance <= 10) {
          minTime = 30000;
          minDistance = 2000;
        } else {
          minTime = 120000;
          minDistance = 5000;
        }
      }

      if (lastFetchTimeRef.current !== 0) {
        if (now - lastFetchTimeRef.current < minTime) return; 

        if (userLocation && lastFetchedLocationRef.current) {
          const distanceMoved = getDistanceInMetres(
            userLocation[0], userLocation[1],
            lastFetchedLocationRef.current[0], lastFetchedLocationRef.current[1]
          );
          if (distanceMoved < minDistance) return;
        }
      }

      const approxLat = userLocation ? userLocation[0].toFixed(3) : "0";
      const approxLng = userLocation ? userLocation[1].toFixed(3) : "0";
      const cacheKey = `${travelMode}_${approxLat}_${approxLng}_${orderedPlaces.length}`;

      if (routeCacheRef.current[cacheKey]) {
        const cachedRoute = routeCacheRef.current[cacheKey];
        setRouteCoords(cachedRoute.coords);
        setDistance(cachedRoute.distance);
        setDuration(cachedRoute.duration);
        lastFetchTimeRef.current = Date.now();
        return;
      }

      const oneMinuteAgo = now - 60000;
      requestTimestampsRef.current = requestTimestampsRef.current.filter(ts => ts > oneMinuteAgo);

      if (requestTimestampsRef.current.length >= 5) {
        setIsRateLimited(true);
        return;
      }

      try {
        let coordinates: [number, number][] = orderedPlaces.map((p) => [p.lng, p.lat]);
        if (userLocation) {
          coordinates = [[userLocation[1], userLocation[0]], ...coordinates];
        }

        requestTimestampsRef.current.push(now);

        const response = await fetch("/api/route", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            coordinates,
            travelMode
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            setIsRateLimited(true);
          }
          console.error("Rota alınamadı, durum kodu:", response.status);
          return;
        }

        if (data.features?.length > 0) {
          const route = data.features[0];
          const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

          const resDistance = route.properties.summary.distance / 1000;
          const resDuration = route.properties.summary.duration / 60;

          setRouteCoords(coords);
          setDistance(resDistance);
          setDuration(resDuration);

          routeCacheRef.current[cacheKey] = {
            coords,
            distance: resDistance,
            duration: resDuration
          };

          lastFetchTimeRef.current = Date.now();
          lastFetchedLocationRef.current = userLocation;
          setIsRateLimited(false);
        }
      } catch (err) {
        console.error("ROTA HATASI:", err);
      }
    };

    fetchRoute();
  }, [orderedPlaces, travelMode, userLocation, isTripStarted, showControls, distance]);

  useEffect(() => {
    if (isRateLimited) {
      const timer = setTimeout(() => setIsRateLimited(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [isRateLimited]);

  const routeColor = travelMode === "walking" ? "green" : travelMode === "cycling" ? "orange" : "#1e445e";

  const handleModeChange = (mode: "driving" | "walking" | "cycling") => {
    lastFetchTimeRef.current = 0;
    setTravelMode(mode);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      
      {/* 🚗 KONTROL PANELİ */}
      {showControls && orderedPlaces && orderedPlaces.length > 0 && (
        <div className="absolute top-4 left-4 z-[9999] flex flex-col gap-2 max-w-[280px]">
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange("driving")}
              disabled={isRateLimited}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-xl transition-all ${
                travelMode === "driving" ? "bg-[#1e445e] text-white" : "bg-white"
              } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              🚗
            </button>
            <button
              onClick={() => handleModeChange("walking")}
              disabled={isRateLimited}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-xl transition-all ${
                travelMode === "walking" ? "bg-green-600 text-white" : "bg-white"
              } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              🚶
            </button>
            <button
              onClick={() => handleModeChange("cycling")}
              disabled={isRateLimited}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-xl transition-all ${
                travelMode === "cycling" ? "bg-orange-500 text-white" : "bg-white"
              } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              🚴
            </button>
          </div>

          <button
            onClick={() => {
              lastFetchTimeRef.current = 0;

              if (!isTripStarted) {
                if (userLocation) {
                  const sorted = sortPlacesByNearestNeighbor(userLocation, places);
                  setOrderedPlaces(sorted);
                }
              } else {
                lastFetchedLocationRef.current = null;
                setOrderedPlaces(places);
              }

              const nextState = !isTripStarted;
              setIsTripStarted(nextState);
              setIsMapInteracted(false); // Yeni gezi durumunda takibi sıfırla

              if (
                nextState &&
                typeof window !== "undefined" &&
                window.innerWidth < 768
              ) {
                onFullscreen?.();
              }
            }}
            disabled={(isTripStarted ? false : !userLocation) || isRateLimited}
            className={`px-4 py-3 rounded-xl text-xs font-black shadow-xl uppercase tracking-wider transition-all ${
              isTripStarted
                ? "bg-red-600 text-white hover:bg-red-700"
                : userLocation
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } ${isRateLimited ? "bg-amber-500 text-white cursor-not-allowed animate-pulse" : ""}`}
          >
            {isRateLimited 
              ? "⚠️ Çok Fazla İstek Atıldı" 
              : isTripStarted 
              ? "🛑 Geziyi Bitir" 
              : userLocation 
              ? "🚀 Geziyi Başlat" 
              : "⏳ Konum Bekleniyor..."}
          </button>

          <div className="bg-white/90 backdrop-blur-sm p-2.5 rounded-xl shadow-lg text-[10px] font-bold text-gray-600 border border-gray-100">
            {isRateLimited ? (
              <span className="text-red-500 animate-pulse">⚠️ Sistem güvenliği için çok hızlı tıkladınız. Lütfen 15 saniye bekleyin.</span>
            ) : (
              <span>ℹ️ <b>Geziyi Başlat</b> dediğinizde, anlık konumunuzdan seçili mekanlara giden en kısa rota otomatik olarak oluşturulur.</span>
            )}
          </div>
        </div>
      )}

      {/* 🎯 "BENİ BUL / ODAKLAN" BUTONU - Kullanıcı haritayı oynatınca sol altta belirir */}
      {isTripStarted && isMapInteracted && userLocation && (
        <button
          onClick={() => setIsMapInteracted(false)} // Basınca kilidi kaldırır ve haritayı yeniden anlık konuma uçurur
          type="button"
          className="absolute bottom-16 left-4 z-[10000] bg-white text-gray-950 p-3.5 rounded-2xl shadow-2xl border border-gray-100 hover:scale-105 active:scale-95 transition-all text-sm font-black flex items-center gap-1.5"
        >
          🎯 KONUMUMA DÖN
        </button>
      )}

     {/* 📏 ROTA BİLGİSİ */}
{showControls && orderedPlaces && orderedPlaces.length > 0 && routeCoords.length > 0 && (
  <div className="absolute top-4 right-4 z-[9999] bg-white px-5 py-4 rounded-2xl shadow-2xl">
    <div className="text-xs font-black text-gray-400 uppercase">
      {isTripStarted ? "Navigasyon Bilgisi" : "Rota Bilgisi"}
    </div>
    <div className="mt-2 text-sm font-bold">📏 {distance.toFixed(1)} KM</div>
    
    {/* ⏱ Burası güncellendi: Dakikayı Saat ve Dakikaya çeviriyoruz */}
    <div className="text-sm font-bold">
      ⏱ {(() => {
        const totalMinutes = Math.round(duration);
        if (totalMinutes < 60) {
          return `${totalMinutes} DK`;
        }
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes > 0 ? `${hours} SAAT ${minutes} DK` : `${hours} SAAT`;
      })()}
    </div>
  </div>
)}

      {/* ⛶ TAM EKRAN BUTONU */}
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          type="button"
          className="absolute bottom-4 right-4 z-[10000] bg-white text-gray-900 px-4 py-2.5 rounded-xl shadow-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1 border border-gray-200"
        >
          <span>⛶</span> TAM EKRAN
        </button>
      )}

      {/* 🗺 HARİTA */}
      <MapContainer center={mapCenter} zoom={12} className="w-full h-full z-0">
        {/* 🌟 Güncellenmiş MapController ve Yeni Eklenen Olay Yakalayıcı */}
        <MapController center={mapCenter} isMapInteracted={isMapInteracted} />
        <MapEventsHandler setIsMapInteracted={setIsMapInteracted} />
        
        <LiveLocation setUserLocation={setUserLocation} />
        <FitBounds places={orderedPlaces} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: routeColor,
              weight: 6,
              opacity: 0.9,
            }}
          />
        )}

        {userLocation && (
          <>
            <CircleMarker
              center={userLocation}
              radius={20}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15 }}
            />
            <CircleMarker
              center={userLocation}
              radius={8}
              pathOptions={{ color: "#fff", fillColor: "#2563eb", fillOpacity: 1, weight: 3 }}
            />
          </>
        )}

        {orderedPlaces.map((place, index) => {
          const icon = divIcon({
            className: "custom-div-icon",
            html: place.image
              ? `<div style="
                  width:40px;
                  height:40px;
                  border-radius:12px;
                  overflow:hidden;
                  border:2px solid white;
                  box-shadow:0 4px 10px rgba(0,0,0,0.2);
                ">
                  <img src="${CLOUDINARY_BASE}${place.image}" 
                       style="width:100%;height:100%;object-fit:cover;" />
                </div>`
              : `<div style="
                  width:40px;
                  height:40px;
                  border-radius:12px;
                  background:#1e445e;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  color:white;
                  font-weight:900;
                ">📍</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          return (
            <Marker key={place.slug} position={[place.lat, place.lng]} icon={icon}>
              <Tooltip permanent direction="top" offset={[0, -30]}>
                <div className="font-bold">
                  {index + 1}. {place.name_tr}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}