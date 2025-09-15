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
      case "High": return 12;
      case "Moderate": return 10;
      case "Low": return 8;
      default: return 10;
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
                },
                mouseover: (e: any) => {
                  e.target.setStyle({
                    fillOpacity: 1,
                    weight: 4,
                    radius: radius + 2
                  });
                },
                mouseout: (e: any) => {
                  e.target.setStyle({
                    fillOpacity: 0.8,
                    weight: 3,
                    radius: radius
                  });
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
                <div className="p-3 bg-white rounded-lg shadow-lg border">
                  <h4 className="font-bold text-gray-800 mb-1">{zone.name}</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Risk Level:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-white text-xs font-bold ${
                      zone.riskAnalysis.overallRisk === 'High' ? 'bg-red-600' :
                      zone.riskAnalysis.overallRisk === 'Moderate' ? 'bg-orange-500' : 'bg-green-600'
                    }`}>
                      {zone.riskAnalysis.overallRisk}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Primary Diseases:</strong> {zone.commonDiseases.join(", ")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <strong>Water Source:</strong> {zone.primaryWaterSource}
                  </div>
                  <div className="text-xs text-blue-600 mt-2 font-medium">
                    Click for detailed information
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </>
    );
  }

  function MapTitle() {
    return (
      <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto pointer-events-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            Water-Borne Disease Risk Map
          </h2>
          <p className="text-sm text-gray-600">
            Real-time monitoring of high-risk zones across North-East India
          </p>
        </div>
      </div>
    );
  }
    return (
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <div className="mb-3">
          <h4 className="font-bold text-gray-800 text-sm mb-1">Water-Borne Disease Risk Zones</h4>
          <p className="text-xs text-gray-600">North-East India Risk Assessment</p>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-800 mr-2 shadow-sm"></div>
            <span className="text-gray-700"><strong>High Risk</strong> - Immediate attention required</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-700 mr-2 shadow-sm"></div>
            <span className="text-gray-700"><strong>Moderate Risk</strong> - Enhanced monitoring</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 border-2 border-green-800 mr-2 shadow-sm"></div>
            <span className="text-gray-700"><strong>Low Risk</strong> - Standard precautions</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <strong>Data Source:</strong> Regional Health Surveillance
          </p>
          <p className="text-xs text-gray-500">
            <strong>Last Updated:</strong> September 2025
          </p>
        </div>
        
        <div className="mt-2">
          <p className="text-xs text-blue-600 font-medium">
            💧 Click markers for detailed information
          </p>
        </div>
      </div>
    );
  }

  function MapTitle() {
    return (
      <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto pointer-events-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            Water-Borne Disease Risk Map
          </h2>
          <p className="text-sm text-gray-600">
            Real-time monitoring of high-risk zones across North-East India
          </p>
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
        
        /* Enhanced risk zone styling with better contrast and glow effects */
        .risk-zone {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        /* High Risk Zones - Intense Red Glow */
        .high-risk-glow {
          filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.9)) 
                  drop-shadow(0 0 16px rgba(239, 68, 68, 0.7))
                  drop-shadow(0 0 24px rgba(248, 113, 113, 0.5));
          animation: highRiskPulse 2.5s ease-in-out infinite alternate;
        }
        
        @keyframes highRiskPulse {
          0% { 
            filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.9)) 
                    drop-shadow(0 0 16px rgba(239, 68, 68, 0.7))
                    drop-shadow(0 0 24px rgba(248, 113, 113, 0.5));
          }
          100% { 
            filter: drop-shadow(0 0 12px rgba(220, 38, 38, 1)) 
                    drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))
                    drop-shadow(0 0 32px rgba(248, 113, 113, 0.6));
          }
        }
        
        /* Moderate Risk Zones - Orange Glow */
        .moderate-risk-glow {
          filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.8)) 
                  drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))
                  drop-shadow(0 0 18px rgba(254, 215, 170, 0.4));
          animation: moderateRiskPulse 3s ease-in-out infinite alternate;
        }
        
        @keyframes moderateRiskPulse {
          0% { 
            filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.8)) 
                    drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))
                    drop-shadow(0 0 18px rgba(254, 215, 170, 0.4));
          }
          100% { 
            filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.9)) 
                    drop-shadow(0 0 16px rgba(251, 191, 36, 0.7))
                    drop-shadow(0 0 24px rgba(254, 215, 170, 0.5));
          }
        }
        
        /* Low Risk Zones - Green Glow */
        .low-risk-glow {
          filter: drop-shadow(0 0 4px rgba(22, 163, 74, 0.7)) 
                  drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))
                  drop-shadow(0 0 12px rgba(134, 239, 172, 0.3));
          animation: lowRiskPulse 4s ease-in-out infinite alternate;
        }
        
        @keyframes lowRiskPulse {
          0% { 
            filter: drop-shadow(0 0 4px rgba(22, 163, 74, 0.7)) 
                    drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))
                    drop-shadow(0 0 12px rgba(134, 239, 172, 0.3));
          }
          100% { 
            filter: drop-shadow(0 0 6px rgba(22, 163, 74, 0.8)) 
                    drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))
                    drop-shadow(0 0 16px rgba(134, 239, 172, 0.4));
          }
        }
        
        /* Custom tooltip styling */
        .custom-tooltip .leaflet-tooltip {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          color: #374151 !important;
          font-size: 12px !important;
          padding: 0 !important;
        }
        
        .custom-tooltip .leaflet-tooltip:before {
          border-top-color: #e5e7eb !important;
        }
        
        /* Hover effects for risk zones */
        .risk-zone:hover {
          transform: scale(1.1);
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
      <MapTitle />
      <Legend />
    </div>
  );
}
