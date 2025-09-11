const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const diseases = [
  {
    name: 'Diarrhea',
    slug: 'diarrhea',
    overview:
      'Diarrhea is loose, watery stools three or more times in a day. It is often caused by infections from contaminated food or water.',
    symptoms: [
      'Loose, watery stools',
      'Abdominal cramps',
      'Fever',
      'Nausea',
    ],
    causes:
      'Infections (viruses, bacteria, parasites) transmitted through contaminated food or water are common causes.',
    prevention: [
      'Drink safe, clean water',
      'Practice good hand hygiene',
      'Cook food thoroughly',
    ],
    treatment:
      'Most cases resolve with rehydration and supportive care. Seek medical attention for severe cases.',
  },
  {
    name: 'Cholera',
    slug: 'cholera',
    overview:
      'Cholera is an acute diarrheal illness caused by infection of the intestine with Vibrio cholerae.',
    symptoms: [
      'Profuse watery diarrhea',
      'Vomiting',
      'Rapid heart rate',
      'Dehydration',
    ],
    causes:
      'Consuming food or water contaminated with Vibrio cholerae bacteria.',
    prevention: [
      'Use safe water and sanitation',
      'Wash hands with soap and water',
      'Cook and store food safely',
    ],
    treatment:
      'Immediate rehydration with oral rehydration solution (ORS); severe cases may require IV fluids and antibiotics.',
  },
  {
    name: 'Typhoid',
    slug: 'typhoid',
    overview:
      'Typhoid fever is a life-threatening illness caused by Salmonella Typhi, spread through contaminated food and water.',
    symptoms: [
      'High fever',
      'Headache',
      'Abdominal pain',
      'Constipation or diarrhea',
    ],
    causes:
      'Ingestion of food or water contaminated with Salmonella Typhi.',
    prevention: [
      'Vaccination where recommended',
      'Drink safe water',
      'Practice good food hygiene',
    ],
    treatment:
      'Antibiotics are the main treatment; follow medical guidance for the full course.',
  },
  {
    name: 'Hepatitis A',
    slug: 'hepatitis-a',
    overview:
      'Hepatitis A is a contagious liver infection transmitted by the fecal-oral route, often via contaminated food or water.',
    symptoms: [
      'Fatigue',
      'Nausea and vomiting',
      'Abdominal pain',
      'Jaundice',
    ],
    causes:
      'Ingestion of food or water contaminated with feces from an infected person.',
    prevention: [
      'Hepatitis A vaccination',
      'Thorough handwashing',
      'Use safe water',
    ],
    treatment:
      'Supportive care — the body usually clears the virus. Seek medical care for severe symptoms.',
  },
];

async function main() {
  for (const d of diseases) {
    try {
      await prisma.disease.upsert({
        where: { slug: d.slug },
        update: d,
        create: d,
      });
      console.log(`Upserted ${d.name}`);
    } catch (e) {
      console.error(`Failed to upsert ${d.name}:`, e.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
