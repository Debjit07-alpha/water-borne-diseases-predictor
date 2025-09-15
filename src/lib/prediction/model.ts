import { LocationFeatures } from "./featureEngineering";

export const MODEL_VERSION = "heuristic-v1";

/**
 * Heuristic outbreak risk scoring.
 * Returns score 0..1 plus categorical label.
 */
export function scoreLocation(f: LocationFeatures) {
  // Weighted combination (tune later)
  // Emphasize recent symptoms & water quality; incidents moderate; seasonal as multiplier.
  let raw = 0;
  raw += Math.min(1, f.recentSymptomScore / 20) * 0.4; // if symptom score ~20 -> saturates
  raw += Math.min(1, f.waterQualityScore) * 0.3;
  raw += Math.min(1, f.incidentRatePerDay / 2) * 0.2; // 2/day saturates
  raw += (f.seasonalFactor) * 0.1; // 0.4 - 1.0 range contributes up to 0.1

  // Recency penalty if water report very old (>10 days)
  if (f.lastReportAgeHours != null && f.lastReportAgeHours > 24 * 10) {
    raw -= 0.05;
  }

  raw = Math.max(0, Math.min(1, raw));

  let category: string;
  if (raw >= 0.65) category = 'High';
  else if (raw >= 0.4) category = 'Moderate';
  else category = 'Low';

  return { score: raw, category };
}
