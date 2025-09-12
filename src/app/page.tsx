"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });
import Chat from "@/components/Chat";

type Incident = {
  id: string;
  disease: string;
  latitude: number;
  longitude: number;
  details?: string | null;
  createdAt: string;
};

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetch("/api/incidents")
      .then((r) => r.json())
      .then((data) => setIncidents(data.slice(0, 6)))
      .catch(() => setIncidents([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Header />
      <main className="container py-12 flex-1">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Protecting Communities from Water-Borne Diseases</h1>
            <p className="text-lg opacity-80 mb-6">AquaWatch is a community-driven platform for reporting, monitoring and learning about water-borne diseases. Help us keep your community safe by reporting suspected cases and staying informed.</p>
            <div className="flex gap-4">
              <a href="/report" className="inline-block rounded-md bg-white px-6 py-3 text-black font-medium">Report an Incident</a>
              <a href="/diseases" className="inline-block rounded-md border border-white px-6 py-3 text-white">Learn More</a>
            </div>
          </div>
          <div className="h-80 rounded-md overflow-hidden border border-neutral-700 shadow-lg bg-white">
            <Map position={mapPosition} onPositionChange={(lat, lng) => setMapPosition([lat, lng])} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold">Incident Reporting</h3>
              <p className="text-sm text-muted-foreground">Easy-to-use multi-step form with map-based location input.</p>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold">AI Health Assistant</h3>
              <p className="text-sm text-muted-foreground">Ask common questions about diseases and prevention (not medical advice).</p>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold">Disease Library</h3>
              <p className="text-sm text-muted-foreground">Server-rendered disease pages with symptoms, prevention and treatment information.</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Latest Incidents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {incidents.length === 0 && (
              <p className="text-sm text-muted-foreground">No incidents reported yet.</p>
            )}
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <strong>{inc.disease}</strong>
                  <span className="text-xs text-muted-foreground">{new Date(inc.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{inc.details ?? "—"}</p>
                <button
                  onClick={() => setMapPosition([inc.latitude, inc.longitude])}
                  className="mt-3 text-sm text-primary"
                >
                  View on map
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <Chat />
    </div>
  );
}
