"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Map from "@/components/Map";
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Protecting Communities from Water-Borne Diseases</h1>
            <p className="text-muted-foreground mb-6">AquaWatch is a community-driven platform for reporting, monitoring and learning about water-borne diseases. Help us keep your community safe by reporting suspected cases and staying informed.</p>
            <div className="flex gap-3">
              <a href="/report" className="inline-block rounded-md bg-primary px-4 py-2 text-white">Report an Incident</a>
              <a href="/diseases" className="inline-block rounded-md border border-input px-4 py-2">Learn More</a>
            </div>
          </div>
          <div className="h-80 rounded-md overflow-hidden border">
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
