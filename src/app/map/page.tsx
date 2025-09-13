"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { highRiskZones, HighRiskZone } from "@/lib/high-risk-zones";
import LocationDetails from "@/components/LocationDetails";
import LocationDetailsPanel from "@/components/LocationDetailsPanel";
import { Input } from "@/components/ui/input";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function InteractiveMap() {
  const [selectedZone, setSelectedZone] = useState<HighRiskZone | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<HighRiskZone | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const filteredZones = highRiskZones.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleZoneClick = (zone: HighRiskZone) => {
    setSelectedZone(zone);
    setSelectedLocation(zone);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#0B86FF] via-[#F0F9FF] to-[#EFF6FF] text-black">
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B86FF] mb-8 text-center font-heading-sans">Interactive Risk Map</h2>
        <div className="w-full rounded-2xl shadow-2xl border-4 border-white/80 bg-white/60 p-6 mb-10">
          <div className="relative h-96 w-full">
            <Map
              position={null}
              onPositionChange={() => {}}
              onZoneClick={handleZoneClick}
              zones={filteredZones}
            />
          </div>
        </div>
        {/* Search and List Panel */}
        <section className="w-full max-w-2xl mx-auto mb-10">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Search Locations</h3>
            <Input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 bg-white border border-gray-300 placeholder-[#6B7280] text-[#111827] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition rounded-md px-3 py-2"
            />
            <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
              {filteredZones.map((zone) => (
                <li
                  key={zone.name}
                  className={`flex items-center gap-2 p-3 cursor-pointer rounded-md transition hover:bg-blue-50 ${selectedLocation?.name === zone.name ? 'bg-blue-100 border-l-4 border-blue-400 font-semibold text-blue-900' : ''}`}
                  onClick={() => handleZoneClick(zone)}
                >
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-sm"></span>
                  {zone.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Details Section (scroll target) */}
        {selectedLocation && (
          <section ref={detailsRef} className="w-full max-w-2xl mx-auto mb-10 animate-fade-in-up">
            <LocationDetails zone={selectedLocation} />
          </section>
        )}
      </main>
    </div>
  );
}
