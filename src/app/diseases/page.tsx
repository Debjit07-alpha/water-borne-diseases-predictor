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
    default:
      return '/cholerae.jpg'; // fallback to cholera image
  }
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
        const data = await response.json();
        setDiseases(data);
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
    <div className="py-12 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold text-center font-heading-serif">Water-Borne Diseases</h1>
      <p className="text-center mt-2 text-muted-foreground">Learn about common water-borne illnesses, their symptoms, prevention and treatment.</p>

      <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {diseases.map((disease) => (
          <Link key={disease.id} href={`/diseases/${disease.slug}`} className="group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold group-hover:text-[#0B86FF] transition-colors duration-300">{disease.name}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3 text-gray-600">{disease.overview}</CardDescription>
                  </div>
                  <div className="ml-4 w-16 h-16 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={getImageForDisease(disease.slug)} 
                      alt={`${disease.name} image`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%230B86FF'/%3E%3Ctext x='32' y='32' text-anchor='middle' dy='.3em' fill='white' font-size='12' font-weight='bold'%3E" + disease.name + "%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
