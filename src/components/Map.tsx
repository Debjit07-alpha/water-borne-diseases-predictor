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
    return <div className="h-full w-full flex items-center justify-center text-[#2C3E50]">Loading map…</div>;
  }

  const customMapStyles = `
    <style>
      /* Force map labels and UI text to solid black for maximum readability */
      .leaflet-container { color: #2C3E50 !important; }
      .leaflet-control-container, .leaflet-control, .leaflet-bar a, .leaflet-popup-content, .leaflet-tooltip {
        color: #2C3E50 !important;
      }
      .leaflet-bar a {
        background: white !important;
        border-color: #e2e8f0 !important;
      }
      .leaflet-bar a:hover {
        background: #f8fafc !important;
      }
    </style>
  `;

  const { MapContainer, TileLayer, Marker, LocationMarker, useMap, CircleMarker, Tooltip } = LeafletComponents;

  function HighRiskZoneMarkers() {
    if (!zones?.length) return null;
    
    return (
      <>
        {zones.map((zone) => (
          <CircleMarker
            key={zone.name}
            center={[zone.lat, zone.lng]}
            radius={8}
            pathOptions={{ 
              color: "#dc2626", 
              fillColor: "#ef4444", 
              fillOpacity: 0.9, 
              weight: 2,
              className: "glowing-dot" 
            }}
            eventHandlers={{
              click: () => {
                onZoneClick(zone);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div className="text-sm font-medium">
                {zone.name}
                <br />
                <span className="text-red-600 font-bold">
                  {zone.riskAnalysis.overallRisk} Risk
                </span>
              </div>
            </Tooltip>
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
    <div style={{ 
      height: "100%", 
      width: "100%", 
      position: "relative",
      zIndex: 1
    }}>
      <style>{`
        /* Force map labels and UI text to solid black for maximum readability */
        .leaflet-container { color: #000000 !important; }
        .leaflet-control-container, .leaflet-control, .leaflet-bar a, .leaflet-popup-content, .leaflet-tooltip {
          color: #000000 !important;
        }
        /* Glowing effect with patches for high-risk zone markers */
        .glowing-dot {
          filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.9)) 
                  drop-shadow(0 0 12px rgba(255, 69, 0, 0.7))
                  drop-shadow(0 0 18px rgba(255, 140, 0, 0.5))
                  drop-shadow(0 0 24px rgba(255, 165, 0, 0.3));
          animation: glowPatches 3s ease-in-out infinite alternate;
        }
        @keyframes glowPatches {
          0% { 
            filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.9)) 
                    drop-shadow(0 0 12px rgba(255, 69, 0, 0.7))
                    drop-shadow(0 0 18px rgba(255, 140, 0, 0.5))
                    drop-shadow(0 0 24px rgba(255, 165, 0, 0.3));
          }
          25% { 
            filter: drop-shadow(0 0 8px rgba(255, 69, 0, 0.8)) 
                    drop-shadow(0 0 14px rgba(255, 140, 0, 0.6))
                    drop-shadow(0 0 20px rgba(255, 165, 0, 0.4))
                    drop-shadow(0 0 26px rgba(255, 215, 0, 0.2));
          }
          50% { 
            filter: drop-shadow(0 0 10px rgba(255, 140, 0, 0.9)) 
                    drop-shadow(0 0 16px rgba(255, 165, 0, 0.7))
                    drop-shadow(0 0 22px rgba(255, 215, 0, 0.5))
                    drop-shadow(0 0 28px rgba(255, 255, 0, 0.3));
          }
          75% { 
            filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.8)) 
                    drop-shadow(0 0 14px rgba(255, 215, 0, 0.6))
                    drop-shadow(0 0 20px rgba(255, 255, 0, 0.4))
                    drop-shadow(0 0 26px rgba(255, 140, 0, 0.2));
          }
          100% { 
            filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.9)) 
                    drop-shadow(0 0 12px rgba(255, 255, 0, 0.7))
                    drop-shadow(0 0 18px rgba(255, 140, 0, 0.5))
                    drop-shadow(0 0 24px rgba(255, 69, 0, 0.3));
          }
        }
        /* Some tile providers render labels as images; prefer a light natural basemap */
      `}</style>

      <MapContainer
        center={position || [25.5, 93.0]}
        zoom={position ? 10 : 7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          /* Use a bright, natural-color basemap (Carto Voyager) with clear water/land rendering */
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
      {position && <Marker position={position} />}
      <LocationMarker onPositionChange={onPositionChange} />
      <HighRiskZoneMarkers />
        <Legend />
      </MapContainer>
    </div>
  );
}
