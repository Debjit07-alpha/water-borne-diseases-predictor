"use client";

import { useEffect, useState } from "react";
import { HighRiskZone, highRiskZones } from "@/lib/high-risk-zones";

interface MapProps {
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
  onZoneClick: (zone: HighRiskZone) => void;
  zones: HighRiskZone[];
}

export default function Map({ position, onPositionChange, onZoneClick, zones }: MapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ MapContainer, TileLayer, Marker, useMapEvents, useMap, CircleMarker, Tooltip }] = await Promise.all([
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

      setLeafletComponents({ MapContainer, TileLayer, Marker, LocationMarker, useMap, CircleMarker, Tooltip });
      setLeafletLoaded(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!leafletLoaded || !LeafletComponents) {
    return <div className="h-full w-full flex items-center justify-center">Loading map…</div>;
  }

  const { MapContainer, TileLayer, Marker, LocationMarker, useMap, CircleMarker, Tooltip } = LeafletComponents;

  function HighRiskZoneMarkers() {
    return (
      <>
        {zones.map((zone) => (
          <CircleMarker
            key={zone.name}
            center={[zone.lat, zone.lng]}
            radius={5}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.8, className: "glowing-dot" }}
            eventHandlers={{
              click: () => {
                onZoneClick(zone);
              },
            }}
          >
            <Tooltip>{zone.name}</Tooltip>
          </CircleMarker>
        ))}
      </>
    );
  }

  function Legend() {
    return (
      <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 1000, background: "rgba(255,255,255,0.8)", padding: "10px", borderRadius: "5px" }}>
        <h4>Legend</h4>
        <div>
          <span style={{ backgroundColor: "red", height: "10px", width: "10px", display: "inline-block", marginRight: "5px", borderRadius: "50%" }}></span>
          High-Risk Zones for Water-Borne Diseases
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={position || [25.5, 93.0]}
      zoom={position ? 10 : 7}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {position && <Marker position={position} />}
      <LocationMarker onPositionChange={onPositionChange} />
      <HighRiskZoneMarkers />
      <Legend />
    </MapContainer>
  );
}
