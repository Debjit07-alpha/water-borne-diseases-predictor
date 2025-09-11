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
      "There is no specific treatment for hepatitis A. Your body will clear the hepatitis A virus on its own. In most cases, the liver heals completely in a month or two with no lasting damage.",
  },
];

async function main() {
  for (const disease of diseases) {
    await prisma.disease.create({
      data: disease,
    });
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
