import { HighRiskZone } from "@/lib/high-risk-zones";

interface LocationDetailsProps {
  zone: HighRiskZone;
}

const RiskLevelIndicator = ({ level }: { level: "High" | "Moderate" | "Low" }) => {
  const colorConfig = {
    High: { bg: "bg-gradient-to-r from-red-500 to-red-600", text: "text-red-100", border: "border-red-400", shadow: "shadow-red-500/50" },
    Moderate: { bg: "bg-gradient-to-r from-yellow-500 to-orange-500", text: "text-yellow-100", border: "border-yellow-400", shadow: "shadow-yellow-500/50" },
    Low: { bg: "bg-gradient-to-r from-green-500 to-green-600", text: "text-green-100", border: "border-green-400", shadow: "shadow-green-500/50" },
  }[level];

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border} shadow-lg ${colorConfig.shadow}`}>
      <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
      <span className="font-semibold text-sm">{level} Risk</span>
    </div>
  );
};

const CoolBullet = ({ children, type }: { children: React.ReactNode; type: "location" | "risk" | "diseases" | "prevention" | "emergency" }) => {
  const config = {
    location: {
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: "📍",
      shadow: "shadow-blue-500/50"
    },
    risk: {
      color: "bg-gradient-to-r from-red-500 to-red-600",
      icon: "⚠️",
      shadow: "shadow-red-500/50"
    },
    diseases: {
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: "🦠",
      shadow: "shadow-orange-500/50"
    },
    prevention: {
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: "🛡️",
      shadow: "shadow-green-500/50"
    },
    emergency: {
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      icon: "🚑",
      shadow: "shadow-purple-500/50"
    }
  }[type];

  return (
    <div className="flex items-center space-x-4 py-3">
      <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center flex-shrink-0 shadow-lg ${config.shadow}`}>
        <span className="text-white text-lg">{config.icon}</span>
      </div>
      <div className="text-gray-700 leading-relaxed font-bold text-xl">{children}</div>
    </div>
  );
};

export default function LocationDetails({ zone }: LocationDetailsProps) {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-2xl border-4 border-white/80 overflow-hidden transform hover:scale-105 transition-all duration-300">
      {/* Header with prominent place name */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">{zone.name}</h1>
        <div className="flex justify-center">
          <RiskLevelIndicator level={zone.riskAnalysis.overallRisk} />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Main Headlines with Relevant Bullets */}
        <div className="space-y-8">
          <CoolBullet type="location">Location Details</CoolBullet>
          <div className="ml-14 space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">{zone.description}</p>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-400">
              <p className="font-semibold text-gray-800 text-lg">
                <span className="text-blue-600">💧 Primary Water Source:</span> {zone.primaryWaterSource}
              </p>
            </div>
          </div>

          <CoolBullet type="risk">Risk Analysis</CoolBullet>
          <div className="ml-14 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-400">
              <p className="font-semibold text-gray-800 text-lg mb-2">
                <span className="text-red-600">🔬 Contamination Level:</span>
              </p>
              <p className="text-gray-700 text-lg">{zone.riskAnalysis.contaminationLevel}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg mb-3">
                <span className="text-red-600">🚨 Primary Risk Factors:</span>
              </p>
              <div className="space-y-3">
                {zone.riskAnalysis.primaryRiskFactors.map((factor, i) => (
                  <div key={i} className="bg-red-50 rounded-lg p-3 border-l-4 border-red-300">
                    <p className="text-gray-700 text-lg">{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <CoolBullet type="diseases">Common Diseases</CoolBullet>
          <div className="ml-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zone.commonDiseases.map((disease, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-400">
                  <p className="font-semibold text-gray-800 text-lg flex items-center">
                    <span className="text-orange-500 mr-3 text-xl">🏥</span>
                    {disease}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <CoolBullet type="prevention">Prevention Measures</CoolBullet>
          <div className="ml-14">
            <div className="space-y-3">
              {zone.preventionAndCure.mitigation.map((step, i) => (
                <div key={i} className="bg-green-50 rounded-lg p-4 border-l-4 border-green-300">
                  <p className="text-gray-700 text-lg">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <CoolBullet type="emergency">Emergency Response</CoolBullet>
          <div className="ml-14">
            <div className="space-y-3">
              {zone.preventionAndCure.firstResponse.map((step, i) => (
                <div key={i} className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-300">
                  <p className="text-gray-700 text-lg">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 text-center">
        <p className="text-lg text-gray-600 font-medium">
          💡 Click on other red dots to explore different high-risk zones
        </p>
      </div>
    </div>
  );
}
