import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DiseasePage({
  params,
}: {
  params: { slug: string };
}) {
  const disease = await prisma.disease.findUnique({
    where: { slug: params.slug },
  });

  if (!disease) return notFound();

  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold">{disease.name}</h1>
          <p className="mt-2 text-muted-foreground">{disease.overview}</p>
        </div>
        <div className="text-4xl ml-4" aria-hidden>
          {getEmojiForDisease(disease.slug)}
        </div>
      </div>

      <nav className="mt-6">
        <Link href="/diseases" className="text-sm text-primary hover:underline">← Back to all diseases</Link>
      </nav>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold">Symptoms</h2>
          <ul className="mt-2 ml-6 list-disc text-muted-foreground">
            {disease.symptoms.map((symptom: string) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Causes & Transmission</h2>
          <p className="mt-2 text-muted-foreground">{disease.causes}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Prevention</h2>
          <ul className="mt-2 ml-6 list-disc text-muted-foreground">
            {disease.prevention.map((step: string) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Treatment</h2>
          <p className="mt-2 text-muted-foreground">{disease.treatment}</p>
        </section>
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
