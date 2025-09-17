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

  // New Moderate Risk Area - Dibrugarh University Area
  {
    lat: 27.48,
    lng: 94.91,
    name: "Dibrugarh University Campus Area, Assam",
    description: "A semi-urban educational hub with mixed water sources, where poor waste management during monsoon increases contamination risks.",
    primaryWaterSource: "Bore Wells and Municipal Supply",
    riskAnalysis: {
      overallRisk: "Moderate",
      contaminationLevel: "Coliforms: Moderate, Nitrate: Low",
      primaryRiskFactors: ["Seasonal waterlogging in low-lying areas.", "Cross-contamination from septic tanks during floods.", "Inconsistent municipal water quality monitoring."],
    },
    commonDiseases: ["Hepatitis A", "Gastroenteritis", "Typhoid Fever"],
    preventionAndCure: {
      mitigation: ["Regular water quality testing of bore wells.", "Improved drainage systems around campus.", "Health awareness programs for students and staff."],
      firstResponse: ["Immediate medical consultation for persistent symptoms.", "Use boiled or bottled water during monsoon season.", "Report waterborne illness clusters to campus health center."],
    },
  },

  // New Moderate Risk Area - Shillong Peri-Urban
  {
    lat: 25.57,
    lng: 91.88,
    name: "Shillong Peri-Urban Settlement, Meghalaya",
    description: "A rapidly growing peri-urban area around Shillong with mixed infrastructure, where groundwater contamination from unregulated development poses moderate risks.",
    primaryWaterSource: "Groundwater and Protected Springs",
    riskAnalysis: {
      overallRisk: "Moderate",
      contaminationLevel: "Bacteriological: Moderate, Chemical: Low",
      primaryRiskFactors: ["Unregulated construction affecting groundwater.", "Proximity to solid waste dumping sites.", "Seasonal variation in water quality."],
    },
    commonDiseases: ["Diarrhea", "Gastroenteritis", "Skin infections"],
    preventionAndCure: {
      mitigation: ["Community-based water quality monitoring.", "Proper solid waste management systems.", "Protection of spring water sources."],
      firstResponse: ["Early treatment for gastrointestinal symptoms.", "Use water purification methods during peak contamination periods.", "Seek medical advice for persistent or severe symptoms."],
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
  // Barak Valley, Assam
  {
    lat: 24.83,
    lng: 92.78,
    name: "Silchar Urban Slum, Barak Valley",
    description: "A densely populated urban slum in Silchar with poor drainage and frequent waterlogging, leading to high risk of water-borne outbreaks.",
    primaryWaterSource: "Municipal Tap (often contaminated)",
    riskAnalysis: {
      overallRisk: "High",
      contaminationLevel: "Coliforms: High, Turbidity: High",
      primaryRiskFactors: [
        "Overflowing drains during monsoon season.",
        "Illegal water connections and pipe leakages.",
        "Limited access to toilets and hygiene facilities.",
      ],
    },
    commonDiseases: ["Cholera", "Hepatitis E", "Diarrhea"],
    preventionAndCure: {
      mitigation: [
        "Promote regular chlorination of water supply.",
        "Community awareness on boiling water.",
        "Improve drainage and waste management.",
      ],
      firstResponse: [
        "Immediate ORS for diarrhea cases.",
        "Report clusters of illness to health authorities.",
        "Temporary water tankers during outbreaks.",
      ],
    },
  },
  // Imphal Wetlands, Manipur
  {
    lat: 24.82,
    lng: 93.95,
    name: "Imphal Wetland Settlement, Manipur",
    description: "A settlement near Loktak Lake, where seasonal flooding and untreated sewage increase water-borne disease risk.",
    primaryWaterSource: "Lake and Rainwater Harvesting",
    riskAnalysis: {
      overallRisk: "High",
      contaminationLevel: "Pathogen presence: High, Nitrate: Moderate",
      primaryRiskFactors: [
        "Direct use of lake water for drinking.",
        "Sewage discharge into wetlands.",
        "Flooding during monsoon months.",
      ],
    },
    commonDiseases: ["Dysentery", "Cholera", "Amoebiasis"],
    preventionAndCure: {
      mitigation: [
        "Promote use of water filters.",
        "Construct eco-friendly toilets.",
        "Community clean-up drives.",
      ],
      firstResponse: [
        "Encourage early medical consultation.",
        "Distribute ORS and water purification tablets.",
        "Temporary relocation during severe floods.",
      ],
    },
  },
  // Dhubri Char Islands, Assam
  {
    lat: 25.98,
    lng: 89.97,
    name: "Dhubri Char Island Community, Assam",
    description: "A remote island community on the Brahmaputra, isolated during floods and dependent on untreated river water.",
    primaryWaterSource: "River Water (untreated)",
    riskAnalysis: {
      overallRisk: "High",
      contaminationLevel: "E. coli: High, Turbidity: High",
      primaryRiskFactors: [
        "Seasonal isolation due to flooding.",
        "No access to piped water or sanitation.",
        "Livestock sharing water sources with humans.",
      ],
    },
    commonDiseases: ["Cholera", "Typhoid", "Dysentery"],
    preventionAndCure: {
      mitigation: [
        "Promote rainwater harvesting.",
        "Distribute water purification tablets.",
        "Mobile health camps during monsoon.",
      ],
      firstResponse: [
        "Immediate rehydration for diarrhea.",
        "Evacuate severe cases to mainland hospitals.",
        "Alert district authorities for emergency response.",
      ],
    },
  },
];
