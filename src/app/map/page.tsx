"use client";

import { useState } from "react";
import { Droplets, Hand, Trash2, Utensils, AlertTriangle, Users, Smartphone, Play, ChevronDown, ChevronUp } from "lucide-react";

export default function DiseasePreventionPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const preventionMethods = [
    {
      id: "clean-water",
      icon: <Droplets className="w-8 h-8" />,
      title: "Clean Water & Safe Storage",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      details: [
        "Boil water for at least 1 minute before drinking",
        "Use water purification tablets or filters when boiling is not possible",
        "Store treated water in covered containers with narrow mouths",
        "Clean storage containers regularly with soap and safe water",
        "Never store treated and untreated water in the same container"
      ],
      tips: [
        "Let boiled water cool naturally - don't add ice",
        "Use separate utensils for treated and untreated water",
        "Replace stored water every 24-48 hours"
      ],
      languages: ["Assamese", "Bengali", "Hindi", "English", "Local dialects"]
    },
    {
      id: "handwashing",
      icon: <Hand className="w-8 h-8" />,
      title: "Handwashing Practices",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      details: [
        "Wash hands for at least 20 seconds with soap",
        "7-step handwashing technique for complete cleanliness",
        "Wash before eating, after using toilet, after handling waste",
        "Use alcohol-based sanitizer when soap is unavailable",
        "Dry hands with clean cloth or air dry"
      ],
      tips: [
        "Teach children handwashing songs to ensure 20-second duration",
        "Install handwashing stations in schools and public areas",
        "Organize handwashing competitions in communities"
      ],
      languages: ["Interactive demos in local schools", "Village awareness programs", "Mobile health units"]
    },
    {
      id: "sanitation",
      icon: <Trash2 className="w-8 h-8" />,
      title: "Sanitation & Waste Management",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      details: [
        "Use proper toilets instead of open defecation",
        "Keep toilets clean and well-maintained",
        "Dispose of waste in designated areas only",
        "Separate organic and non-organic waste",
        "Never dispose waste near water sources"
      ],
      tips: [
        "Create community composting pits for organic waste",
        "Install low-cost bio-toilets in rural areas",
        "Organize community clean-up drives monthly"
      ],
      languages: ["Community awareness programs", "Gram panchayat initiatives", "School education programs"]
    },
    {
      id: "food-hygiene",
      icon: <Utensils className="w-8 h-8" />,
      title: "Food Hygiene",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      details: [
        "Wash all fruits and vegetables with clean water",
        "Cook food thoroughly and eat while hot",
        "Store cooked food in clean, covered containers",
        "Avoid street food from unhygienic vendors",
        "Use separate cutting boards for raw and cooked food"
      ],
      tips: [
        "Follow 'Cook it, boil it, peel it, or forget it' rule",
        "Reheat leftover food until steaming hot",
        "Check expiration dates on packaged foods"
      ],
      languages: ["Vendor training programs", "Community cooking demonstrations", "Health worker visits"]
    },
    {
      id: "early-warning",
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Early Warning Awareness",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      details: [
        "Recognize symptoms: diarrhea, vomiting, fever, dehydration",
        "Seek immediate medical attention for severe symptoms",
        "Report suspected outbreaks to local health authorities",
        "Keep oral rehydration solution (ORS) at home",
        "Don't ignore persistent stomach pain or bloody stools"
      ],
      tips: [
        "Create symptom awareness cards in local languages",
        "Use mobile alerts for disease outbreak notifications",
        "Train community leaders to identify early signs"
      ],
      languages: ["Mobile SMS alerts", "IVR calls in native languages", "Community health meetings"]
    },
    {
      id: "community-health",
      icon: <Users className="w-8 h-8" />,
      title: "Community Health Volunteers",
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      details: [
        "Train local youth as Health Ambassadors",
        "Provide simple diagnostic tools and educational materials",
        "Regular health camps in remote villages",
        "Connect communities with healthcare systems",
        "Monitor and report health trends in the area"
      ],
      tips: [
        "Select volunteers from each village cluster",
        "Provide mobile apps for health data collection",
        "Regular refresher training sessions"
      ],
      languages: ["Peer-to-peer education", "Community leader involvement", "Local language training materials"]
    },
    {
      id: "digital-tools",
      icon: <Smartphone className="w-8 h-8" />,
      title: "Digital Educational Tools",
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      details: [
        "Animated videos in local languages (Assamese, Khasi, Mizo, Nagamese)",
        "WhatsApp groups for health tips and alerts",
        "IVR voice messages for illiterate populations",
        "Mobile apps with offline health information",
        "QR codes on posters linking to educational content"
      ],
      tips: [
        "Use visual storytelling for better understanding",
        "Create shareable infographics for social media",
        "Partner with local radio stations for health programs"
      ],
      languages: ["Multi-language content", "Audio-visual materials", "Interactive mobile platforms"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-pulse">
            Disease Prevention Guide
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Comprehensive Water-Borne Disease Prevention for Communities
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">Community Education</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Health Awareness</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Disease Prevention</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Multi-Language Support</span>
          </div>
        </div>
      </div>

      {/* Prevention Methods */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            7 Key Prevention Methods
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Evidence-based prevention strategies designed for community implementation with local language support and cultural adaptation.
          </p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {preventionMethods.map((method, index) => (
            <div
              key={method.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div 
                className={`${method.color} ${method.hoverColor} text-white p-6 cursor-pointer transition-all duration-300`}
                onClick={() => toggleSection(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{index + 1}. {method.title}</h3>
                      <p className="opacity-90">Click to expand details</p>
                    </div>
                  </div>
                  <div className="transition-transform duration-300">
                    {expandedSections[method.id] ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>

              {expandedSections[method.id] && (
                <div className="p-6 animate-pulse">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                        <Play className="w-4 h-4 mr-2 text-green-500" />
                        Key Practices
                      </h4>
                      <ul className="space-y-2">
                        {method.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {method.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                        <Smartphone className="w-4 h-4 mr-2 text-blue-500" />
                        Implementation
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {method.languages.map((lang, idx) => (
                          <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Prevention Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Small actions can prevent major health crises in your community
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Download Resources
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Join Community Program
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
