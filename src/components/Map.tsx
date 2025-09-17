"use client";

import { useEffect, useState } from "react";
import { HighRiskZone, highRiskZones } from "@/lib/high-risk-zones";

interface MapProps {
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
  onZoneClick?: (zone: HighRiskZone) => void;
  zones?: HighRiskZone[];
}

export default function Map({ position, onPositionChange, onZoneClick, zones }: MapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ MapContainer, TileLayer, Marker, useMapEvents, useMap, CircleMarker, Tooltip }, L] = await Promise.all([
        import("react-leaflet"),
        import("leaflet"),
        // @ts-ignore - importing CSS dynamically; types for CSS files are not available
        import("leaflet/dist/leaflet.css"),
      ]);

      if (!mounted) return;

      // Fix Leaflet default marker icon issue
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      });

      // Create custom pin emoji icon
      const createPinIcon = () => {
        return L.divIcon({
          html: '<div style="font-size: 24px; text-align: center; line-height: 1;">📍</div>',
          className: 'custom-pin-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });
      };

      // Create a small wrapper for LocationMarker that uses the imported useMapEvents
      function LocationMarker({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const map = useMapEvents({
          click(e: any) {
            onPositionChange(e.latlng.lat, e.latlng.lng);
            map.setView(e.latlng, map.getZoom()); // Direct jump without animation
          },
          locationfound(e: any) {
            onPositionChange(e.latlng.lat, e.latlng.lng);
            map.setView(e.latlng, map.getZoom()); // Direct jump without animation
          },
        });

        return null;
      }

      // Component to center map on position changes
      function MapCenterController({ position }: { position: [number, number] | null }) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const map = useMap();
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (position) {
            map.setView(position, 13); // Direct jump to position without animation
          }
        }, [position, map]);

        return null;
      }

      setLeafletComponents({ MapContainer, TileLayer, Marker, LocationMarker, MapCenterController, useMap, CircleMarker, Tooltip, L, createPinIcon });
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
                  if (onZoneClick) {
                    onZoneClick(zone);
                  }
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
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2 rounded-md shadow-lg border border-gray-200 max-w-40">
        <div className="mb-2">
          <h4 className="font-bold text-gray-800 text-xs mb-0.5">Disease Risk Zones</h4>
          <p className="text-[10px] text-gray-600">North-East India (Terrain View)</p>
        </div>
        
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-800 mr-1.5 shadow-sm" 
                 style={{filter: 'drop-shadow(0 0 2px rgba(220, 38, 38, 0.4))'}}></div>
            <span className="text-gray-700"><strong>High Risk</strong> - Immediate Action</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 border border-orange-700 mr-1.5 shadow-sm" 
                 style={{filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.4))'}}></div>
            <span className="text-gray-700"><strong>Moderate</strong> - Monitor</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 border border-green-800 mr-1.5 shadow-sm" 
                 style={{filter: 'drop-shadow(0 0 1px rgba(22, 163, 74, 0.4))'}}></div>
            <span className="text-gray-700"><strong>Low Risk</strong> - Standard</span>
          </div>
        </div>
        
        <div className="mt-2 pt-1.5 border-t border-gray-200">
          <div className="text-[10px] text-gray-500 space-y-0">
            <p><strong>Map Features:</strong></p>
            <p>🛰️ Satellite imagery</p>
            <p>🏔️ Terrain & elevation</p>
            <p>🌊 Rivers & water bodies</p>
          </div>
        </div>
        
        <div className="mt-1.5 pt-1 border-t border-gray-200">
          <p className="text-[10px] text-gray-500">
            <strong>Source:</strong> Health Surveillance
          </p>
          <p className="text-[10px] text-gray-500">
            <strong>Updated:</strong> Sep 2025
          </p>
        </div>
      </div>
    );
  }

  if (!leafletLoaded || !LeafletComponents) {
    return <div className="h-full w-full flex items-center justify-center text-[#2C3E50]">Loading map…</div>;
  }

  const { MapContainer, TileLayer, Marker, LocationMarker, MapCenterController, useMap, CircleMarker, Tooltip, createPinIcon } = LeafletComponents;

  return (
    <div style={{ 
      height: "100%", 
      width: "100%", 
      position: "relative",
      zIndex: 1
    }}>
      <style>{`
        /* Enhanced styling for terrain map with better readability */
        .leaflet-container { 
          color: #000000 !important; 
          background-color: #f0f4f7;
        }
        
        .leaflet-control-container, .leaflet-control, .leaflet-bar a, .leaflet-popup-content, .leaflet-tooltip {
          color: #000000 !important;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        }
        
        /* Enhanced risk zone styling with better contrast against terrain */
        .risk-zone {
          transition: all 0.3s ease-out;
          cursor: pointer;
          outline: none !important;
          stroke-width: 4px !important;
        }
        
        /* Remove any unwanted focus effects */
        .leaflet-interactive:focus,
        .leaflet-clickable:focus,
        .leaflet-interactive:active,
        .leaflet-clickable:active,
        .risk-zone:active,
        .risk-zone:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        /* High Risk Zones - Enhanced for terrain visibility */
        .high-risk-glow {
          filter: drop-shadow(0 0 6px rgba(220, 38, 38, 0.8)) 
                  drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))
                  drop-shadow(0 0 18px rgba(248, 113, 113, 0.4))
                  drop-shadow(0 0 24px rgba(255, 255, 255, 0.3));
          animation: redFlicker 2s ease-in-out infinite;
        }
        
        @keyframes redFlicker {
          0% { 
            filter: drop-shadow(0 0 6px rgba(220, 38, 38, 0.8)) 
                    drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))
                    drop-shadow(0 0 18px rgba(248, 113, 113, 0.4))
                    drop-shadow(0 0 24px rgba(255, 255, 255, 0.3));
            opacity: 1;
          }
          25% { 
            filter: drop-shadow(0 0 8px rgba(220, 38, 38, 1)) 
                    drop-shadow(0 0 16px rgba(239, 68, 68, 0.8))
                    drop-shadow(0 0 24px rgba(248, 113, 113, 0.6))
                    drop-shadow(0 0 32px rgba(255, 255, 255, 0.4));
            opacity: 0.9;
          }
          50% { 
            filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.6)) 
                    drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))
                    drop-shadow(0 0 12px rgba(248, 113, 113, 0.3))
                    drop-shadow(0 0 16px rgba(255, 255, 255, 0.2));
            opacity: 0.7;
          }
          75% { 
            filter: drop-shadow(0 0 7px rgba(220, 38, 38, 0.9)) 
                    drop-shadow(0 0 14px rgba(239, 68, 68, 0.7))
                    drop-shadow(0 0 21px rgba(248, 113, 113, 0.5))
                    drop-shadow(0 0 28px rgba(255, 255, 255, 0.3));
            opacity: 0.95;
          }
          100% { 
            filter: drop-shadow(0 0 6px rgba(220, 38, 38, 0.8)) 
                    drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))
                    drop-shadow(0 0 18px rgba(248, 113, 113, 0.4))
                    drop-shadow(0 0 24px rgba(255, 255, 255, 0.3));
            opacity: 1;
          }
        }
        
        /* Moderate Risk Zones - Enhanced visibility on terrain */
        .moderate-risk-glow {
          filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.8)) 
                  drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))
                  drop-shadow(0 0 12px rgba(254, 215, 170, 0.4))
                  drop-shadow(0 0 16px rgba(255, 255, 255, 0.2));
        }
        
        /* Low Risk Zones - Enhanced visibility on terrain */
        .low-risk-glow {
          filter: drop-shadow(0 0 3px rgba(22, 163, 74, 0.7)) 
                  drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))
                  drop-shadow(0 0 9px rgba(134, 239, 172, 0.3))
                  drop-shadow(0 0 12px rgba(255, 255, 255, 0.2));
        }
        
        /* Enhanced tooltip styling for terrain background */
        .custom-tooltip .leaflet-tooltip {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 2px solid #e5e7eb !important;
          border-radius: 12px !important;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 
                      0 5px 15px rgba(0, 0, 0, 0.1) !important;
          color: #374151 !important;
          font-size: 12px !important;
          padding: 0 !important;
          z-index: 10000 !important;
          position: relative !important;
          max-width: 300px !important;
          white-space: normal !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .custom-tooltip .leaflet-tooltip:before {
          border-bottom-color: #e5e7eb !important;
          border-top-color: transparent !important;
        }
        
        .custom-tooltip .leaflet-tooltip:after {
          border-bottom-color: rgba(255, 255, 255, 0.95) !important;
          border-top-color: transparent !important;
        }
        
        /* Custom pin icon styling */
        .custom-pin-icon {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .custom-pin-icon div {
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))
                  drop-shadow(0 0 8px rgba(220, 38, 38, 0.8))
                  drop-shadow(0 0 16px rgba(239, 68, 68, 0.6))
                  drop-shadow(0 0 24px rgba(248, 113, 113, 0.4));
          transform: scale(1.2);
          animation: pinGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes pinGlow {
          0% {
            filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))
                    drop-shadow(0 0 8px rgba(220, 38, 38, 0.8))
                    drop-shadow(0 0 16px rgba(239, 68, 68, 0.6))
                    drop-shadow(0 0 24px rgba(248, 113, 113, 0.4));
            transform: scale(1.2);
          }
          50% {
            filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))
                    drop-shadow(0 0 12px rgba(220, 38, 38, 1))
                    drop-shadow(0 0 24px rgba(239, 68, 68, 0.8))
                    drop-shadow(0 0 36px rgba(248, 113, 113, 0.6));
            transform: scale(1.25);
          }
          100% {
            filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))
                    drop-shadow(0 0 6px rgba(220, 38, 38, 0.6))
                    drop-shadow(0 0 12px rgba(239, 68, 68, 0.4))
                    drop-shadow(0 0 18px rgba(248, 113, 113, 0.3));
            transform: scale(1.15);
          }
        }
      `}</style>

      <MapContainer
        center={position || [25.5, 93.0]}
        zoom={position ? 10 : 7}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Satellite base layer for terrain and natural features */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
        />
        
        {/* Terrain layer with elevation and topographic details */}
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenTopoMap'
          opacity={0.4}
        />
        
        {/* Water bodies and rivers layer - enhanced visibility */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
          opacity={0.4}
        />
        
        {/* Natural Earth style for political boundaries and place names */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
          opacity={0.3}
        />
        
        {position && (
          <Marker
            position={position}
            icon={createPinIcon()}
          >
            <Tooltip direction="bottom" offset={[0, 15]} opacity={1} className="custom-tooltip">
              <div className="p-2 bg-white rounded-md shadow-lg border max-w-xs z-[9999]">
                <h4 className="font-bold text-red-800 mb-1 text-xs">📍 Selected Location</h4>
                <div className="text-xs text-gray-600">
                  📍 {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </div>
              </div>
            </Tooltip>
          </Marker>
        )}
        <MapCenterController position={position} />
        <LocationMarker onPositionChange={onPositionChange} />
        <HighRiskZoneMarkers />
      </MapContainer>
      
      <Legend />
    </div>
  );
}