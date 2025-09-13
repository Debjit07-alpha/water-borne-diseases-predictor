import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const disease = await prisma.disease.findUnique({
      where: { slug: params.slug },
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
