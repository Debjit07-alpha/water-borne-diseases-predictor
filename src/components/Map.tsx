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

  // Enhanced color scheme based on risk levels
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return {
          borderColor: "#7f1d1d", // Dark red border
          fillColor: "#dc2626", // Bright red fill
          glowClass: "high-risk-glow"
        };
      case "Moderate":
        return {
          borderColor: "#a16207", // Dark orange border
          fillColor: "#f59e0b", // Orange fill
          glowClass: "moderate-risk-glow"
        };
      case "Low":
        return {
          borderColor: "#166534", // Dark green border
          fillColor: "#16a34a", // Green fill
          glowClass: "low-risk-glow"
        };
      default:
        return {
          borderColor: "#dc2626",
          fillColor: "#ef4444",
          glowClass: "high-risk-glow"
        };
    }
  };

  const getRiskRadius = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return 8;
      case "Moderate": return 7;
      case "Low": return 6;
      default: return 7;
    }
  };

  function HighRiskZoneMarkers() {
    if (!zones?.length) return null;
    
    return (
      <>
        {zones.map((zone) => {
          const riskColors = getRiskColor(zone.riskAnalysis.overallRisk);
          const radius = getRiskRadius(zone.riskAnalysis.overallRisk);
          
          return (
            <CircleMarker
              key={zone.name}
              center={[zone.lat, zone.lng]}
              radius={radius}
              pathOptions={{ 
                color: riskColors.borderColor, 
                fillColor: riskColors.fillColor, 
                fillOpacity: 0.8, 
                weight: 3,
                className: `risk-zone ${riskColors.glowClass}` 
              }}
              eventHandlers={{
                click: () => {
                  onZoneClick(zone);
                }
              }}
            >
              <Tooltip direction="bottom" offset={[0, 15]} opacity={1} className="custom-tooltip">
                <div className="p-2 bg-white rounded-md shadow-lg border max-w-xs z-[9999]">
                  <h4 className="font-bold text-gray-800 mb-1 text-xs">{zone.name}</h4>
                  
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center">
                      <strong className="text-xs text-gray-700">Risk:</strong> 
                      <span className={`ml-1 px-1 py-0.5 rounded text-white text-xs font-bold ${
                        zone.riskAnalysis.overallRisk === 'High' ? 'bg-red-600' :
                        zone.riskAnalysis.overallRisk === 'Moderate' ? 'bg-orange-500' : 'bg-green-600'
                      }`}>
                        {zone.riskAnalysis.overallRisk}
                      </span>
                    </div>
                    
                    <div className="text-xs">
                      <strong className="text-gray-700">Diseases:</strong> 
                      <span className="text-gray-600 ml-1">{zone.commonDiseases.slice(0, 2).join(", ")}</span>
                    </div>
                    
                    <div className="text-xs">
                      <strong className="text-gray-700">Source:</strong> 
                      <span className="text-gray-600 ml-1">{zone.primaryWaterSource}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-blue-600 font-medium">
                    Click for details
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </>
    );
  }

  function Legend() {
    return (
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2 rounded-md shadow-lg border border-gray-200 max-w-48">
        <div className="mb-2">
          <h4 className="font-bold text-gray-800 text-xs mb-0.5">Risk Zones</h4>
          <p className="text-xs text-gray-600">North-East India</p>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 border border-red-800 mr-1.5 shadow-sm"></div>
            <span className="text-gray-700"><strong>High</strong> - Urgent</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-orange-700 mr-1.5 shadow-sm"></div>
            <span className="text-gray-700"><strong>Moderate</strong> - Monitor</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 border border-green-800 mr-1.5 shadow-sm"></div>
            <span className="text-gray-700"><strong>Low</strong> - Standard</span>
          </div>
        </div>
        
        <div className="mt-2 pt-1 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <strong>Source:</strong> Health Surveillance
          </p>
          <p className="text-xs text-gray-500">
            <strong>Updated:</strong> Sep 2025
          </p>
        </div>
      </div>
    );
  }

  if (!leafletLoaded || !LeafletComponents) {
    return <div className="h-full w-full flex items-center justify-center text-[#2C3E50]">Loading map…</div>;
  }

  const { MapContainer, TileLayer, Marker, LocationMarker, useMap, CircleMarker, Tooltip } = LeafletComponents;

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
        
        /* Enhanced risk zone styling with better contrast and glow effects */
        .risk-zone {
          transition: all 0.2s ease-out;
          cursor: pointer;
          outline: none !important;
        }
        
        /* Remove black outline/focus box on click */
        .leaflet-interactive:focus {
          outline: none !important;
        }
        
        .leaflet-clickable:focus {
          outline: none !important;
        }
        
        /* Remove any black box or border on active state */
        .leaflet-interactive:active,
        .leaflet-clickable:active,
        .risk-zone:active,
        .risk-zone:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        /* High Risk Zones - Flickering Red Glow */
        .high-risk-glow {
          filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.6)) 
                  drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))
                  drop-shadow(0 0 12px rgba(248, 113, 113, 0.3));
          animation: redFlicker 2s ease-in-out infinite;
        }
        
        @keyframes redFlicker {
          0% { 
            filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.6)) 
                    drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))
                    drop-shadow(0 0 12px rgba(248, 113, 113, 0.3));
            opacity: 1;
          }
          25% { 
            filter: drop-shadow(0 0 6px rgba(220, 38, 38, 0.8)) 
                    drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))
                    drop-shadow(0 0 16px rgba(248, 113, 113, 0.4));
            opacity: 0.9;
          }
          50% { 
            filter: drop-shadow(0 0 3px rgba(220, 38, 38, 0.5)) 
                    drop-shadow(0 0 6px rgba(239, 68, 68, 0.3))
                    drop-shadow(0 0 10px rgba(248, 113, 113, 0.2));
            opacity: 0.7;
          }
          75% { 
            filter: drop-shadow(0 0 5px rgba(220, 38, 38, 0.7)) 
                    drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))
                    drop-shadow(0 0 14px rgba(248, 113, 113, 0.3));
            opacity: 0.95;
          }
          100% { 
            filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.6)) 
                    drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))
                    drop-shadow(0 0 12px rgba(248, 113, 113, 0.3));
            opacity: 1;
          }
        }
        
        /* Moderate Risk Zones - Reduced Orange Glow */
        .moderate-risk-glow {
          filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.6)) 
                  drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))
                  drop-shadow(0 0 9px rgba(254, 215, 170, 0.2));
        }
        
        /* Low Risk Zones - Reduced Green Glow */
        .low-risk-glow {
          filter: drop-shadow(0 0 2px rgba(22, 163, 74, 0.5)) 
                  drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))
                  drop-shadow(0 0 6px rgba(134, 239, 172, 0.2));
        }
        
        /* Custom tooltip styling */
        .custom-tooltip .leaflet-tooltip {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          color: #374151 !important;
          font-size: 12px !important;
          padding: 0 !important;
          z-index: 10000 !important;
          position: relative !important;
          max-width: 280px !important;
          white-space: normal !important;
        }
        
        .custom-tooltip .leaflet-tooltip:before {
          border-bottom-color: #e5e7eb !important;
          border-top-color: transparent !important;
        }
        
        .custom-tooltip .leaflet-tooltip:after {
          border-bottom-color: white !important;
          border-top-color: transparent !important;
        }
      `}</style>

      <MapContainer
        center={position || [25.5, 93.0]}
        zoom={position ? 10 : 7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          /* Use a darker, muted basemap for better contrast with risk zones */
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Add water bodies layer for context */}
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}.png"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
          opacity={0.3}
        />
        
        {position && <Marker position={position} />}
        <LocationMarker onPositionChange={onPositionChange} />
        <HighRiskZoneMarkers />
      </MapContainer>
      
      <Legend />
    </div>
  );
}