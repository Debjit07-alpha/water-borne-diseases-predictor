import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as z from 'zod';

const waterSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  coliformCFU: z.number().int().nonnegative().optional(),
  turbidity: z.number().nonnegative().optional(),
  dissolvedOxygen: z.number().nonnegative().optional(),
  ph: z.number().min(0).max(14).optional(),
  temperature: z.number().optional(),
  notes: z.string().max(500).optional(),
  collectedAt: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = waterSchema.parse(body);
    const created = await prisma.waterQualityReport.create({
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        coliformCFU: data.coliformCFU,
        turbidity: data.turbidity,
        dissolvedOxygen: data.dissolvedOxygen,
        ph: data.ph,
        temperature: data.temperature,
        notes: data.notes,
        collectedAt: data.collectedAt ? new Date(data.collectedAt) : undefined,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    console.error('Water quality POST error', e);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const reports = await prisma.waterQualityReport.findMany({
      orderBy: { collectedAt: 'desc' },
      take: limit,
    });
    return NextResponse.json(reports);
  } catch (e) {
    console.error('Water quality GET error', e);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
