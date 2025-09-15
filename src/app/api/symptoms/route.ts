import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as z from 'zod';

const trendSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  date: z.string().datetime().optional(),
  diarrheaCount: z.number().int().nonnegative().optional(),
  vomitingCount: z.number().int().nonnegative().optional(),
  dehydrationCount: z.number().int().nonnegative().optional(),
  feverCount: z.number().int().nonnegative().optional(),
  abdominalPainCount: z.number().int().nonnegative().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = trendSchema.parse(body);
    const created = await prisma.symptomTrend.create({
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        date: data.date ? new Date(data.date) : new Date(new Date().setHours(0,0,0,0)),
        diarrheaCount: data.diarrheaCount || 0,
        vomitingCount: data.vomitingCount || 0,
        dehydrationCount: data.dehydrationCount || 0,
        feverCount: data.feverCount || 0,
        abdominalPainCount: data.abdominalPainCount || 0,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    console.error('Symptom trend POST error', e);
    return NextResponse.json({ error: 'Failed to create symptom trend' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const trends = await prisma.symptomTrend.findMany({
      orderBy: { date: 'desc' },
      take: limit,
    });
    return NextResponse.json(trends);
  } catch (e) {
    console.error('Symptom trend GET error', e);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}
