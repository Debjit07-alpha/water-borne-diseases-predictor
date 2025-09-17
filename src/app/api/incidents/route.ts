import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

// Ensure Prisma runs in Node runtime (not Edge)
export const runtime = 'nodejs';

const incidentSchema = z.object({
  disease: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  details: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured. Please set it in .env and run migrations." },
        { status: 503 }
      );
    }
    const body = await req.json();
    const { disease, latitude, longitude, details } = incidentSchema.parse(body);

    const incident = await prisma.incident.create({
      data: {
        disease,
        latitude,
        longitude,
        details,
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(incidents);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
