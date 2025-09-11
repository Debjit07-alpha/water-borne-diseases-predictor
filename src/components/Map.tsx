"use client";

import { useEffect, useState } from "react";

interface MapProps {
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function Map({ position, onPositionChange }: MapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ MapContainer, TileLayer, Marker, useMapEvents }] = await Promise.all([
        import("react-leaflet"),
        // @ts-ignore - importing CSS dynamically; types for CSS files are not available
        import("leaflet/dist/leaflet.css"),
      ]);

      if (!mounted) return;

      // Create a small wrapper for LocationMarker that uses the imported useMapEvents
      function LocationMarker({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const map = useMapEvents({
          click(e: any) {
            onPositionChange(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
          },
          locationfound(e: any) {
            onPositionChange(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
          },
        });

        return null;
      }

      setLeafletComponents({ MapContainer, TileLayer, Marker, LocationMarker });
      setLeafletLoaded(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!leafletLoaded || !LeafletComponents) {
    return <div className="h-full w-full flex items-center justify-center">Loading map…</div>;
  }

  const { MapContainer, TileLayer, Marker, LocationMarker } = LeafletComponents;

  return (
    <MapContainer
      center={position || [20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && <Marker position={position} />}
      <LocationMarker onPositionChange={onPositionChange} />
    </MapContainer>
  );
}
