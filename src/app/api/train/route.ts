import { NextRequest, NextResponse } from 'next/server';
import { trainLogisticRegression } from '@/lib/prediction/ml/train';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const windowDays = typeof body.windowDays === 'number' ? body.windowDays : 14;
    const iterations = typeof body.iterations === 'number' ? body.iterations : 400;
    const learningRate = typeof body.learningRate === 'number' ? body.learningRate : 0.05;

    const model = await trainLogisticRegression({ windowDays, iterations, learningRate });
    return NextResponse.json({ message: 'Training complete', model });
  } catch (e: any) {
    console.error('Training error', e);
    return NextResponse.json({ error: e.message || 'Training failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ endpoint: 'POST to /api/train to start model training (logistic regression demo).' });
}
