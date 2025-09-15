import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const diseases = [
  {
    name: "Diarrhea",
    slug: "diarrhea",
    overview:
      "Diarrhea is loose, watery stools three or more times in a day. It is a common problem that may be caused by a variety of factors, but it is often the result of an intestinal infection.",
    symptoms: [
      "Loose, watery stools",
      "Abdominal cramps",
      "Abdominal pain",
      "Fever",
      "Bloating",
      "Nausea",
    ],
    causes:
      "Diarrhea is caused by a number of viruses, bacteria, and parasites. These germs are most often spread through contaminated food or water.",
    prevention: [
      "Drink safe, clean water.",
      "Practice good hygiene, including frequent handwashing.",
      "Eat well-cooked food.",
    ],
    treatment:
      "Most cases of diarrhea clear on their own within a couple of days without treatment. The most important thing is to prevent dehydration by drinking plenty of fluids.",
  },
  {
    name: "Cholera",
    slug: "cholera",
    overview:
      "Cholera is an acute diarrheal illness caused by infection of the intestine with the bacterium Vibrio cholerae.",
    symptoms: [
      "Profuse watery diarrhea",
      "Vomiting",
      "Leg cramps",
      "Rapid heart rate",
      "Loss of skin elasticity",
    ],
    causes:
      "Cholera is caused by eating food or drinking water contaminated with a bacterium called Vibrio cholerae.",
    prevention: [
      "Drink and use safe water.",
      "Wash your hands often with soap and safe water.",
      "Use latrines or bury your feces; do not defecate in any body of water.",
      "Cook food well, keep it covered, eat it hot, and peel fruits and vegetables.",
    ],
    treatment:
      "Cholera can be simply and successfully treated by immediate replacement of the fluid and salts lost through diarrhea. Patients can be treated with oral rehydration solution (ORS).",
  },
  {
    name: "Typhoid",
    slug: "typhoid",
    overview:
      "Typhoid fever is a life-threatening illness caused by the bacterium Salmonella Typhi. It is usually spread through contaminated food or water.",
    symptoms: [
      "High fever",
      "Headache",
      "Stomach pain",
      "Constipation or diarrhea",
      "Rash",
    ],
    causes:
      "Typhoid fever is caused by Salmonella Typhi bacteria. It is spread through contaminated food and water and close contact with an infected person.",
    prevention: [
      "Get vaccinated against typhoid fever.",
      "Drink and use safe water.",
      "Avoid eating from street vendors.",
      "Eat food that is thoroughly cooked and still hot.",
    ],
    treatment:
      "Typhoid fever is treated with antibiotics. It is important to complete the full course of antibiotics to prevent relapse.",
  },
  {
    name: "Hepatitis A",
    slug: "hepatitis-a",
    overview:
      "Hepatitis A is a highly contagious liver infection caused by the hepatitis A virus. It can range from a mild illness lasting a few weeks to a severe illness lasting several months.",
    symptoms: [
      "Fatigue",
      "Nausea and vomiting",
      "Abdominal pain or discomfort",
      "Clay-colored bowel movements",
      "Loss of appetite",
      "Dark urine",
      "Jaundice",
    ],
    causes:
      "The hepatitis A virus is transmitted primarily by the fecal-oral route; that is, when an uninfected person ingests food or water that has been contaminated with the feces of an infected person.",
    prevention: [
      "Get the hepatitis A vaccine.",
      "Always wash your hands thoroughly after using the bathroom and before preparing or eating food.",
      "Use bottled water in places where the water supply might be unsafe.",
    ],
    treatment:
      "There is no specific treatment for hepatitis A. Your body will clear the hepatitis A virus on its own. In most cases, a person's immune system will clear the virus from the body.",
  },
  {
    name: "Dysentery",
    slug: "dysentery",
    overview:
      "Dysentery is an intestinal inflammation, especially in the colon, that can lead to severe diarrhea with mucus or blood in the feces.",
    symptoms: [
      "Bloody diarrhea",
      "Stomach cramps and pain",
      "Nausea and vomiting",
      "Fever",
    ],
    causes:
      "Dysentery is usually caused by a bacterial or protozoan infection, most commonly from the Shigella bacterium (shigellosis) or an amoeba (amoebiasis). It spreads through poor hygiene, such as contaminated food and water.",
    prevention: [
      "Practice good hand hygiene by washing hands with soap and water.",
      "Drink water from a safe source or boil it before drinking.",
      "Avoid eating raw food and ensure all food is cooked thoroughly.",
    ],
    treatment:
      "Mild dysentery can be treated with rest and plenty of fluids to prevent dehydration. For more severe cases, antibiotics may be necessary. Medical advice should be sought for proper diagnosis and treatment.",
  },
  {
    name: "Giardiasis",
    slug: "giardiasis",
    overview:
      "Giardiasis is a diarrheal disease caused by the microscopic parasite Giardia duodenalis. Once a person or animal has been infected with Giardia, the parasite lives in the intestines and is passed in feces.",
    symptoms: [
      "Watery, sometimes foul-smelling diarrhea",
      "Fatigue",
      "Abdominal cramps and bloating",
      "Gas",
      "Nausea",
      "Weight loss",
    ],
    causes:
      "Giardiasis is caused by the Giardia parasite, which is found in contaminated water, food, or soil. It can also be transmitted through person-to-person contact.",
    prevention: [
      "Avoid swallowing water from pools, lakes, rivers, or streams.",
      "Wash hands thoroughly with soap and water.",
      "Use a water filter or boil water before drinking in high-risk areas.",
    ],
    treatment:
      "Several drugs can be used to treat giardiasis, such as metronidazole. Treatment is usually effective, but it's important to complete the full course of medication as prescribed by a healthcare provider.",
  },
  {
    name: "Salmonellosis",
    slug: "salmonellosis",
    overview:
      "Salmonellosis is a bacterial infection caused by Salmonella bacteria. It typically affects the intestinal tract and can cause food poisoning. Most people develop diarrhea, fever, and stomach cramps 6 to 72 hours after infection.",
    symptoms: [
      "Diarrhea",
      "Fever",
      "Stomach cramps",
      "Nausea",
      "Vomiting",
      "Headache",
      "Muscle aches",
    ],
    causes:
      "Salmonellosis is caused by consuming food or water contaminated with Salmonella bacteria. Common sources include undercooked eggs, poultry, meat, and contaminated fruits and vegetables. It can also spread through contact with infected animals.",
    prevention: [
      "Cook eggs, poultry, and meat thoroughly.",
      "Avoid eating raw or undercooked eggs and meat.",
      "Wash hands thoroughly after handling raw meat or eggs.",
      "Keep raw meat separate from other foods.",
      "Refrigerate food promptly.",
      "Wash fruits and vegetables before eating.",
    ],
    treatment:
      "Most people recover without treatment in 4 to 7 days. However, severe dehydration may require hospitalization for IV fluids. Antibiotics are usually not recommended as they can prolong bacterial shedding.",
  },
  {
    name: "Leptospirosis",
    slug: "leptospirosis",
    overview:
      "Leptospirosis is a bacterial infection caused by Leptospira bacteria. It can range from mild flu-like illness to severe disease affecting the kidneys, liver, brain, lungs, or heart. It is transmitted through contact with contaminated water or soil.",
    symptoms: [
      "High fever",
      "Headache",
      "Chills",
      "Muscle aches",
      "Vomiting",
      "Jaundice (yellow skin and eyes)",
      "Red eyes",
      "Abdominal pain",
      "Diarrhea",
      "Rash",
    ],
    causes:
      "Leptospirosis is caused by Leptospira bacteria found in contaminated water, soil, or food. It enters the body through cuts or abrasions in the skin, or through mucous membranes of the mouth, nose, and eyes. Common sources include flood water, contaminated rivers, and soil contaminated with animal urine.",
    prevention: [
      "Avoid swimming or wading in potentially contaminated water.",
      "Wear protective clothing when working in high-risk environments.",
      "Cover cuts and abrasions with waterproof bandages.",
      "Avoid drinking contaminated water.",
      "Control rodents in and around the home.",
      "Wear shoes to avoid walking barefoot in contaminated areas.",
    ],
    treatment:
      "Leptospirosis is treated with antibiotics such as penicillin or doxycycline. Early treatment is important to prevent complications. Severe cases may require hospitalization for IV antibiotics and supportive care.",
  },
];

async function main() {
  // Seed diseases (idempotent-ish: ignore if exists)
  for (const disease of diseases) {
    await prisma.disease.upsert({
      where: { name: disease.name },
      update: {},
      create: disease,
    });
  }

  // Sample geo points (simulate different localities)
  const locations = [
    { latitude: 26.115, longitude: 91.708 }, // Guwahati
    { latitude: 25.675, longitude: 94.108 }, // Dimapur
    { latitude: 27.475, longitude: 95.000 }, // Dibrugarh region
  ];

  // Seed incidents randomly
  for (const loc of locations) {
    const incidentCount = Math.floor(Math.random() * 4) + 2; // 2-5
    for (let i = 0; i < incidentCount; i++) {
      const disease = diseases[Math.floor(Math.random() * diseases.length)].name;
      const createdAt = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000);
      await prisma.incident.create({
        data: {
          latitude: loc.latitude,
          longitude: loc.longitude,
            disease,
            details: `Auto seeded incident for ${disease}`,
            createdAt,
        },
      });
    }
  }

  // Seed water quality reports
  for (const loc of locations) {
    const reportCount = 3;
    for (let i = 0; i < reportCount; i++) {
      const collectedAt = new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000);
      await prisma.waterQualityReport.create({
        data: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          coliformCFU: 100 + Math.floor(Math.random() * 400),
          turbidity: parseFloat((Math.random() * 5 + 1).toFixed(2)),
          dissolvedOxygen: parseFloat((Math.random() * 4 + 4).toFixed(2)),
          ph: parseFloat((6 + Math.random() * 2.5).toFixed(2)),
          temperature: parseFloat((24 + Math.random() * 8).toFixed(1)),
          collectedAt,
          notes: 'Seeded sample water report',
        },
      });
    }
  }

  // Seed symptom trends last 7 days
  for (const loc of locations) {
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(0,0,0,0);
      await prisma.symptomTrend.create({
        data: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          date,
          diarrheaCount: Math.floor(Math.random() * 10),
          vomitingCount: Math.floor(Math.random() * 6),
          dehydrationCount: Math.floor(Math.random() * 5),
          feverCount: Math.floor(Math.random() * 8),
          abdominalPainCount: Math.floor(Math.random() * 4),
        },
      });
    }
  }

  console.log('Seed complete: diseases, incidents, water quality, symptom trends');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
