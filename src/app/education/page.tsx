'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Hand, 
  Trash2, 
  Utensils, 
  AlertTriangle, 
  Users, 
  Stethoscope,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Globe,
  CheckCircle,
  Play,
  Shield,
  Home
} from 'lucide-react';

const preventionMethods = [
  {
    id: 1,
    title: "Clean Water & Safe Storage",
    icon: Droplets,
    bgColor: "bg-blue-500",
    description: "Evidence-based water treatment and storage practices designed for community implementation with local adaptation.",
    keyPractices: [
      "Boil water for at least 1 minute before drinking - this kills 99.9% of harmful bacteria and viruses",
      "Use water purification tablets or filters when boiling is not possible - chlorine tablets are effective against most pathogens",
      "Store treated water in covered containers with narrow mouths to prevent recontamination",
      "Clean storage containers regularly with soap and safe water - scrub thoroughly every 2-3 days",
      "Never store treated and untreated water in the same container to avoid cross-contamination"
    ],
    proTips: [
      "Let boiled water cool naturally - don't add ice as it may recontaminate the water",
      "Use separate utensils for treated and untreated water to maintain safety",
      "Replace stored water every 24-48 hours even if properly stored",
      "Mark containers clearly to distinguish between treated and untreated water"
    ],
    implementation: [
      "Community training sessions in local languages (Hindi, Bengali, Assamese)",
      "Distribution of water treatment supplies through health centers",
      "Regular monitoring of water quality by trained volunteers",
      "Household-level water testing programs with simple test kits"
    ]
  },
  {
    id: 2,
    title: "Handwashing Practices",
    icon: Hand,
    bgColor: "bg-green-500",
    description: "Comprehensive hand hygiene protocols proven to reduce waterborne disease transmission by up to 85%.",
    keyPractices: [
      "Wash hands with soap for at least 20 seconds - friction removes 99% of germs when done correctly",
      "Clean hands before eating, preparing food, and after using toilet facilities",
      "Use alcohol-based hand sanitizer (60%+ alcohol) when soap and water unavailable",
      "Wash hands after touching animals, garbage, or contaminated surfaces",
      "Scrub between fingers, under nails, and wrists thoroughly"
    ],
    proTips: [
      "Sing 'Happy Birthday' twice to ensure 20-second washing duration",
      "Use warm water when available - it helps soap work more effectively",
      "Keep fingernails short and clean to prevent bacteria accumulation",
      "Air dry hands or use clean towels - avoid sharing towels between family members"
    ],
    implementation: [
      "Install handwashing stations in schools and community centers",
      "Provide soap and sanitizer through health programs",
      "Train community health workers to demonstrate proper technique",
      "Create visual reminders in local languages for public spaces"
    ]
  },
  {
    id: 3,
    title: "Sanitation & Waste Management",
    icon: Trash2,
    bgColor: "bg-yellow-500",
    description: "Comprehensive waste management strategies that reduce disease vectors and environmental contamination by 70%.",
    keyPractices: [
      "Use proper toilet facilities and sewage systems - improper sanitation causes 80% of waterborne diseases",
      "Dispose of garbage in covered containers to prevent pest attraction and disease vectors",
      "Keep living areas clean and well-ventilated - good airflow reduces pathogen concentration",
      "Eliminate standing water within 100 meters of homes to prevent mosquito breeding",
      "Maintain proper drainage around homes - stagnant water increases disease risk by 300%"
    ],
    proTips: [
      "Clean toilets with disinfectant weekly - use locally available lime or bleach solutions",
      "Separate organic and inorganic waste to improve decomposition and reduce odors",
      "Cover garbage bins tightly and empty regularly to prevent fly and rodent infestations",
      "Create drainage channels away from water sources to prevent contamination"
    ],
    implementation: [
      "Community sanitation programs with local government support",
      "Training sessions on waste segregation and proper disposal",
      "Installation of community toilets in areas lacking facilities",
      "Regular clean-up drives involving local volunteers and schools"
    ]
  },
  {
    id: 4,
    title: "Food Safety & Hygiene",
    icon: Utensils,
    bgColor: "bg-purple-500",
    description: "Scientific food safety protocols that prevent 95% of foodborne illnesses when properly implemented.",
    keyPractices: [
      "Cook food thoroughly to safe internal temperatures - 75°C for poultry, 63°C for other meats",
      "Separate raw and cooked foods using different cutting boards and utensils to prevent cross-contamination",
      "Refrigerate perishable foods within 2 hours - bacteria multiply rapidly at room temperature",
      "Wash all fruits and vegetables with safe water before consumption, especially leafy greens",
      "Avoid eating raw or undercooked foods, particularly eggs, meat, and seafood in high-risk areas"
    ],
    proTips: [
      "Use a food thermometer to check internal temperatures - visual cues can be misleading",
      "Follow the 'first in, first out' rule for stored foods to ensure freshness",
      "Keep hot foods hot (above 60°C) and cold foods cold (below 5°C) during serving",
      "When in doubt, throw it out - spoiled food can cause severe illness"
    ],
    implementation: [
      "Food safety training for street vendors and local restaurants",
      "Distribution of food thermometers and safe storage containers",
      "Community workshops on proper food preservation techniques",
      "Certification programs for food handlers in local establishments"
    ]
  },
  {
    id: 5,
    title: "Early Warning & Disease Recognition",
    icon: AlertTriangle,
    bgColor: "bg-red-500",
    description: "Early detection and response protocols that reduce severe complications by 80% when implemented correctly.",
    keyPractices: [
      "Know the symptoms of common waterborne diseases - diarrhea, vomiting, fever, and dehydration are key indicators",
      "Seek medical attention for persistent diarrhea lasting more than 24 hours or blood in stool",
      "Monitor family members for signs of illness, especially children and elderly who are more vulnerable",
      "Report suspected disease outbreaks to health authorities within 24 hours for rapid response",
      "Keep oral rehydration salts (ORS) available at home - they can prevent death from dehydration"
    ],
    proTips: [
      "Learn to recognize severe dehydration signs - sunken eyes, extreme thirst, little or no urination",
      "Maintain a health diary during monsoon season to track family health patterns",
      "Keep emergency contact numbers readily available including nearest health center",
      "Store ORS packets in cool, dry place and check expiration dates regularly"
    ],
    implementation: [
      "Community health worker training on symptom recognition",
      "Distribution of symptom recognition cards in local languages",
      "Establishment of rapid reporting systems using mobile phones",
      "Regular health camps for early screening and education"
    ]
  },
  {
    id: 6,
    title: "Community Health Networks",
    icon: Users,
    bgColor: "bg-indigo-500",
    description: "Community-based health systems that improve disease prevention outcomes by 60% through collective action.",
    keyPractices: [
      "Participate in community health education programs led by trained ASHA workers and volunteers",
      "Support local health volunteers with accurate information sharing and resource mobilization",
      "Attend regular health awareness sessions in your area - community learning increases retention by 75%",
      "Share verified health information with neighbors using trusted communication channels",
      "Report health concerns to community leaders and establish feedback mechanisms"
    ],
    proTips: [
      "Form neighborhood health groups of 8-10 families for better coordination and support",
      "Create WhatsApp groups for quick health alerts and information sharing",
      "Volunteer for community clean-up drives - collective action builds stronger health networks",
      "Maintain community health registers to track local health trends and improvements"
    ],
    implementation: [
      "Training programs for community health volunteers in disease prevention",
      "Establishment of village-level health committees with regular meetings",
      "Creation of peer-to-peer education networks using local influencers",
      "Integration with existing self-help groups and community organizations"
    ]
  },
  {
    id: 7,
    title: "Emergency Response & First Aid",
    icon: Stethoscope,
    bgColor: "bg-pink-500",
    description: "Life-saving emergency protocols and first aid techniques that reduce mortality by 90% when applied correctly.",
    keyPractices: [
      "Recognize danger signs requiring immediate medical help - severe dehydration, high fever, blood in stool",
      "Know when to seek emergency care - unconsciousness, severe abdominal pain, or inability to keep fluids down",
      "Understand isolation procedures for infectious diseases to prevent family and community spread",
      "Keep emergency medical supplies ready - ORS, thermometer, clean water, basic medications",
      "Learn proper technique for administering oral rehydration therapy to prevent shock"
    ],
    proTips: [
      "Prepare emergency contact list with nearest hospital, ambulance, and poison control numbers",
      "Practice ORS preparation before emergencies - wrong concentration can be harmful",
      "Learn signs of severe dehydration - skin tenting, rapid pulse, confusion, reduced urination",
      "Keep emergency supplies in waterproof containers and check expiration dates monthly"
    ],
    implementation: [
      "First aid training programs for community members and families",
      "Distribution of emergency medical kits with instruction cards",
      "Establishment of rapid transport systems for medical emergencies",
      "Regular drills and practice sessions for emergency response protocols"
    ]
  }
];

const supportFeatures = [
  { title: "Community Education", icon: BookOpen },
  { title: "Health Awareness", icon: Shield },
  { title: "Disease Prevention", icon: AlertTriangle },
  { title: "Multi-Language Support", icon: Globe }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

export default function EducationPage() {
  const [expandedMethod, setExpandedMethod] = useState<number | null>(null);

  const toggleExpansion = (id: number) => {
    setExpandedMethod(expandedMethod === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 px-4 text-center bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Disease Prevention Guide
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              Comprehensive Water-Borne Disease Prevention for Communities
            </p>
          </motion.div>          {/* Support Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {supportFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            7 Key Prevention Methods
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-6">
            Evidence-based prevention strategies designed for community implementation with local language support and cultural adaptation.
          </p>
        </motion.div>

        {/* Prevention Methods */}
        <div className="space-y-6 mt-8">
          {preventionMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isExpanded = expandedMethod === method.id;
            
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div 
                  className={`relative overflow-hidden rounded-xl shadow-md cursor-pointer transition-all duration-300 ${
                    isExpanded ? 'shadow-xl' : 'hover:shadow-lg'
                  }`}
                >
                  {/* Header */}
                  <motion.div
                    onClick={() => toggleExpansion(method.id)}
                    className={`${method.bgColor} text-white py-4 px-6 relative overflow-hidden cursor-pointer`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }}
                      />
                    </div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          animate={{ 
                            rotate: isExpanded ? 360 : 0,
                            scale: isExpanded ? 1.05 : 1
                          }}
                          transition={{ duration: 0.3 }}
                          className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                        >
                          <IconComponent className="w-6 h-6" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold mb-0.5">
                            {method.id}. {method.title}
                          </h3>
                          <p className="text-white/80 text-sm font-normal">
                            Click to expand details
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-2"
                      >
                        <ChevronDown className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="bg-white overflow-hidden"
                      >
                        <div className="p-8 bg-white">
                          {/* Two-column layout for Key Practices and Pro Tips */}
                          <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Key Practices Section */}
                            <div>
                              <h4 className="text-base font-medium text-gray-600 mb-4 flex items-center">
                                <div className="w-4 h-4 mr-2">
                                  <svg viewBox="0 0 24 24" className="w-full h-full text-green-600">
                                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                  </svg>
                                </div>
                                Key Practices
                              </h4>
                              <div className="space-y-3">
                                {method.keyPractices?.map((practice, practiceIndex) => (
                                  <motion.div
                                    key={practiceIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: practiceIndex * 0.1, duration: 0.3 }}
                                    className="flex items-start space-x-3"
                                  >
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700 text-sm leading-relaxed">{practice}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* Pro Tips Section */}
                            <div>
                              <h4 className="text-base font-medium text-gray-600 mb-4 flex items-center">
                                <div className="w-4 h-4 mr-2">
                                  <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-600">
                                    <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                </div>
                                Pro Tips
                              </h4>
                              <div className="space-y-3">
                                {method.proTips?.map((tip, tipIndex) => (
                                  <motion.div
                                    key={tipIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (method.keyPractices?.length || 0) * 0.1 + tipIndex * 0.1, duration: 0.3 }}
                                    className="flex items-start space-x-3"
                                  >
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Implementation Section */}
                          <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-base font-medium text-gray-600 mb-4 flex items-center">
                              <div className="w-4 h-4 mr-2">
                                <svg viewBox="0 0 24 24" className="w-full h-full text-gray-600">
                                  <path fill="currentColor" d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H18V0h-2v2H8V0H6v2H4.5C3.11 2 2 3.11 2 4.5v15C2 20.89 3.11 22 4.5 22h15c1.39 0 2.5-1.11 2.5-2.5v-15C22 3.11 20.89 2 19.5 2z"/>
                                </svg>
                              </div>
                              Implementation
                            </h4>
                            
                            {/* Language Selector Pills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {['Assamese', 'Bengali', 'Hindi', 'English', 'Local dialects'].map((language, langIndex) => (
                                <motion.span
                                  key={langIndex}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 + langIndex * 0.1, duration: 0.3 }}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                                >
                                  {language}
                                </motion.span>
                              ))}
                            </div>

                            {/* Implementation Details */}
                            <div className="space-y-2">
                              {method.implementation?.map((impl, implIndex) => (
                                <motion.div
                                  key={implIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.8 + implIndex * 0.1, duration: 0.3 }}
                                  className="flex items-start space-x-3"
                                >
                                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-600 text-sm leading-relaxed">{impl}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>



      {/* Bottom CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="bg-gradient-to-r from-green-500 via-teal-600 to-blue-600 text-white py-12 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold mb-3"
          >
            Start Prevention Today
          </motion.h2>
          <p className="text-white/90 text-base mb-6 max-w-xl mx-auto">
            Small actions can prevent major health crises in your community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Download Resources
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-white hover:text-teal-600 transition-all duration-300"
            >
              Join Community Program
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
