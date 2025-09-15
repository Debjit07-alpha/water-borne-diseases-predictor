import { prisma } from "@/lib/prisma";
import { buildFeaturesForLocations } from "../featureEngineering";
import { promises as fs } from 'fs';
import path from 'path';

/**
 * VERY SIMPLE logistic regression training (batch gradient descent) implemented in TS.
 * This treats future incident presence (>=1 next day) as label.
 * For demonstration only; not optimized.
 */

interface TrainResult {
  weights: number[]; // includes bias at index 0
  featureNames: string[];
  iterations: number;
  learningRate: number;
  lossHistory: number[];
  modelVersion: string;
  trainedAt: string;
}

const MODEL_FILE = path.join(process.cwd(), 'models', 'logreg-model.json');

// Ensure models directory exists when writing
async function ensureModelsDir() {
  const dir = path.join(process.cwd(), 'models');
  try { await fs.mkdir(dir); } catch { /* ignore */ }
}

function sigmoid(z: number) { return 1 / (1 + Math.exp(-z)); }

function computeFeaturesVector(f: any) {
  // Maintain ordering consistent with featureNames list below
  return [
    f.incidentRatePerDay,
    f.recentSymptomScore,
    f.waterQualityScore,
    f.seasonalFactor,
    f.lastReportAgeHours == null ? 0 : Math.min(1, f.lastReportAgeHours / (24 * 14)), // fraction of max window
  ];
}

const featureNames = [
  'incidentRatePerDay',
  'recentSymptomScore',
  'waterQualityScore',
  'seasonalFactor',
  'lastReportAgeFrac',
];

export async function trainLogisticRegression(options: { windowDays?: number; iterations?: number; learningRate?: number } = {}) {
  const windowDays = options.windowDays ?? 14;
  const iterations = options.iterations ?? 400;
  const learningRate = options.learningRate ?? 0.05;

  // Collect locations from incidents
  const incLocs = await prisma.incident.findMany({ select: { latitude: true, longitude: true } });
  const key = (o: { latitude: number; longitude: number }) => `${o.latitude.toFixed(4)}:${o.longitude.toFixed(4)}`;
  const map = new Map<string, { latitude: number; longitude: number }>();
  for (const loc of incLocs) map.set(key(loc), loc);
  const distinctLocations = Array.from(map.values());
  if (!distinctLocations.length) throw new Error('No locations to train on');

  const featuresArr = await buildFeaturesForLocations(distinctLocations, windowDays);

  // Labels: whether there was an incident in next 24h after window end (approx using createdAt > now-24h)
  // Simplification: we just check last 24h for each location; real system should align time windows per feature snapshot.
  const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentIncidents = await prisma.incident.findMany({
    where: { createdAt: { gte: lastDay } },
    select: { latitude: true, longitude: true },
  });
  const positiveSet = new Set<string>(recentIncidents.map((r: { latitude: number; longitude: number }) => key(r)));

  const X = featuresArr.map(f => computeFeaturesVector(f));
  const y = featuresArr.map(f => positiveSet.has(key(f)) ? 1 : 0);

  const nFeatures = X[0].length;
  const weights = new Array(nFeatures + 1).fill(0); // bias + weights

  const lossHistory: number[] = [];
  for (let iter = 0; iter < iterations; iter++) {
    let grad = new Array(nFeatures + 1).fill(0);
    let totalLoss = 0;
    for (let i = 0; i < X.length; i++) {
      const xi = X[i];
      const yi = y[i];
      let z = weights[0];
      for (let j = 0; j < nFeatures; j++) z += weights[j + 1] * xi[j];
      const pred = sigmoid(z);
      totalLoss += -(yi * Math.log(pred + 1e-9) + (1 - yi) * Math.log(1 - pred + 1e-9));
      const error = pred - yi;
      grad[0] += error; // bias
      for (let j = 0; j < nFeatures; j++) grad[j + 1] += error * xi[j];
    }
    // Average
    for (let j = 0; j < grad.length; j++) grad[j] /= X.length;
    totalLoss /= X.length;
    // Update
    for (let j = 0; j < weights.length; j++) weights[j] -= learningRate * grad[j];
    if (iter % 25 === 0 || iter === iterations - 1) lossHistory.push(totalLoss);
  }

  const model: TrainResult = {
    weights,
    featureNames,
    iterations,
    learningRate,
    lossHistory,
    modelVersion: `logreg-v1`,
    trainedAt: new Date().toISOString(),
  };

  await ensureModelsDir();
  await fs.writeFile(MODEL_FILE, JSON.stringify(model, null, 2), 'utf-8');
  return model;
}
