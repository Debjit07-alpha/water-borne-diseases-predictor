"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { highRiskZones, HighRiskZone } from "@/lib/high-risk-zones";
import LocationDetails from "@/components/LocationDetails";
import { Input } from "@/components/ui/input";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function InteractiveMap() {
  const [selectedZone, setSelectedZone] = useState<HighRiskZone | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredZones = highRiskZones.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 h-[calc(100vh-200px)]">
          <Map
            position={null}
            onPositionChange={() => {}}
            onZoneClick={setSelectedZone}
            zones={filteredZones}
          />
        </div>
        <div className="md:col-span-1 p-4 overflow-y-auto h-[calc(100vh-200px)] bg-neutral-900">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          {selectedZone ? (
            <LocationDetails zone={selectedZone} />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Click on a red dot to view details.</p>
              <p className="mt-4">Or search for a location above.</p>
              <ul className="mt-4 text-left">
                {filteredZones.map((zone) => (
                  <li
                    key={zone.name}
                    className="p-2 cursor-pointer hover:bg-neutral-800 rounded-md"
                    onClick={() => setSelectedZone(zone)}
                  >
                    {zone.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
