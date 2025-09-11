import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const disease = await prisma.disease.findUnique({
      where: { slug: params.slug },
    });

    if (!disease) {
      return NextResponse.json({ error: "Disease not found" }, { status: 404 });
    }

    return NextResponse.json(disease);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
