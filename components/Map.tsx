"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

export default function Map({ places }: { places: any[] }) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const center = places.length > 0 ? [places[0].lat, places[0].lng] : [41.0082, 28.9784];

  return (
    <MapContainer 
      center={center as [number, number]} 
      zoom={12} 
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {places.map((place) => (
        <Marker key={place.slug} position={[place.lat, place.lng]}>
          <Tooltip 
            permanent 
            direction="top" 
            offset={[0, -30]} 
            className="custom-marker-tooltip"
          >
            {place.name_tr}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}