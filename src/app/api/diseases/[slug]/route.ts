import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const disease = await prisma.disease.findUnique({
      where: { slug },
    });
    
    if (!disease) {
      return NextResponse.json(
        { error: 'Disease not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(disease);
  } catch (error) {
    console.error('Error fetching disease:', error);
    return NextResponse.json(
      { error: 'Failed to fetch disease' },
      { status: 500 }
    );
  }
}
