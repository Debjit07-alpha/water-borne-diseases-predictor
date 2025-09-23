const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const diseases = [
  {
    name: 'Cholera',
    overview: 'A severe diarrheal disease caused by Vibrio cholerae bacteria. Cholera spreads through contaminated water and food, particularly in areas with poor sanitation. It can cause rapid dehydration and death if untreated, but is easily preventable and treatable.',
    symptoms: ['Watery diarrhea', 'Vomiting', 'Rapid dehydration', 'Muscle cramps', 'Shock', 'Low blood pressure'],
    causes: 'Caused by Vibrio cholerae bacteria found in contaminated water sources, particularly in areas with poor sanitation. The bacteria produce toxins that cause massive fluid loss through diarrhea.',
    prevention: ['Drink safe, boiled or bottled water', 'Eat hot, fully cooked food', 'Avoid raw or undercooked seafood', 'Practice good hand hygiene', 'Use proper sanitation facilities', 'Get vaccinated if traveling to high-risk areas'],
    treatment: 'Immediate oral rehydration therapy (ORT) is the primary treatment. Severe cases may require intravenous fluids and antibiotics like doxycycline or azithromycin. Early treatment has a very high success rate.',
    slug: 'cholera'
  },
  {
    name: 'Diarrhea',
    overview: 'Frequent loose, watery stools that can lead to dehydration and electrolyte imbalance. While often mild, severe diarrhea can be life-threatening, especially in children and elderly people.',
    symptoms: ['Loose, watery stools', 'Abdominal cramps', 'Nausea', 'Bloating', 'Dehydration', 'Fever (in some cases)'],
    causes: 'Can be caused by various bacteria (E. coli, Salmonella), viruses (rotavirus, norovirus), parasites, or consuming contaminated water and food. Poor hygiene and sanitation increase risk.',
    prevention: ['Drink clean, safe water', 'Wash hands frequently with soap', 'Eat properly cooked food', 'Avoid street food in high-risk areas', 'Use proper food storage', 'Maintain good personal hygiene'],
    treatment: 'Oral rehydration therapy is key. Rest and gradual return to normal diet. Medical attention needed if symptoms persist more than 2 days or if signs of severe dehydration appear.',
    slug: 'diarrhea'
  },
  {
    name: 'Typhoid',
    overview: 'A bacterial infection caused by Salmonella typhi that affects the whole body. It spreads through contaminated food and water and can be fatal if not treated promptly with antibiotics.',
    symptoms: ['High fever (up to 104°F)', 'Weakness and fatigue', 'Stomach pain', 'Headache', 'Loss of appetite', 'Rose-colored rash on chest'],
    causes: 'Caused by Salmonella typhi bacteria spread through contaminated food and water, often from poor sanitation. Humans are the only carriers of this bacteria.',
    prevention: ['Get vaccinated before travel', 'Drink bottled or boiled water', 'Eat hot, fully cooked food', 'Avoid raw fruits and vegetables', 'Practice good hand hygiene', 'Use proper sanitation'],
    treatment: 'Antibiotics are essential - commonly ciprofloxacin, azithromycin, or ceftriaxone depending on resistance patterns. Supportive care includes rest, fluids, and proper nutrition. Hospitalization may be required.',
    slug: 'typhoid'
  },
  {
    name: 'Hepatitis A',
    overview: 'A viral infection that affects the liver, causing inflammation. It spreads through contaminated food and water or close contact with infected individuals. Unlike other forms of hepatitis, it does not cause chronic infection.',
    symptoms: ['Fatigue and weakness', 'Nausea and vomiting', 'Abdominal pain', 'Jaundice (yellowing of skin and eyes)', 'Dark urine', 'Loss of appetite'],
    causes: 'Caused by the hepatitis A virus (HAV) transmitted through ingestion of contaminated food and water or through close contact with infected persons.',
    prevention: ['Get vaccinated', 'Practice good hand hygiene', 'Drink safe water', 'Eat properly cooked food', 'Avoid raw or undercooked shellfish', 'Maintain good sanitation'],
    treatment: 'No specific treatment - supportive care including rest, adequate nutrition, and avoiding alcohol. Most people recover completely within a few months.',
    slug: 'hepatitis-a'
  },
  {
    name: 'Dysentery',
    overview: 'Severe intestinal inflammation causing bloody diarrhea. Can be caused by bacteria (shigellosis) or parasites (amebic dysentery). It\'s more serious than regular diarrhea and requires prompt medical attention.',
    symptoms: ['Bloody diarrhea', 'Severe stomach cramps', 'Fever', 'Nausea and vomiting', 'Dehydration', 'Urgency to defecate'],
    causes: 'Caused by Shigella bacteria or Entamoeba histolytica parasite, spread through contaminated water, food, or direct contact with infected persons.',
    prevention: ['Drink safe water', 'Practice good hand hygiene', 'Eat hot, well-cooked food', 'Avoid raw vegetables in high-risk areas', 'Use proper sanitation facilities', 'Avoid swimming in contaminated water'],
    treatment: 'Antibiotics for bacterial dysentery (ciprofloxacin, azithromycin). Antiparasitic drugs for amebic dysentery. Fluid replacement therapy and rest are essential.',
    slug: 'dysentery'
  },
  {
    name: 'Giardiasis',
    overview: 'A parasitic infection of the small intestine caused by Giardia lamblia. It\'s one of the most common waterborne diseases worldwide and can cause prolonged symptoms if untreated.',
    symptoms: ['Watery diarrhea', 'Fatigue', 'Abdominal cramps', 'Excessive gas', 'Greasy stools', 'Weight loss'],
    causes: 'Caused by Giardia lamblia parasite found in contaminated water sources. The parasite forms cysts that can survive in water for months.',
    prevention: ['Avoid drinking untreated water', 'Use water filters or purification tablets', 'Practice good hand hygiene', 'Avoid swallowing water while swimming', 'Be cautious when traveling'],
    treatment: 'Antiparasitic medications such as metronidazole, tinidazole, or nitazoxanide. Treatment duration is typically 5-7 days.',
    slug: 'giardiasis'
  },
  {
    name: 'Salmonellosis',
    overview: 'Bacterial food poisoning affecting the intestinal tract. Most people recover without treatment, but some cases can be severe, especially in young children, elderly, and immunocompromised individuals.',
    symptoms: ['Diarrhea', 'Fever', 'Stomach cramps', 'Nausea and vomiting', 'Headache', 'Muscle aches'],
    causes: 'Caused by Salmonella bacteria found in contaminated food (especially eggs, poultry, meat) and water. Can also spread through contact with infected animals.',
    prevention: ['Cook food thoroughly', 'Refrigerate food promptly', 'Avoid cross-contamination', 'Wash hands after handling raw meat', 'Drink pasteurized dairy products', 'Avoid raw eggs'],
    treatment: 'Usually supportive care with fluids and rest. Antibiotics are typically not recommended as they may prolong bacterial shedding. Severe cases may require hospitalization.',
    slug: 'salmonellosis'
  },
  {
    name: 'Leptospirosis',
    overview: 'A bacterial infection that affects kidneys, liver, and other organs. It\'s transmitted through contact with water or soil contaminated with infected animal urine. Can range from mild to life-threatening.',
    symptoms: ['High fever', 'Severe headache', 'Muscle aches', 'Jaundice', 'Red eyes', 'Kidney or liver failure (severe cases)'],
    causes: 'Caused by Leptospira bacteria found in water and soil contaminated with urine from infected animals like rats, cattle, and dogs.',
    prevention: ['Avoid contaminated water', 'Wear protective clothing in high-risk areas', 'Control rodent populations', 'Avoid swimming in potentially contaminated water', 'Protect cuts and wounds'],
    treatment: 'Antibiotics such as penicillin, doxycycline, or azithromycin. Early treatment is crucial. Severe cases may require hospitalization and intensive care.',
    slug: 'leptospirosis'
  }
];

async function main() {
  console.log('Seeding diseases...');

  for (const disease of diseases) {
    const existingDisease = await prisma.disease.findUnique({
      where: { slug: disease.slug }
    });

    if (!existingDisease) {
      await prisma.disease.create({
        data: disease
      });
      console.log(`Created disease: ${disease.name}`);
    } else {
      console.log(`Disease already exists: ${disease.name}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding diseases:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });