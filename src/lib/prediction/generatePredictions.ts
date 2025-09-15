import { prisma } from "@/lib/prisma";
import { buildFeaturesForLocations } from "./featureEngineering";
import { MODEL_VERSION } from "./model";
import { scoreWithModel } from "./mlModel";

/**
 * Generate outbreak predictions for each distinct (lat,lng) we have incidents or reports for.
 * Stores results in OutbreakPrediction table.
 */
export async function generatePredictions(windowDays = 14, targetOffsetDays = 1) {
  // Collect distinct locations from incidents + water quality + symptom trends
  const [incLocs, waterLocs, symptomLocs] = await Promise.all([
    prisma.incident.findMany({ select: { latitude: true, longitude: true } }),
    prisma.waterQualityReport.findMany({ select: { latitude: true, longitude: true } }),
    prisma.symptomTrend.findMany({ select: { latitude: true, longitude: true } }),
  ]);

  const dedupKey = (o: { latitude: number; longitude: number }) => `${o.latitude.toFixed(4)}:${o.longitude.toFixed(4)}`;
  const map = new Map<string, { latitude: number; longitude: number }>();
  for (const arr of [incLocs, waterLocs, symptomLocs]) {
    for (const loc of arr) {
      map.set(dedupKey(loc), loc);
    }
  }

  const distinctLocations = Array.from(map.values());
  if (!distinctLocations.length) return [];

  const features = await buildFeaturesForLocations(distinctLocations, windowDays);
  const targetDate = new Date(Date.now() + targetOffsetDays * 24 * 60 * 60 * 1000);

  const created: any[] = [];
  for (const f of features) {
    const { score, category, modelVersion, method } = await scoreWithModel(f);
    const explanation = `${method} factors: symptoms=${f.recentSymptomScore.toFixed(1)}, water=${f.waterQualityScore.toFixed(2)}, incidents/day=${f.incidentRatePerDay.toFixed(2)}, season=${f.seasonalFactor.toFixed(2)}`;

    const rec = await prisma.outbreakPrediction.create({
      data: {
        latitude: f.latitude,
        longitude: f.longitude,
        generatedAt: new Date(),
        targetDate,
  modelVersion: modelVersion || MODEL_VERSION,
        riskScore: score,
        riskCategory: category,
        features: {
          incidentCount: f.incidentCount,
          incidentRatePerDay: f.incidentRatePerDay,
          recentSymptomScore: f.recentSymptomScore,
          waterQualityScore: f.waterQualityScore,
          seasonalFactor: f.seasonalFactor,
          lastReportAgeHours: f.lastReportAgeHours,
          windowDays: f.windowDays,
        },
        explanation,
      },
    });
    created.push(rec);
  }
  return created;
}
