import { prisma } from "@/lib/prisma";

/**
 * Feature engineering utilities for outbreak prediction.
 * These are intentionally simple/statistical (non-ML) to start.
 */

export interface LocationFeatures {
  latitude: number;
  longitude: number;
  windowDays: number;
  incidentCount: number;
  incidentRatePerDay: number;
  recentSymptomScore: number; // aggregated normalized symptom counts
  waterQualityScore: number; // normalized (higher = worse water quality)
  seasonalFactor: number; // 0-1 multiplier based on month/season
  lastReportAgeHours: number | null; // recency of last water quality report
}

// Simple normalization helpers
const safeDiv = (a: number, b: number) => (b === 0 ? 0 : a / b);

// Weighting parameters (could be externalized)
const SYMPTOM_WEIGHTS: Record<string, number> = {
  diarrheaCount: 1.0,
  vomitingCount: 0.8,
  dehydrationCount: 0.9,
  feverCount: 0.6,
  abdominalPainCount: 0.5,
};

export async function buildFeaturesForLocation(lat: number, lng: number, windowDays = 14): Promise<LocationFeatures> {
  const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  // Pull incidents in window (simple approximate bounding by exact lat/lng match for now)
  const incidents = await prisma.incident.findMany({
    where: {
      latitude: lat,
      longitude: lng,
      createdAt: { gte: windowStart },
    },
  });

  const incidentCount = incidents.length;
  const incidentRatePerDay = safeDiv(incidentCount, windowDays);

  // Symptom trends in window
  const symptomTrends = await prisma.symptomTrend.findMany({
    where: {
      latitude: lat,
      longitude: lng,
      date: { gte: windowStart },
    },
  });

  let recentSymptomScore = 0;
  if (symptomTrends.length) {
    for (const trend of symptomTrends) {
      recentSymptomScore +=
        trend.diarrheaCount * SYMPTOM_WEIGHTS.diarrheaCount +
        trend.vomitingCount * SYMPTOM_WEIGHTS.vomitingCount +
        trend.dehydrationCount * SYMPTOM_WEIGHTS.dehydrationCount +
        trend.feverCount * SYMPTOM_WEIGHTS.feverCount +
        trend.abdominalPainCount * SYMPTOM_WEIGHTS.abdominalPainCount;
    }
    // Normalize by number of days collected
    recentSymptomScore = recentSymptomScore / symptomTrends.length;
  }

  // Latest water quality report
  const latestWaterReport = await prisma.waterQualityReport.findFirst({
    where: { latitude: lat, longitude: lng },
    orderBy: { collectedAt: "desc" },
  });

  // Compute water quality score (higher worse) using simple normalization heuristics
  // Each component normalized roughly into 0..1 then averaged
  let waterQualityScore = 0;
  if (latestWaterReport) {
    const parts: number[] = [];
    if (latestWaterReport.coliformCFU != null) {
      // assume 0-1000 CFU range
      parts.push(Math.min(1, latestWaterReport.coliformCFU / 1000));
    }
    if (latestWaterReport.turbidity != null) {
      // assume 0-10 NTU typical range
      parts.push(Math.min(1, latestWaterReport.turbidity / 10));
    }
    if (latestWaterReport.dissolvedOxygen != null) {
      // ideal 6-14 mg/L; inverse relation if <6 treat as risk
      const val = latestWaterReport.dissolvedOxygen;
      parts.push(val < 6 ? Math.min(1, (6 - val) / 6) : 0);
    }
    if (latestWaterReport.ph != null) {
      const p = latestWaterReport.ph;
      // neutral 6.5-8.5; penalty outside
      let deviation = 0;
      if (p < 6.5) deviation = 6.5 - p; else if (p > 8.5) deviation = p - 8.5;
      parts.push(Math.min(1, deviation / 2));
    }
    if (latestWaterReport.temperature != null) {
      // >28C increases risk slightly, scale 28-40C
      const t = latestWaterReport.temperature;
      parts.push(t > 28 ? Math.min(1, (t - 28) / 12) : 0);
    }
    if (parts.length) waterQualityScore = parts.reduce((a, b) => a + b, 0) / parts.length;
  }

  // Seasonal factor (simple): heavier rainy season risk e.g., Jun-Sep
  const month = new Date().getMonth(); // 0-11
  let seasonalFactor = 0.4; // baseline
  if ([5, 6, 7, 8].includes(month)) seasonalFactor = 1.0; // monsoon
  else if ([3, 4, 9].includes(month)) seasonalFactor = 0.7; // shoulder seasons

  const lastReportAgeHours = latestWaterReport ? (Date.now() - latestWaterReport.collectedAt.getTime()) / (1000 * 60 * 60) : null;

  return {
    latitude: lat,
    longitude: lng,
    windowDays,
    incidentCount,
    incidentRatePerDay,
    recentSymptomScore,
    waterQualityScore,
    seasonalFactor,
    lastReportAgeHours,
  };
}

export async function buildFeaturesForLocations(distinctLocations: Array<{ latitude: number; longitude: number }>, windowDays = 14) {
  const results: LocationFeatures[] = [];
  for (const loc of distinctLocations) {
    results.push(await buildFeaturesForLocation(loc.latitude, loc.longitude, windowDays));
  }
  return results;
}
