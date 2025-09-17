"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LocationSearch from "@/components/LocationSearch";
import { HighRiskZone, highRiskZones } from "@/lib/high-risk-zones";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

interface Incident {
  id: string;
  disease: string;
  latitude: number;
  longitude: number;
  details?: string;
  createdAt: string;
  address?: string;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [selectedZone, setSelectedZone] = useState<HighRiskZone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents');
      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setPosition([lat, lng]);
  };

  const handleZoneClick = (zone: HighRiskZone) => {
    setSelectedZone(zone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B86FF] via-[#F0F9FF] to-[#EFF6FF] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 font-bookman-old-style">
            Recent Incidents
          </h1>
          <p className="text-lg text-gray-700 font-book-antiqua">
            Track and monitor water-borne disease incidents in your area
          </p>
        </div>

        {/* Search and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Search Location</h2>
              <LocationSearch
                onLocationSelect={handleLocationSelect}
                placeholder="Search for incidents near..."
                className="mb-4"
              />
              
              {/* Incident Statistics */}
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Recent Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{incidents.length}</div>
                    <div className="text-sm text-red-700">Total Incidents</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {incidents.filter(i => new Date(i.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                    </div>
                    <div className="text-sm text-orange-700">This Week</div>
                  </div>
                </div>
              </div>

              {/* Recent Incidents List */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Latest Reports</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Loading incidents...</p>
                    </div>
                  ) : incidents.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600">No incidents reported yet.</p>
                    </div>
                  ) : (
                    incidents.slice(0, 10).map((incident) => (
                      <div
                        key={incident.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => setPosition([incident.latitude, incident.longitude])}
                      >
                        <div className="font-medium text-sm text-gray-800">{incident.disease}</div>
                        <div className="text-xs text-gray-600">
                          {incident.address || `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Incident Map</h2>
              <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <Map
                  position={position}
                  onPositionChange={(lat, lng) => setPosition([lat, lng])}
                  onZoneClick={handleZoneClick}
                  zones={highRiskZones}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Zone Info Panel */}
        {selectedZone && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800">{selectedZone.name}</h3>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{selectedZone.description}</p>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              selectedZone.riskAnalysis.overallRisk === "High" 
                ? "bg-red-100 text-red-800"
                : selectedZone.riskAnalysis.overallRisk === "Moderate"
                ? "bg-orange-100 text-orange-800"
                : "bg-green-100 text-green-800"
            }`}>
              {selectedZone.riskAnalysis.overallRisk} Risk
            </div>
          </div>
        )}
      </div>
    </div>
  );
}