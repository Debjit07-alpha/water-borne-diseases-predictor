import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const diseases = await prisma.disease.findMany({ 
      orderBy: { name: 'asc' } 
    });
    
    return NextResponse.json(diseases);
  } catch (error) {
    console.error('Error fetching diseases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diseases' },
      { status: 500 }
    );
  }
}
