"use client";

import { useState } from "react";
import InfoPanel from "@/components/InfoPanel";
import { highRiskZones, type HighRiskZone } from "@/lib/high-risk-zones";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<HighRiskZone | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#0B86FF] via-[#F0F9FF] to-[#EFF6FF] text-black">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-br from-[#0B86FF]/80 via-[#F0F9FF]/80 to-[#EFF6FF]/80">
        <h1 className="text-4xl md:text-6xl font-extrabold text-black drop-shadow-lg mb-4 font-heading-serif animate-fade-in">
          AquaWatch: Northeast Water-Borne Diseases Dashboard
        </h1>
        <p className="text-lg md:text-2xl text-black mb-8 max-w-2xl animate-fade-in delay-100">
          Real-time insights, risk zones, and prevention guidance for communities in North-East India.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in delay-200">
          <Button asChild size="lg" className="bg-white text-[#0B86FF] font-bold shadow-lg hover:bg-blue-100 transition">
            <a href="#map">Explore Map</a>
          </Button>
          <Button asChild size="lg" variant="secondary" className="bg-[#0B86FF] text-white font-bold shadow-lg hover:bg-blue-700 transition">
            <a href="/report">Report an Incident</a>
          </Button>
        </div>
      </section>

      {/* Features/PAQ Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" id="features">
        <div className="bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#0B86FF" opacity="0.1"/><path d="M24 8C16 8 10 14 10 21.5C10 34 24 44 24 44s14-10 14-22.5C38 14 32 8 24 8z" fill="#0B86FF"/></svg>
          <h3 className="text-xl font-bold mt-4 mb-2">High-Risk Zones</h3>
          <p className="text-gray-700">Interactive map of flood-prone, riverine, and remote communities at risk for water-borne diseases.</p>
        </div>
        <div className="bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="8" fill="#0B86FF" opacity="0.1"/><rect x="16" y="16" width="16" height="16" rx="4" fill="#0B86FF"/></svg>
          <h3 className="text-xl font-bold mt-4 mb-2">Real-Time Incidents</h3>
          <p className="text-gray-700">See recent outbreaks, case numbers, and trends. Stay informed and prepared for seasonal peaks.</p>
        </div>
        <div className="bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="0" y="0" width="48" height="48" rx="24" fill="#0B86FF" opacity="0.1"/><path d="M24 14a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 3v6l5 3" fill="#0B86FF"/></svg>
          <h3 className="text-xl font-bold mt-4 mb-2">Prevention & Response</h3>
          <p className="text-gray-700">Guidance for communities: how to prevent, respond, and recover from water-borne disease outbreaks.</p>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="w-full max-w-7xl mx-auto py-12 px-4 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B86FF] mb-6 text-center font-heading-sans">Interactive Risk Map</h2>
        <div className="w-full h-[60vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white/60 relative">
          <Map
            position={position}
            onPositionChange={(lat, lng) => setPosition([lat, lng])}
            onZoneClick={setSelectedZone}
            zones={highRiskZones}
          />
        </div>
      </section>

      {/* FAQ/PAQ Section */}
      <section className="w-full max-w-5xl mx-auto py-16 px-4 animate-fade-in-up" id="faq">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B86FF] mb-8 text-center font-heading-sans">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-2">What are water-borne diseases?</h4>
            <p className="text-gray-700 mb-4">Diseases caused by microorganisms in contaminated water, such as cholera, dysentery, and typhoid. They spread through drinking or using unsafe water.</p>
            <h4 className="font-semibold mb-2">How can I protect my family?</h4>
            <p className="text-gray-700 mb-4">Boil or treat water before use, practice good hygiene, and avoid open defecation near water sources. Follow local health advisories.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What should I do if someone gets sick?</h4>
            <p className="text-gray-700 mb-4">Start oral rehydration immediately for diarrhea. Seek medical help for severe symptoms like high fever or blood in stool.</p>
            <h4 className="font-semibold mb-2">Where can I report an outbreak?</h4>
            <p className="text-gray-700 mb-4">Use the “Report an Incident” button above or contact your local health authorities. Your report helps protect the community.</p>
          </div>
        </div>
      </section>

      {/* Info Panel for Map Zones */}
      <InfoPanel zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
