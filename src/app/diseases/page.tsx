"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function getImageForDisease(slug: string) {
  switch (slug) {
    case 'cholera':
      return '/cholerae.jpg';
    case 'diarrhea':
      return '/diarrea.jpg';
    case 'typhoid':
      return '/typhoid.jpg';
    case 'hepatitis-a':
      return '/hepatitis_A.jpg';
    case 'dysentery':
      return '/dysentery.jpg';
    case 'giardiasis':
      return '/giar.jpg';
    case 'salmonellosis':
      return '/salmona.jpg';
    case 'leptospirosis':
      return '/lepto.jpg';
    default:
      return '/cholerae.jpg'; // fallback to cholera image
  }
}

// Color scheme functions for professional disease cards
function getDiseaseCardStyle(slug: string): string {
  const styleMap: { [key: string]: string } = {
    'cholera': 'bg-gradient-to-br from-red-100 via-pink-50 to-red-200 border-red-200 border-2',
    'diarrhea': 'bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-200 border-yellow-200 border-2',
    'dysentery': 'bg-gradient-to-br from-orange-100 via-red-50 to-orange-200 border-orange-200 border-2',
    'giardiasis': 'bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 border-green-200 border-2',
    'hepatitis-a': 'bg-gradient-to-br from-purple-100 via-violet-50 to-purple-200 border-purple-200 border-2',
    'leptospirosis': 'bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 border-blue-200 border-2',
    'salmonellosis': 'bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 border-pink-200 border-2',
    'typhoid': 'bg-gradient-to-br from-indigo-100 via-slate-50 to-indigo-200 border-indigo-200 border-2'
  };
  return styleMap[slug] || 'bg-gradient-to-br from-gray-100 via-slate-50 to-gray-200 border-gray-200 border-2';
}

function getDiseaseTextColor(slug: string): string {
  const colorMap: { [key: string]: string } = {
    'cholera': 'text-red-700 group-hover:text-red-800',
    'diarrhea': 'text-yellow-700 group-hover:text-yellow-800',
    'dysentery': 'text-orange-700 group-hover:text-orange-800',
    'giardiasis': 'text-green-700 group-hover:text-green-800',
    'hepatitis-a': 'text-purple-700 group-hover:text-purple-800',
    'leptospirosis': 'text-blue-700 group-hover:text-blue-800',
    'salmonellosis': 'text-pink-700 group-hover:text-pink-800',
    'typhoid': 'text-indigo-700 group-hover:text-indigo-800'
  };
  return colorMap[slug] || 'text-gray-700 group-hover:text-gray-800';
}

function getDiseaseAccentColor(slug: string): string {
  const colorMap: { [key: string]: string } = {
    'cholera': 'bg-red-500',
    'diarrhea': 'bg-yellow-500',
    'dysentery': 'bg-orange-500',
    'giardiasis': 'bg-green-500',
    'hepatitis-a': 'bg-purple-500',
    'leptospirosis': 'bg-blue-500',
    'salmonellosis': 'bg-pink-500',
    'typhoid': 'bg-indigo-500'
  };
  return colorMap[slug] || 'bg-gray-500';
}

function getDiseaseColorCode(slug: string): string {
  const colorMap: { [key: string]: string } = {
    'cholera': '%23ef4444',
    'diarrhea': '%23eab308',
    'dysentery': '%23f97316',
    'giardiasis': '%2310b981',
    'hepatitis-a': '%23a855f7',
    'leptospirosis': '%233b82f6',
    'salmonellosis': '%23ec4899',
    'typhoid': '%236366f1'
  };
  return colorMap[slug] || '%236b7280';
}

interface Disease {
  id: string;
  name: string;
  overview: string;
  symptoms: string;
  causes: string;
  prevention: string;
  treatment: string;
  slug: string;
}

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await fetch('/api/diseases');
        if (response.ok) {
          const data = await response.json();
          setDiseases(data);
        } else {
          console.warn('API response not ok, using fallback data');
          // Use fallback data
          setDiseases([
            {
              id: '1',
              name: 'Cholera',
              overview: 'A severe diarrheal disease caused by Vibrio cholerae bacteria',
              symptoms: 'Watery diarrhea, vomiting, rapid dehydration',
              causes: 'Contaminated water and food',
              prevention: 'Safe water, proper sanitation, vaccination',
              treatment: 'Oral rehydration therapy, antibiotics',
              slug: 'cholera'
            },
            {
              id: '2',
              name: 'Diarrhea',
              overview: 'Frequent loose, watery stools that can cause dehydration',
              symptoms: 'Loose stools, abdominal cramps, dehydration',
              causes: 'Bacteria, viruses, parasites in contaminated water',
              prevention: 'Safe water, good hygiene, proper food handling',
              treatment: 'Oral rehydration, rest, medical attention if severe',
              slug: 'diarrhea'
            },
            {
              id: '3',
              name: 'Typhoid',
              overview: 'A bacterial infection caused by Salmonella typhi',
              symptoms: 'High fever, weakness, stomach pain, headache',
              causes: 'Contaminated water and food',
              prevention: 'Safe water, proper sanitation, vaccination',
              treatment: 'Antibiotics, rest, proper nutrition',
              slug: 'typhoid'
            },
            {
              id: '4',
              name: 'Hepatitis A',
              overview: 'A viral infection that affects the liver',
              symptoms: 'Fatigue, nausea, abdominal pain, jaundice',
              causes: 'Contaminated water and food',
              prevention: 'Safe water, good hygiene, vaccination',
              treatment: 'Rest, proper nutrition, medical monitoring',
              slug: 'hepatitis-a'
            },
            {
              id: '5',
              name: 'Dysentery',
              overview: 'Intestinal inflammation causing severe diarrhea with blood',
              symptoms: 'Bloody diarrhea, stomach cramps, fever',
              causes: 'Bacterial or protozoan infection through contaminated water',
              prevention: 'Good hygiene, safe water, proper food handling',
              treatment: 'Rest, fluids, antibiotics for severe cases',
              slug: 'dysentery'
            },
            {
              id: '6',
              name: 'Giardiasis',
              overview: 'Parasitic infection causing diarrheal disease',
              symptoms: 'Watery diarrhea, fatigue, abdominal cramps, gas',
              causes: 'Giardia parasite in contaminated water and food',
              prevention: 'Avoid contaminated water, good hygiene, water filters',
              treatment: 'Antiparasitic medications like metronidazole',
              slug: 'giardiasis'
            },
            {
              id: '7',
              name: 'Salmonellosis',
              overview: 'Bacterial food poisoning affecting the intestinal tract',
              symptoms: 'Diarrhea, fever, stomach cramps, nausea, vomiting',
              causes: 'Salmonella bacteria in contaminated food and water',
              prevention: 'Cook food thoroughly, good hygiene, refrigerate promptly',
              treatment: 'Supportive care, fluids, antibiotics if severe',
              slug: 'salmonellosis'
            },
            {
              id: '8',
              name: 'Leptospirosis',
              overview: 'Bacterial infection affecting kidneys, liver, and other organs',
              symptoms: 'High fever, headache, muscle aches, jaundice, red eyes',
              causes: 'Leptospira bacteria in contaminated water and soil',
              prevention: 'Avoid contaminated water, protective clothing, control rodents',
              treatment: 'Antibiotics like penicillin or doxycycline',
              slug: 'leptospirosis'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching diseases:', error);
        // Fallback data if API fails
        setDiseases([
          {
            id: '1',
            name: 'Cholera',
            overview: 'A severe diarrheal disease caused by Vibrio cholerae bacteria',
            symptoms: 'Watery diarrhea, vomiting, rapid dehydration',
            causes: 'Contaminated water and food',
            prevention: 'Safe water, proper sanitation, vaccination',
            treatment: 'Oral rehydration therapy, antibiotics',
            slug: 'cholera'
          },
          {
            id: '2',
            name: 'Diarrhea',
            overview: 'Frequent loose, watery stools that can cause dehydration',
            symptoms: 'Loose stools, abdominal cramps, dehydration',
            causes: 'Bacteria, viruses, parasites in contaminated water',
            prevention: 'Safe water, good hygiene, proper food handling',
            treatment: 'Oral rehydration, rest, medical attention if severe',
            slug: 'diarrhea'
          },
          {
            id: '3',
            name: 'Typhoid',
            overview: 'A bacterial infection caused by Salmonella typhi',
            symptoms: 'High fever, weakness, stomach pain, headache',
            causes: 'Contaminated water and food',
            prevention: 'Safe water, proper sanitation, vaccination',
            treatment: 'Antibiotics, rest, proper nutrition',
            slug: 'typhoid'
          },
          {
            id: '4',
            name: 'Hepatitis A',
            overview: 'A viral infection that affects the liver',
            symptoms: 'Fatigue, nausea, abdominal pain, jaundice',
            causes: 'Contaminated water and food',
            prevention: 'Safe water, good hygiene, vaccination',
            treatment: 'Rest, proper nutrition, medical monitoring',
            slug: 'hepatitis-a'
          },
          {
            id: '5',
            name: 'Dysentery',
            overview: 'Intestinal inflammation causing severe diarrhea with blood',
            symptoms: 'Bloody diarrhea, stomach cramps, fever',
            causes: 'Bacterial or protozoan infection through contaminated water',
            prevention: 'Good hygiene, safe water, proper food handling',
            treatment: 'Rest, fluids, antibiotics for severe cases',
            slug: 'dysentery'
          },
          {
            id: '6',
            name: 'Giardiasis',
            overview: 'Parasitic infection causing diarrheal disease',
            symptoms: 'Watery diarrhea, fatigue, abdominal cramps, gas',
            causes: 'Giardia parasite in contaminated water and food',
            prevention: 'Avoid contaminated water, good hygiene, water filters',
            treatment: 'Antiparasitic medications like metronidazole',
            slug: 'giardiasis'
          },
          {
            id: '7',
            name: 'Salmonellosis',
            overview: 'Bacterial food poisoning affecting the intestinal tract',
            symptoms: 'Diarrhea, fever, stomach cramps, nausea, vomiting',
            causes: 'Salmonella bacteria in contaminated food and water',
            prevention: 'Cook food thoroughly, good hygiene, refrigerate promptly',
            treatment: 'Supportive care, fluids, antibiotics if severe',
            slug: 'salmonellosis'
          },
          {
            id: '8',
            name: 'Leptospirosis',
            overview: 'Bacterial infection affecting kidneys, liver, and other organs',
            symptoms: 'High fever, headache, muscle aches, jaundice, red eyes',
            causes: 'Leptospira bacteria in contaminated water and soil',
            prevention: 'Avoid contaminated water, protective clothing, control rodents',
            treatment: 'Antibiotics like penicillin or doxycycline',
            slug: 'leptospirosis'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center font-heading-serif">Water-Borne Diseases</h1>
        <p className="text-center mt-2 text-muted-foreground">Learn about common water-borne illnesses, their symptoms, prevention and treatment.</p>
        
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="ml-4 w-16 h-16 bg-gray-300 rounded-full"></div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl mb-6">
            <h1 className="text-5xl font-extrabold text-white font-heading-serif flex items-center gap-3">
              <span className="text-6xl">💧</span>
              Water-Borne Diseases
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Learn about common water-borne illnesses, their symptoms, prevention and treatment.
            <br />
            <span className="text-blue-600 font-semibold">Stay informed, stay healthy</span>
          </p>
        </div>

        {/* Disease Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {diseases.map((disease, index) => (
            <Link key={disease.id} href={`/diseases/${disease.slug}`} className="group">
              <div className={`
                relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1
                ${getDiseaseCardStyle(disease.slug)}
              `}>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-transparent z-10"></div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-transparent via-white/20 to-white/40"></div>
                </div>

                <div className="relative z-20 p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 font-bookman-old-style
                        ${getDiseaseTextColor(disease.slug)}
                        group-hover:scale-105 transform transition-transform duration-300
                      `}>
                        {disease.name}
                      </h3>
                      <div className={`h-1 w-16 rounded-full mb-3 ${getDiseaseAccentColor(disease.slug)}`}></div>
                    </div>
                    
                    {/* Disease Icon/Image */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-white">
                        <img 
                          src={getImageForDisease(disease.slug)} 
                          alt={`${disease.name} image`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='${getDiseaseColorCode(disease.slug)}'/%3E%3Ctext x='40' y='45' text-anchor='middle' dy='.1em' fill='white' font-size='14' font-weight='bold'%3E${disease.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                      </div>
                      {/* Floating indicator */}
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${getDiseaseAccentColor(disease.slug)} border-2 border-white shadow-lg animate-pulse`}>
                        <span className="block w-full h-full rounded-full animate-ping absolute inset-0 bg-current opacity-30"></span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Disease Description */}
                  <div className="flex-1 mb-4">
                    <p className="text-gray-700 line-clamp-3 leading-relaxed font-medium">
                      {disease.overview}
                    </p>
                  </div>
                  
                  {/* Action Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Prevention
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        Treatment
                      </span>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg
                      ${getDiseaseAccentColor(disease.slug)}
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      Learn More →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Call-to-Action */}
        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-xl">
            <p className="text-white text-lg font-semibold mb-2">
              💡 Need immediate medical help?
            </p>
            <Link 
              href="/medical-services" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚨 24/7 Emergency Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
