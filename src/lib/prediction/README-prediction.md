# Outbreak Prediction Heuristic Pipeline

This directory contains a first-step heuristic (non-ML model) pipeline to produce outbreak risk predictions for water-borne diseases. It prepares the data foundation so that a real ML model (e.g. gradient boosted trees, temporal deep learning) can be plugged in later.

## Data Models

Added Prisma models:
- `WaterQualityReport` – raw environmental signals (coliform, turbidity, pH, DO, temperature)
- `SymptomTrend` – daily aggregated symptom counts per (lat,lng)
- `OutbreakPrediction` – stored risk outputs for visualization & audit

## Feature Engineering
Implemented in `featureEngineering.ts`:
- Rolling incident counts (windowDays default 14)
- Incident rate per day
- Aggregated weighted symptom score (weights in SYMPTOM_WEIGHTS)
- Water quality composite score (normalized 0..1; higher = worse)
- Seasonal factor (monsoon boost)
- Recency of last water quality report (penalizes stale data)

## Scoring Heuristic
`model.ts` defines a weighted linear combination -> riskScore 0..1 then mapped:
- >= 0.65: High
- >= 0.40: Moderate
- else: Low

## Prediction Generation
`generatePredictions.ts`:
1. Collect all distinct locations from incidents, water quality, symptom trends.
2. Build features for each.
3. Score & store an `OutbreakPrediction` row with feature snapshot + text explanation.

## API Endpoints
- POST `/api/predictions` { windowDays?, targetOffsetDays? } -> generates predictions
- GET `/api/predictions?days=1&limit=200` -> fetch predictions for given future target
- POST `/api/water-quality` -> ingest new water sample
- GET `/api/water-quality?limit=100`
- POST `/api/symptoms` -> ingest new symptom trend row
- GET `/api/symptoms?limit=100`

## Extending to Real ML
Replace `scoreLocation` with a model output:
1. Export training dataset builder: dump feature rows + observed label (e.g. future incident spike) to CSV.
2. Train offline (Python: XGBoost / LightGBM / TemporalFusionTransformer, etc.).
3. Serialize model (ONNX or JSON) and load inside `scoreLocation`.
4. Add calibration & SHAP explanation generation.

## Operational Notes
- Schedule generation (cron / serverless) to refresh predictions multiple times per day.
- Add retention policy (e.g. prune predictions older than 30 days).
- Add indexes (already present) to accelerate queries.
- Implement deduplication/upsert if running many times per day for same (location,targetDate,version).

## Next Steps (Suggested)
- Introduce spatial clustering (grid / H3) instead of exact lat/lng equality.
- Add rainfall & temperature forecast ingestion.
- Implement label definition (future 3-day incident rate increase) to allow supervised model.
- Add metrics endpoint (AUC, precision, recall) once a real model is in place.
- UI: overlay prediction intensities & confidence intervals.
