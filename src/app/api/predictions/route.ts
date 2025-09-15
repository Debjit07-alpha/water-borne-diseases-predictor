import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePredictions } from "@/lib/prediction/generatePredictions";

// GET /api/predictions?days=1&limit=100
// Returns latest predictions for each location for given future offset (targetDate)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '200', 10);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    targetDate.setHours(0,0,0,0);

    const preds = await prisma.outbreakPrediction.findMany({
      where: { targetDate: targetDate },
      orderBy: { riskScore: 'desc' },
      take: limit,
    });

    return NextResponse.json(preds);
  } catch (e) {
    console.error('Error fetching predictions', e);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}

// POST /api/predictions  { windowDays?: number, targetOffsetDays?: number }
// Triggers generation run.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const windowDays = typeof body.windowDays === 'number' ? body.windowDays : 14;
    const targetOffsetDays = typeof body.targetOffsetDays === 'number' ? body.targetOffsetDays : 1;

    const created = await generatePredictions(windowDays, targetOffsetDays);

    return NextResponse.json({ created: created.length, predictions: created });
  } catch (e) {
    console.error('Error generating predictions', e);
    return NextResponse.json({ error: 'Failed to generate predictions' }, { status: 500 });
  }
}
