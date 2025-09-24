"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InfoPanel from "@/components/InfoPanel";
import { highRiskZones, type HighRiskZone } from "@/lib/high-risk-zones";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<HighRiskZone | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Map loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#0B86FF] via-[#F0F9FF] to-[#EFF6FF] text-black">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-br from-[#0B86FF]/80 via-[#F0F9FF]/80 to-[#EFF6FF]/80">
        <div className={`transition-all duration-1000 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold text-black drop-shadow-lg mb-4 font-heading-serif">
            The River Pulse: Northeast Water Data Hub
          </h1>
        </div>
        <div className={`transition-all duration-1000 delay-200 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <p className="text-lg md:text-2xl text-black mb-8 max-w-2xl font-book-antiqua">
            Real-time insights, risk zones, and prevention guidance for communities in North-East India.
          </p>
        </div>
        <div className={`transition-all duration-1000 delay-400 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/map">
              <Button size="lg" className="bg-white text-[#0B86FF] font-bold shadow-lg hover:bg-white hover:text-[#0B86FF] hover:scale-105 hover:shadow-xl transition-all duration-200">
                Explore Map
              </Button>
            </Link>
            <Link href="/report">
              <Button size="lg" variant="secondary" className="bg-[#0B86FF] text-white font-bold shadow-lg hover:bg-[#0B86FF]/90 hover:text-white hover:scale-105 hover:shadow-xl transition-all duration-200">
                Report an Incident
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold shadow-lg hover:from-orange-600 hover:to-yellow-600 hover:scale-105 hover:shadow-xl transition-all duration-200">
                👑 Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features/PAQ Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" id="features">
        <div className={`bg-white/80 rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center group cursor-pointer ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: '600ms' }}>
          <div>
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#0B86FF" opacity="0.1"/><path d="M24 8C16 8 10 14 10 21.5C10 34 24 44 24 44s14-10 14-22.5C38 14 32 8 24 8z" fill="#0B86FF"/></svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-2 font-book-antiqua">High-Risk Zones</h3>
          <p className="text-lg md:text-xl text-gray-700 text-center font-bell-mt">Interactive map of flood-prone, riverine, and remote communities at risk for water-borne diseases.</p>
        </div>
        <div className={`bg-white/80 rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center group cursor-pointer ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: '800ms' }}>
          <div>
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="8" fill="#0B86FF" opacity="0.1"/><rect x="16" y="16" width="16" height="16" rx="4" fill="#0B86FF"/></svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-2 font-book-antiqua">Real-Time Incidents</h3>
          <p className="text-lg md:text-xl text-gray-700 text-center font-bell-mt">See recent outbreaks, case numbers, and trends. Stay informed and prepared for seasonal peaks.</p>
        </div>
        <div className={`bg-white/80 rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center group cursor-pointer sm:col-span-2 lg:col-span-1 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: '1000ms' }}>
          <div>
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="0" y="0" width="48" height="48" rx="24" fill="#0B86FF" opacity="0.1"/><path d="M24 14a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 3v6l5 3" fill="#0B86FF"/></svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-2 font-book-antiqua">Prevention & Response</h3>
          <p className="text-lg md:text-xl text-gray-700 text-center font-bell-mt">Guidance for communities: how to prevent, respond, and recover from water-borne disease outbreaks.</p>
        </div>
      </section>

      {/* Diseases Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <div className={`transition-all duration-1000 delay-1000 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center font-bookman-old-style">Common Water-Borne Diseases</h2>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-1100 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          {/* Cholera */}
          <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img 
                src="/cholerae.jpg" 
                alt="Cholera bacteria" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23ef4444'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-weight='bold'%3ECholera%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <h3 className="text-lg font-bold text-center">Cholera</h3>
            <p className="text-sm text-gray-600 text-center mt-2">Severe diarrhea caused by Vibrio cholerae bacteria</p>
          </div>

          {/* Diarrhea */}
          <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img 
                src="/diarrea.jpg" 
                alt="Diarrhea symptoms" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f59e0b'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-weight='bold'%3EDiarrhea%3C/text%3E%3C/svg%3E";
                }}    
              /> 
            </div>
            <h3 className="text-lg font-bold text-center">Diarrhea</h3>
            <p className="text-sm text-gray-600 text-center mt-2">Frequent loose, watery stools causing dehydration</p>
          </div>

          {/* Hepatitis A */}
          <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img 
                src="/hepatitis_A.jpg" 
                alt="Hepatitis A virus" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%2310b981'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='white' font-size='14' font-weight='bold'%3EHepatitis A%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <h3 className="text-lg font-bold text-center">Hepatitis A</h3>
            <p className="text-sm text-gray-600 text-center mt-2">Liver inflammation caused by contaminated water</p>
          </div>

          {/* Typhoid */}
          <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img 
                src="/typhoid.jpg" 
                alt="Typhoid fever" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%238b5cf6'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-weight='bold'%3ETyphoid%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <h3 className="text-lg font-bold text-center">Typhoid</h3>
            <p className="text-sm text-gray-600 text-center mt-2">High fever and weakness from Salmonella typhi</p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="w-full max-w-7xl mx-auto py-12 px-4">
        <div className={`transition-all duration-1000 delay-1200 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center font-bookman-old-style">GeoSpatial Health Monitoring & Hospital Tracking</h2>
        </div>
        <div className={`w-full h-[50vh] sm:h-[60vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white/60 relative transition-all duration-1000 delay-1400 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          {!isMapLoaded ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded w-24 mx-auto animate-pulse"></div>
              </div>
            </div>
          ) : (
            <Map
              position={position}
              onPositionChange={(lat, lng) => setPosition([lat, lng])}
              onZoneClick={setSelectedZone}
              zones={highRiskZones}
            />
          )}
        </div>
      </section>

      {/* FAQ/PAQ Section */}
      <section className="w-full max-w-5xl mx-auto py-16 px-4" id="faq">
        <div className={`transition-all duration-1000 delay-1600 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center font-bookman-old-style bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">Frequently Asked Questions</h2>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 transition-all duration-1000 delay-1800 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 hover:from-blue-100 hover:to-cyan-200 rounded-lg p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-blue-500 hover:border-blue-600">
              <h4 className="font-semibold mb-2 text-xl md:text-2xl font-book-antiqua text-blue-800 hover:text-blue-900 transition-colors duration-300">What are water-borne diseases?</h4>
              <p className="text-gray-700 text-lg md:text-xl font-bell-mt">Diseases caused by microorganisms in contaminated water, such as cholera, dysentery, and typhoid. They spread through drinking or using unsafe water.</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 rounded-lg p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-green-500 hover:border-green-600">
              <h4 className="font-semibold mb-2 text-xl md:text-2xl font-book-antiqua text-green-800 hover:text-green-900 transition-colors duration-300">How can I protect my family?</h4>
              <p className="text-gray-700 text-lg md:text-xl font-bell-mt">Boil or treat water before use, practice good hygiene, and avoid open defecation near water sources. Follow local health advisories.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 rounded-lg p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-purple-500 hover:border-purple-600">
              <h4 className="font-semibold mb-2 text-xl md:text-2xl font-book-antiqua text-purple-800 hover:text-purple-900 transition-colors duration-300">What should I do if someone gets sick?</h4>
              <p className="text-gray-700 text-lg md:text-xl font-bell-mt">Start oral rehydration immediately for diarrhea. Seek medical help for severe symptoms like high fever or blood in stool.</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200 rounded-lg p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-orange-500 hover:border-orange-600">
              <h4 className="font-semibold mb-2 text-xl md:text-2xl font-book-antiqua text-orange-800 hover:text-orange-900 transition-colors duration-300">Where can I report an outbreak?</h4>
              <p className="text-gray-700 text-lg md:text-xl font-bell-mt">Use the "Report an Incident" button above or contact your local health authorities. Your report helps protect the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Panel for Map Zones */}
      <InfoPanel zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
