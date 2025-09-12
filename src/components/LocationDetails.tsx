import { HighRiskZone } from "@/lib/high-risk-zones";

interface LocationDetailsProps {
  zone: HighRiskZone;
}

const RiskLevelIndicator = ({ level }: { level: "High" | "Moderate" | "Low" }) => {
  const color = {
    High: "bg-red-500",
    Moderate: "bg-yellow-500",
    Low: "bg-green-500",
  }[level];

  return (
    <div className="flex items-center">
      <span className={`w-3 h-3 rounded-full ${color} mr-2`}></span>
      <span>{level}</span>
    </div>
  );
};

export default function LocationDetails({ zone }: LocationDetailsProps) {
  return (
    <div className="p-4 bg-neutral-800 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">{zone.name}</h2>

      {/* Section A: Location Elaboration */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2 mb-3">Location Elaboration</h3>
        <p className="text-muted-foreground mb-3">{zone.description}</p>
        <p>
          <strong>Primary Water Source:</strong> {zone.primaryWaterSource}
        </p>
      </div>

      {/* Section B: Risk & Contamination Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2 mb-3">Risk & Contamination Analysis</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="font-semibold">Overall Risk Level:</p>
            <RiskLevelIndicator level={zone.riskAnalysis.overallRisk} />
          </div>
          <div>
            <p className="font-semibold">Contamination Level:</p>
            <p>{zone.riskAnalysis.contaminationLevel}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">Primary Risk Factors:</p>
          <ul className="list-disc list-inside pl-2 mt-1">
            {zone.riskAnalysis.primaryRiskFactors.map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section: Common Localized Diseases */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2 mb-3">Common Localized Diseases</h3>
        <ul className="list-disc list-inside pl-2 mt-1">
          {zone.commonDiseases.map((disease, i) => (
            <li key={i}>{disease}</li>
          ))}
        </ul>
      </div>

      {/* Section C: Prevention & Cure Protocol */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2 mb-3">How to Mitigate Risk (Prevention)</h3>
        <ol className="list-decimal list-inside pl-2 space-y-2">
          {zone.preventionAndCure.mitigation.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2 mb-3">What to Do if Sick (First Response)</h3>
        <ol className="list-decimal list-inside pl-2 space-y-2">
          {zone.preventionAndCure.firstResponse.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
