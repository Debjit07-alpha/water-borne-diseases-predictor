export type HighRiskZone = {
  lat: number;
  lng: number;
  name: string;
  description: string;
  primaryWaterSource: string;
  riskAnalysis: {
    overallRisk: "High" | "Moderate" | "Low";
    contaminationLevel: string;
    primaryRiskFactors: string[];
  };
  commonDiseases: string[];
  preventionAndCure: {
    mitigation: string[];
    firstResponse: string[];
  };
};

export const highRiskZones: HighRiskZone[] = [
  // Riverine Villages along Brahmaputra, Assam
  {
    lat: 26.18,
    lng: 91.75,
    name: "Majuli River Village, Assam",
    description: "A small, flood-prone community of 500 people on the banks of the Subansiri river, heavily reliant on agriculture and fishing.",
    primaryWaterSource: "Untreated River Water",
    riskAnalysis: {
      overallRisk: "High",
      contaminationLevel: "E. coli presence: High, Turbidity: High",
      primaryRiskFactors: [
        "Frequent flooding contaminates wells.",
        "Lack of sanitation facilities leads to fecal runoff.",
        "No water purification systems in place.",
      ],
    },
    commonDiseases: ["Cholera", "Dysentery", "Typhoid Fever"],
    preventionAndCure: {
      mitigation: [
        "ALWAYS boil water for at least 1 minute before drinking.",
        "Use chlorine tablets if boiling is not possible.",
        "Wash hands with soap after using the toilet and before eating.",
        "Safely dispose of human waste away from water sources.",
      ],
      firstResponse: [
        "Symptoms like diarrhea, vomiting, or fever require immediate action.",
        "Prepare Oral Rehydration Solution (ORS) by mixing salt and sugar in clean water and drink frequently.",
        "Seek immediate medical help at the nearest health center. Do not delay.",
      ],
    },
  },
  {
    lat: 26.75,
    lng: 94.22,
    name: "Jorhat Riverbank Settlement",
    description: "A densely populated settlement near Jorhat, where the proximity to the river and seasonal floods pose significant health risks.",
    primaryWaterSource: "Community Well",
    riskAnalysis: {
      overallRisk: "High",
      contaminationLevel: "Arsenic Risk: Moderate, Coliforms: High",
      primaryRiskFactors: ["Surface runoff from agricultural fields.", "High water table leading to well contamination.", "Overcrowding."],
    },
    commonDiseases: ["Cholera", "Hepatitis A", "E. coli infections"],
    preventionAndCure: {
      mitigation: ["Test well water regularly.", "Maintain a safe distance between toilets and water sources.", "Promote household water treatment."],
      firstResponse: ["Isolate sick individuals to prevent spread.", "Administer ORS immediately.", "Report to local health authorities."],
    },
  },

  // Tea Garden Settlements, Assam
  {
    lat: 27.4,
    lng: 95.0,
    name: "Tinsukia Tea Garden Area",
    description: "A rural area surrounding a major tea estate, with a large worker population facing sanitation and safe water access challenges.",
    primaryWaterSource: "Natural Springs",
    riskAnalysis: {
      overallRisk: "Moderate",
      contaminationLevel: "Bacteriological contamination: Moderate",
      primaryRiskFactors: ["Poorly protected springs.", "Inadequate sanitation infrastructure for the population density.", "Limited health education."],
    },
    commonDiseases: ["Giardiasis", "Leptospirosis"],
    preventionAndCure: {
      mitigation: ["Protect spring sources from animal and human contamination.", "Implement community-led total sanitation programs.", "Distribute water purification tablets."],
      firstResponse: ["Early diagnosis and treatment are key.", "Ensure continuous intake of fluids.", "Visit the estate's medical center without delay."],
    },
  },

  // Hilly and Remote Areas
  {
    lat: 23.3,
    lng: 91.45,
    name: "South Tripura Hill Village",
    description: "A remote village in the hilly terrain of Tripura, where the community depends on untreated streams for all their water needs.",
    primaryWaterSource: "Untreated Natural Streams",
    riskAnalysis: {
      overallRisk: "High",
      contaminationLevel: "Turbidity: High, Pathogen presence: High",
      primaryRiskFactors: ["Dependence on surface water without treatment.", "Open defecation practices in upstream areas.", "Lack of access to healthcare facilities."],
    },
    commonDiseases: ["Typhoid Fever", "Cryptosporidiosis"],
    preventionAndCure: {
      mitigation: ["Construct sand filters for community water points.", "Advocate for the construction of toilets.", "Conduct hygiene promotion sessions."],
      firstResponse: ["Use ORS and zinc supplements for children with diarrhea.", "Boil all drinking water, especially for vulnerable individuals.", "Transport the patient to the nearest town hospital if symptoms worsen."],
    },
  },
  // Goalpara district, Assam
  {
    lat: 26.17,
    lng: 90.62,
    name: "Goalpara Floodplain Village",
    description: "A village in a known outbreak zone in Goalpara, highly susceptible to cholera and dysentery during the monsoon season.",
    primaryWaterSource: "Pond and River Water",
    riskAnalysis: {
      overallRisk: "High",
      contaminationLevel: "Vibrio cholerae risk: High",
      primaryRiskFactors: ["Documented historical outbreaks.", "Stagnant water bodies used for drinking.", "Poor sanitation coverage."],
    },
    commonDiseases: ["Cholera", "Dysentery"],
    preventionAndCure: {
      mitigation: ["Vaccination campaigns for cholera.", "Emergency water purification during floods.", "Establishment of rapid response teams."],
      firstResponse: ["Immediate rehydration is critical.", "Isolate the patient's waste.", "Alert the district surveillance unit at the first sign of an outbreak."],
    },
  },
];
