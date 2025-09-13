"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

interface Disease {
  id: string;
  name: string;
  overview: string;
  symptoms: string[];
  causes: string;
  prevention: string[];
  treatment: string;
  slug: string;
}

export default function DiseasePage({
  params,
}: {
  params: { slug: string };
}) {
  const [disease, setDisease] = useState<Disease | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const response = await fetch(`/api/diseases/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setDisease(data);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching disease:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisease();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="h-10 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="w-20 h-20 bg-gray-300 rounded-full ml-4"></div>
          </div>
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!disease) return notFound();

  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      {/* Header Section with Image */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8">
      <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold font-heading-serif text-gray-800">{disease.name}</h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">{disease.overview}</p>
          </div>
          <div className="ml-8 w-32 h-32 rounded-full overflow-hidden shadow-lg flex-shrink-0">
            <img 
              src={getImageForDisease(disease.slug)} 
              alt={`${disease.name} image`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' fill='%230B86FF'/%3E%3Ctext x='64' y='64' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-weight='bold'%3E" + disease.name + "%3C/text%3E%3C/svg%3E";
              }}
            />
        </div>
        </div>
      </div>

      <nav className="mb-8">
        <Link href="/diseases" className="inline-flex items-center text-sm text-[#0B86FF] hover:text-blue-700 hover:underline transition-colors duration-300">
          <span className="mr-2">←</span> Back to all diseases
        </Link>
      </nav>

      <div className="space-y-8">
        {/* Symptoms Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-400">
          <h2 className="text-2xl font-bold font-heading-sans text-red-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">⚠️</span>
            Symptoms & Warning Signs
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Symptoms</h3>
              <ul className="space-y-3">
                {disease.symptoms.map((symptom: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{symptom}</span>
                  </li>
            ))}
          </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ When to Seek Medical Help</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Severe dehydration (dry mouth, sunken eyes, no urination)</li>
                <li>• High fever (above 101°F or 38.3°C)</li>
                <li>• Blood in stool or vomit</li>
                <li>• Signs of shock (rapid pulse, cold skin)</li>
                <li>• Symptoms lasting more than 3 days</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Causes Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-400">
          <h2 className="text-2xl font-bold font-heading-sans text-orange-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">🔍</span>
            Causes & Transmission
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Spreads</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{disease.causes}</p>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">High-Risk Situations</h4>
                <ul className="space-y-1 text-sm text-orange-700">
                  <li>• Drinking untreated water from rivers, lakes, or wells</li>
                  <li>• Eating raw or undercooked food</li>
                  <li>• Poor sanitation and hygiene practices</li>
                  <li>• Contact with infected individuals</li>
                  <li>• Traveling to areas with poor water quality</li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">🦠 Pathogen Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-orange-700">Incubation Period:</span>
                  <span className="text-gray-700 ml-2">{getIncubationPeriod(disease.slug)}</span>
                </div>
                <div>
                  <span className="font-semibold text-orange-700">Contagious Period:</span>
                  <span className="text-gray-700 ml-2">{getContagiousPeriod(disease.slug)}</span>
                </div>
                <div>
                  <span className="font-semibold text-orange-700">Survival in Water:</span>
                  <span className="text-gray-700 ml-2">{getSurvivalTime(disease.slug)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prevention Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400">
          <h2 className="text-2xl font-bold font-heading-sans text-green-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">🛡️</span>
            Prevention & Protection
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Essential Prevention Steps</h3>
              <ul className="space-y-3">
                {disease.prevention.map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{step}</span>
                  </li>
            ))}
          </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-3">💧 Water Safety Tips</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Boil water for at least 1 minute before drinking</li>
                <li>• Use water purification tablets or filters</li>
                <li>• Store water in clean, covered containers</li>
                <li>• Avoid ice made from untreated water</li>
                <li>• Use bottled water when traveling</li>
              </ul>
              <div className="mt-4 p-3 bg-green-100 rounded">
                <p className="text-sm font-semibold text-green-800">🏥 Vaccination Available</p>
                <p className="text-xs text-green-700 mt-1">{getVaccinationInfo(disease.slug)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400">
          <h2 className="text-2xl font-bold font-heading-sans text-blue-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">💊</span>
            Treatment & Recovery
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Medical Treatment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{disease.treatment}</p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🏥 Hospital Care May Include</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Intravenous (IV) fluid replacement</li>
                  <li>• Antibiotic therapy (if bacterial)</li>
                  <li>• Electrolyte monitoring</li>
                  <li>• Supportive care and monitoring</li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">🏠 Home Care</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Rest and plenty of fluids</li>
                <li>• Oral rehydration solutions (ORS)</li>
                <li>• Avoid dairy and fatty foods initially</li>
                <li>• Monitor symptoms closely</li>
                <li>• Isolate to prevent spread</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <p className="text-sm font-semibold text-blue-800">⏱️ Recovery Time</p>
                <p className="text-xs text-blue-700 mt-1">{getRecoveryTime(disease.slug)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-l-4 border-purple-400">
          <h2 className="text-2xl font-bold font-heading-sans text-purple-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">📊</span>
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-purple-800 mb-2">🌍 Global Impact</h3>
              <p className="text-sm text-gray-700">{getGlobalImpact(disease.slug)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-purple-800 mb-2">👥 At-Risk Groups</h3>
              <p className="text-sm text-gray-700">{getAtRiskGroups(disease.slug)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-purple-800 mb-2">🔬 Research & Development</h3>
              <p className="text-sm text-gray-700">{getResearchInfo(disease.slug)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

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

function getIncubationPeriod(slug: string) {
  switch (slug) {
    case 'cholera':
      return '2-5 days';
    case 'diarrhea':
      return '1-3 days';
    case 'typhoid':
      return '6-30 days';
    case 'hepatitis-a':
      return '15-50 days';
    default:
      return 'Varies';
  }
}

function getContagiousPeriod(slug: string) {
  switch (slug) {
    case 'cholera':
      return '7-14 days after symptoms';
    case 'diarrhea':
      return 'As long as symptoms persist';
    case 'typhoid':
      return '2-4 weeks after symptoms';
    case 'hepatitis-a':
      return '2 weeks before to 1 week after symptoms';
    default:
      return 'Varies';
  }
}

function getSurvivalTime(slug: string) {
  switch (slug) {
    case 'cholera':
      return 'Up to 2 weeks in water';
    case 'diarrhea':
      return 'Days to weeks depending on pathogen';
    case 'typhoid':
      return 'Up to 2 weeks in water';
    case 'hepatitis-a':
      return 'Up to 1 month in water';
    default:
      return 'Varies by pathogen';
  }
}

function getVaccinationInfo(slug: string) {
  switch (slug) {
    case 'cholera':
      return 'Oral vaccine available, 2 doses, 85% effective';
    case 'diarrhea':
      return 'Rotavirus vaccine for children, no specific vaccine for adults';
    case 'typhoid':
      return 'Injectable and oral vaccines available, 50-80% effective';
    case 'hepatitis-a':
      return 'Highly effective vaccine, 2 doses, 95% effective';
    default:
      return 'Check with healthcare provider';
  }
}

function getRecoveryTime(slug: string) {
  switch (slug) {
    case 'cholera':
      return '3-7 days with proper treatment';
    case 'diarrhea':
      return '2-7 days depending on cause';
    case 'typhoid':
      return '2-4 weeks with antibiotic treatment';
    case 'hepatitis-a':
      return '2-6 months for full recovery';
    default:
      return 'Varies by individual';
  }
}

function getGlobalImpact(slug: string) {
  switch (slug) {
    case 'cholera':
      return '1.3-4 million cases annually, 21,000-143,000 deaths worldwide';
    case 'diarrhea':
      return '2 billion cases annually, 1.6 million deaths, mostly children under 5';
    case 'typhoid':
      return '11-20 million cases annually, 128,000-161,000 deaths globally';
    case 'hepatitis-a':
      return '1.4 million cases annually, 7,134 deaths worldwide';
    default:
      return 'Significant global health impact';
  }
}

function getAtRiskGroups(slug: string) {
  switch (slug) {
    case 'cholera':
      return 'Children under 5, elderly, malnourished individuals, areas with poor sanitation';
    case 'diarrhea':
      return 'Children under 5, elderly, immunocompromised, travelers to developing countries';
    case 'typhoid':
      return 'Children and young adults, travelers to endemic areas, food handlers';
    case 'hepatitis-a':
      return 'Children in developing countries, travelers, men who have sex with men, drug users';
    default:
      return 'Varies by disease';
  }
}

function getResearchInfo(slug: string) {
  switch (slug) {
    case 'cholera':
      return 'Ongoing research on improved vaccines, rapid diagnostic tests, and water treatment methods';
    case 'diarrhea':
      return 'Research focuses on probiotics, new antimicrobials, and improved ORS formulations';
    case 'typhoid':
      return 'Development of conjugate vaccines, antimicrobial resistance monitoring, and improved diagnostics';
    case 'hepatitis-a':
      return 'Research on universal vaccination programs, improved vaccine formulations, and outbreak prevention';
    default:
      return 'Active research and development ongoing';
  }
}

