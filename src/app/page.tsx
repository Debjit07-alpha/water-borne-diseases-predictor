"use client";

import { useEffect, useState } from "react";
import InfoPanel from "@/components/InfoPanel";
import { highRiskZones, type HighRiskZone } from "@/lib/high-risk-zones";
import { Button } from "@/components/ui/button";

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
  const [selectedZone, setSelectedZone] = useState<HighRiskZone | null>(null);

  useEffect(() => {
    fetch("/api/incidents")
      .then((r) => r.json())
      .then((data) => setIncidents(data.slice(0, 6)))
      .catch(() => setIncidents([]));
  }, []);

  return (
    <div className="relative flex-1 overflow-auto text-black h-full p-6 bg-gradient-to-br from-[#F0F9FF] to-[#EFF6FF]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B3A5E]">Northeast Water-Borne Diseases Dashboard</h1>
              <p className="text-sm text-[#134E66] mt-1">Region-focused insights, risks, and practical prevention guidance.</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {/* Hero illustration */}
              <svg width="120" height="64" viewBox="0 0 120 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="64" rx="8" fill="#0B86FF" />
                <g transform="translate(8,8)">
                  <circle cx="16" cy="20" r="12" fill="#A7F3D0" />
                  <rect x="40" y="6" width="64" height="12" rx="4" fill="#FEF08A" />
                  <path d="M0 44c10-8 30-8 40 0" stroke="#7DD3FC" strokeWidth="6" strokeLinecap="round" fill="none" />
                </g>
              </svg>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 p-4 rounded-lg bg-white/95 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Regional Overview</h3>
                <p className="text-sm text-foreground/60 mt-1">Summary of riverine and flood-prone areas, common risk drivers, and seasonal trends.</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-foreground/60">Active Cases</div>
                <div className="text-2xl font-semibold">{incidents.length}</div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm">This dashboard highlights common outbreaks in riverbank communities, tea-garden settlements, and remote hill villages. Click any high-risk zone on the right to view details and guidance.</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded bg-gradient-to-r from-[#FFEDD5] to-[#FFF7ED] border">
                <div className="text-xs text-[#7A3E00]">Most Common</div>
                <div className="font-semibold mt-1 text-[#7A3E00]">Cholera, Dysentery</div>
              </div>
              <div className="p-3 rounded bg-gradient-to-r from-[#ECFEFF] to-[#F0FDFF] border">
                <div className="text-xs text-[#064E3B]">Primary Source</div>
                <div className="font-semibold mt-1 text-[#064E3B]">Untreated river/pond water</div>
              </div>
              <div className="p-3 rounded bg-gradient-to-r from-[#FEE2E2] to-[#FFF1F2] border">
                <div className="text-xs text-[#7F1D1D]">Seasonal Peak</div>
                <div className="font-semibold mt-1 text-[#7F1D1D]">Monsoon (Jun–Sep)</div>
              </div>
            </div>
          </div>

          <aside className="p-4 rounded-lg bg-gradient-to-b from-white to-[#F8FAFC] shadow border border-gray-200">
            <div className="text-sm font-medium text-[#0F172A]">High Risk Zones</div>
            <div className="mt-3 space-y-3 max-h-72 overflow-y-auto">
              {highRiskZones.map((z) => (
                <button
                  key={z.name}
                  onClick={() => setSelectedZone(z)}
                  className="w-full text-left p-3 bg-white rounded border hover:shadow-lg hover:scale-[1.01] transition-transform transform-gpu flex items-start gap-3"
                >
                  <div className="flex-1">
                    <div className="font-medium">{z.name}</div>
                    <div className="text-xs text-[#475569] mt-1">{z.description}</div>
                    <div className="text-xs mt-2">Risk: <span className={`font-semibold ${z.riskAnalysis.overallRisk === 'High' ? 'text-red-600' : z.riskAnalysis.overallRisk === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}`}>{z.riskAnalysis.overallRisk}</span></div>
                  </div>
                  <div className="text-xs text-foreground/60">View</div>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <div className="col-span-2 p-4 rounded-lg bg-white/95 shadow border border-gray-200">
            <h3 className="text-lg font-semibold">Recent Incidents</h3>
            <div className="mt-3 space-y-2">
              {incidents.length === 0 && <div className="text-sm text-foreground/60">No recent incidents available.</div>}
              {incidents.map((inc) => (
                <div key={inc.id} className="p-3 rounded bg-white border">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{inc.disease}</div>
                    <div className="text-xs text-foreground/60">{new Date(inc.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-foreground/60 mt-1">{inc.details ?? "—"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/95 shadow border border-gray-200">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="mt-3 space-y-2">
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">Start Emergency Response</Button>
              <Button size="sm" variant="secondary" className="w-full bg-[#0B86FF] hover:bg-[#0A74E0] text-white">Export Report</Button>
              <Button size="sm" variant="ghost" className="w-full border">Share Guidance</Button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 4C12 4 8 8 8 12.5C8 20 18 28 18 28s10-8 10-15.5C28 8 24 4 18 4z" fill="#60A5FA" />
                </svg>
                <div className="text-xs mt-2">Causes</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="12" fill="#34D399" />
                </svg>
                <div className="text-xs mt-2">Spread</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#FCA5A5" />
                </svg>
                <div className="text-xs mt-2">Prevention</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Info Panel */}
      <InfoPanel zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
