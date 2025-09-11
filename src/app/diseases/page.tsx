import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DiseasesPage() {
  const diseases = await prisma.disease.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold text-center">Water-Borne Diseases</h1>
      <p className="text-center mt-2 text-muted-foreground">Learn about common water-borne illnesses, their symptoms, prevention and treatment.</p>

      <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {diseases.map((disease) => (
          <Link key={disease.id} href={`/diseases/${disease.slug}`} className="group">
            <Card className="hover:shadow-md transition-shadow duration-150">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{disease.name}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">{disease.overview}</CardDescription>
                  </div>
                  <div className="ml-4 text-3xl" aria-hidden>
                    {getEmojiForDisease(disease.slug)}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getEmojiForDisease(slug: string) {
  switch (slug) {
    case 'cholera':
      return '🦠';
    case 'diarrhea':
      return '🚽';
    case 'typhoid':
      return '🤒';
    case 'hepatitis-a':
      return '🩺';
    default:
      return '📚';
  }
}
