This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database (Prisma)

If you haven't set up the database yet, make sure `DATABASE_URL` in your environment points to a Postgres instance.

Run the following to generate the client, create the initial migration and seed the database with example diseases:

```powershell
pnpm prisma generate; pnpm prisma migrate dev --name init; pnpm run prisma:seed
```

The seed script will upsert example diseases: Cholera, Diarrhea, Typhoid and Hepatitis A.


## Outbreak Prediction & ML Pipeline

This project includes a two-tier outbreak prediction system:

1. Heuristic Scoring (baseline)
	- Combines recent symptom trends, water quality normalization, incident rate, and seasonal factor.
	- Produces `riskScore` (0-1) + category (Low/Moderate/High).

2. Logistic Regression (demo ML model)
	- Trains on current feature snapshots vs. whether a location had an incident in the last 24h (simplified label).
	- Stored at `models/logreg-model.json`.
	- Fallbacks to heuristic if model file missing.

### Key Data Models
- `WaterQualityReport` – water/sanitation metrics
- `SymptomTrend` – daily aggregated symptom counts
- `OutbreakPrediction` – persisted predictions with feature snapshot & explanation

### Generating Predictions
POST `/api/predictions` body (optional):
```
{ "windowDays": 14, "targetOffsetDays": 1 }
```
GET `/api/predictions?days=1&limit=100`

### Training the ML Model
POST `/api/train` (optional body):
```
{ "windowDays": 14, "iterations": 400, "learningRate": 0.05 }
```
Successful training writes weights file, automatically used on next prediction generation.

### Model File Format (logreg)
```
{
  "weights": [bias, w1, w2, ...],
  "featureNames": ["incidentRatePerDay","recentSymptomScore","waterQualityScore","seasonalFactor","lastReportAgeFrac"],
  "modelVersion": "logreg-v1",
  "trainedAt": "ISO timestamp"
}
```

### Next Steps Toward Production ML
- Introduce outcome labeling table (future incident counts per location)
- Time-aligned sliding feature windows & lag features
- Geospatial clustering (H3 or geohash) to reduce sparsity
- Model monitoring: calibration, drift checks
- Export endpoint for offline training (Python / notebooks)

### Disclaimer
Current ML implementation is a minimal demonstration. Not validated for clinical or public health decision making. Replace with a rigorously trained & validated model before real-world use.
### Running locally (Tailwind)

This project uses Tailwind CSS (v4) via PostCSS. If styles don't appear, ensure dependencies are installed and run the dev server:

```powershell
pnpm install
pnpm dev
```

If your editor flags `@tailwind` or `@apply` as unknown rules, that's the CSS linter — the build will process them correctly when the dev server is running.

## AI Chat Assistant

An AI Health Assistant is available to answer questions about water-borne diseases and can optionally analyze uploaded images.

Features:
- Floating chat widget (bottom-right) on every page
- Full-page experience at `/chat`
- Streaming responses from `/api/chat`
- Optional image upload (<=10MB, any standard image MIME type)

Usage:
1. Click the circular chat button (message icon) to open/close the widget.
2. Type your question or click the image icon to attach an image.
3. Press Enter or the send icon.
4. Visit `/chat` for a larger focused view.

Notes:
- Chat history is in-memory only and resets on reload (can be persisted later via localStorage or a DB table).
- The assistant is informational only and not a medical professional. Always seek qualified medical advice for diagnosis or treatment.

Future Enhancements (ideas):
- LocalStorage or server persistence of conversations
- Auth-based user conversation history
- Markdown rendering & citations
- Accessibility focus trap and ARIA live region

