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
      const [{ MapContainer, TileLayer, Marker, useMapEvents, useMap }] = await Promise.all([
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

      setLeafletComponents({ MapContainer, TileLayer, Marker, LocationMarker, useMap });
      setLeafletLoaded(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!leafletLoaded || !LeafletComponents) {
    return <div className="h-full w-full flex items-center justify-center">Loading map…</div>;
  }

  const { MapContainer, TileLayer, Marker, LocationMarker, useMap } = LeafletComponents;

  // Small control UI to fly to predefined locations
  function FlyToControls() {
    // call the dynamically-imported hook stored on LeafletComponents
    const map = useMap();

    const places: { name: string; coords: [number, number]; zoom: number }[] = [
      { name: "Spiti Valley (Himachal)", coords: [32.3, 78.2], zoom: 10 },
      { name: "Tirthan Valley (Himachal)", coords: [31.8, 77.3], zoom: 11 },
      { name: "Chitkul (Himachal)", coords: [31.23, 78.46], zoom: 13 },
      { name: "Orchha (Madhya Pradesh)", coords: [25.29, 79.07], zoom: 12 },
    ];

    return (
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <div style={{ background: "rgba(255,255,255,0.95)", padding: 8, borderRadius: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
          {places.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                map.flyTo(p.coords as any, p.zoom);
                onPositionChange(p.coords[0], p.coords[1]);
              }}
              style={{ display: "block", margin: "6px 0", padding: "6px 8px", cursor: "pointer" }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={position || [31.0, 77.5]}
      zoom={position ? 10 : 6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && <Marker position={position} />}
      <LocationMarker onPositionChange={onPositionChange} />
      <FlyToControls />
    </MapContainer>
  );
}
