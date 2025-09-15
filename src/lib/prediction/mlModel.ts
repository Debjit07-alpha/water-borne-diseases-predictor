import { promises as fs } from 'fs';
import path from 'path';
import { LocationFeatures } from './featureEngineering';
import { scoreLocation as heuristicScore } from './model';

interface LogisticModel {
  weights: number[]; // bias + weights
  featureNames: string[];
  modelVersion: string;
  trainedAt: string;
}

function sigmoid(z: number) { return 1 / (1 + Math.exp(-z)); }

function featuresVector(f: LocationFeatures) {
  return [
    f.incidentRatePerDay,
    f.recentSymptomScore,
    f.waterQualityScore,
    f.seasonalFactor,
    f.lastReportAgeHours == null ? 0 : Math.min(1, f.lastReportAgeHours / (24 * 14)),
  ];
}

export async function loadLogisticModel(): Promise<LogisticModel | null> {
  try {
    const file = path.join(process.cwd(), 'models', 'logreg-model.json');
    const raw = await fs.readFile(file, 'utf-8');
    const model = JSON.parse(raw);
    if (Array.isArray(model.weights) && model.featureNames?.length) return model;
    return null;
  } catch {
    return null;
  }
}

export async function scoreWithModel(f: LocationFeatures) {
  const model = await loadLogisticModel();
  if (!model) {
    const heuristic = heuristicScore(f);
    return {
      score: heuristic.score,
      category: heuristic.category,
      modelVersion: 'heuristic-fallback',
      method: 'heuristic',
    };
  }
  const vec = featuresVector(f);
  const w = model.weights;
  let z = w[0];
  for (let i = 0; i < vec.length; i++) z += w[i + 1] * vec[i];
  const s = sigmoid(z);
  let category: string;
  if (s >= 0.65) category = 'High';
  else if (s >= 0.4) category = 'Moderate';
  else category = 'Low';
  return { score: s, category, modelVersion: model.modelVersion, method: 'logistic-regression' };
}
