import { HighRiskZone } from "@/lib/high-risk-zones";

export default function InfoPanel({ zone, onClose }: { zone: HighRiskZone | null; onClose: () => void }) {
  if (!zone) return null;

  return (
  <aside className="w-96 fixed right-0 top-0 h-full z-50 p-6 slide-in overflow-y-auto bg-gradient-to-b from-white to-[#F8FAFC] border-l border-gray-200 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#E6F2FF]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 7 7 7 11C7 14.3137 9.68629 17 13 17C16.3137 17 19 14.3137 19 11C19 7 14 2 14 2H12Z" fill="#0B86FF"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-[#0B2545]">{zone.name}</h3>
            <p className="text-sm text-[#475569] mt-1">{zone.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close panel"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground/60"
          >
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Summary cards */}
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-white shadow-sm">
          <div className="text-sm font-medium text-[#334155]">Overall Risk</div>
          <div className="text-2xl font-semibold mt-1">
            <span className={`${zone.riskAnalysis.overallRisk === 'High' ? 'text-red-600' : zone.riskAnalysis.overallRisk === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}`}>{zone.riskAnalysis.overallRisk}</span>
          </div>
          <div className="text-xs text-[#64748B] mt-1">{zone.riskAnalysis.contaminationLevel}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-white/60">
            <div className="text-sm font-medium text-foreground/60">Primary Source</div>
            <div className="text-base mt-1">{zone.primaryWaterSource}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/60">
            <div className="text-sm font-medium text-foreground/60">Common Diseases</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {zone.commonDiseases.map((disease) => (
                <span
                  key={disease}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0B3A5E] text-white shadow-sm"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" className="mr-2" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="6" fill="#FFF" opacity="0.15" />
                  </svg>
                  {disease}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Northeast region educational section */}
        <div className="p-4 rounded-lg bg-white/60">
          <h4 className="font-semibold">Northeast Region — Waterborne Diseases</h4>
          <p className="text-sm text-foreground/60 mt-2">Common in flood-prone and riverine communities. Below is a short guide on how these diseases occur, spread, and how communities can respond.</p>

          <div className="mt-3">
            <div className="text-sm font-medium">How it occurs</div>
            <ul className="list-disc ml-5 text-sm mt-1">
              <li>Contamination of drinking water by sewage and surface runoff during floods.</li>
              <li>Use of untreated river/pond water for drinking and cooking.</li>
              <li>Poor sanitation and open defecation near water sources.</li>
            </ul>
          </div>

          <div className="mt-3">
            <div className="text-sm font-medium">How it spreads</div>
            <ul className="list-disc ml-5 text-sm mt-1">
              <li>Ingestion of contaminated water or food.</li>
              <li>Person-to-person transmission from poor hygiene.</li>
              <li>Contaminated surfaces and shared utensils in crowded settlements.</li>
            </ul>
          </div>

          <div className="mt-3">
            <div className="text-sm font-medium">Prevention</div>
            <ul className="list-disc ml-5 text-sm mt-1">
              <li>Boil or treat water before drinking (chlorination, filtration).</li>
              <li>Practice handwashing with soap and safe food handling.</li>
              <li>Protect wells and springs; keep latrines away from water points.</li>
            </ul>
          </div>

          <div className="mt-3">
            <div className="text-sm font-medium">If someone gets sick</div>
            <ul className="list-disc ml-5 text-sm mt-1">
              <li>Start Oral Rehydration Solution (ORS) immediately for diarrhea.</li>
              <li>Seek medical care for persistent vomiting, high fever, or blood in stool.</li>
            </ul>
          </div>

          {/* Simple illustrative SVG */}
          <div className="mt-4 flex items-center justify-center">
            <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded">
              <rect x="0" y="0" width="220" height="120" rx="8" fill="#F7FBFF" />
              <g transform="translate(12,12)">
                <rect x="0" y="0" width="196" height="96" rx="6" fill="#FFFFFF" stroke="#E6EEF7" />
                <g transform="translate(10,10)">
                  <circle cx="20" cy="24" r="14" fill="#60A5FA" />
                  <rect x="48" y="8" width="110" height="14" rx="3" fill="#F1F5F9" />
                  <rect x="48" y="30" width="80" height="8" rx="3" fill="#F1F5F9" />
                  <g transform="translate(0,50)">
                    <path d="M0 10c10-8 30-8 40 0" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <circle cx="60" cy="2" r="6" fill="#FBCFE8" />
                    <rect x="72" y="-2" width="60" height="8" rx="3" fill="#FEF3C7" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Prevention lists from zone */}
        <div>
          <h4 className="font-semibold">Prevention & First Response</h4>
          <div className="mt-2">
            <strong>Mitigation:</strong>
            <ul className="list-disc ml-5 mt-1 text-sm">
              {zone.preventionAndCure.mitigation.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="mt-3">
            <strong>First Response:</strong>
            <ul className="list-disc ml-5 mt-1 text-sm">
              {zone.preventionAndCure.firstResponse.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
