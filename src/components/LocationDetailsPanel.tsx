import React from "react";
import type { HighRiskZone } from "@/lib/high-risk-zones";

interface LocationDetailsPanelProps {
  location: HighRiskZone;
  onClose: () => void;
}

const LocationDetailsPanel: React.FC<LocationDetailsPanelProps> = ({ location, onClose }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-[95vw] max-w-xl bg-white/95 rounded-2xl shadow-2xl border border-gray-200 p-6 flex flex-col items-start animate-fade-in-up">
      <div className="flex w-full justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-[#0B86FF]">{location.name}</h3>
        <button
          onClick={onClose}
          className="ml-4 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-lg transition"
          aria-label="Close details panel"
        >
          ×
        </button>
      </div>
      <div className="text-gray-700">
        <p className="mb-2">Detailed description coming soon.</p>
      </div>
    </div>
  );
};

export default LocationDetailsPanel;
