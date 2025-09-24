"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import dynamic from "next/dynamic";
import LocationSearch from "@/components/LocationSearch";
import ProtectedRoute from "@/components/ProtectedRoute";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const formSchema = z.object({
  disease: z.string().min(1, "Please select a disease"),
  latitude: z.number(),
  longitude: z.number(),
  details: z.string().optional(),
});

// Disease configurations with colors and emojis
const diseases = [
  { name: "Diarrhea", emoji: "🤒", color: "from-yellow-400 to-amber-500", bgColor: "from-yellow-50 to-amber-100", textColor: "text-yellow-800", borderColor: "border-yellow-300" },
  { name: "Cholera", emoji: "🦠", color: "from-red-400 to-red-600", bgColor: "from-red-50 to-red-100", textColor: "text-red-800", borderColor: "border-red-300" },
  { name: "Typhoid", emoji: "🌡️", color: "from-indigo-400 to-indigo-600", bgColor: "from-indigo-50 to-indigo-100", textColor: "text-indigo-800", borderColor: "border-indigo-300" },
  { name: "Hepatitis A", emoji: "🔴", color: "from-purple-400 to-purple-600", bgColor: "from-purple-50 to-purple-100", textColor: "text-purple-800", borderColor: "border-purple-300" },
  { name: "Dysentery", emoji: "💊", color: "from-orange-400 to-orange-600", bgColor: "from-orange-50 to-orange-100", textColor: "text-orange-800", borderColor: "border-orange-300" },
  { name: "Giardiasis", emoji: "🧬", color: "from-green-400 to-green-600", bgColor: "from-green-50 to-green-100", textColor: "text-green-800", borderColor: "border-green-300" },
  { name: "Salmonellosis", emoji: "🍽️", color: "from-pink-400 to-pink-600", bgColor: "from-pink-50 to-pink-100", textColor: "text-pink-800", borderColor: "border-pink-300" },
  { name: "Leptospirosis", emoji: "🐭", color: "from-blue-400 to-blue-600", bgColor: "from-blue-50 to-blue-100", textColor: "text-blue-800", borderColor: "border-blue-300" },
];

function ReportPageContent() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `addressdetails=1&` +
        `accept-language=en`
      );

      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Handle map click with reverse geocoding
  const handleMapClick = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setIsLoadingAddress(true);
    
    try {
      const address = await reverseGeocode(lat, lng);
      setSelectedAddress(address);
    } catch (error) {
      setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoadingAddress(false);
    }
    
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  // Handle location search selection (allows further editing)
  const handleLocationSearchSelect = (lat: number, lng: number, address?: string) => {
    setPosition([lat, lng]);
    setSelectedAddress(address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disease: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.disease) {
      alert("Please select a disease.");
      return;
    }
    if (!position) {
      alert("Please select a location on the map or use Auto Detect.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert("🎉 Incident reported successfully! Thank you for your contribution to community health.");
        form.reset();
        setPosition(null);
        setSelectedAddress("");
        setIsLoadingAddress(false);
      } else {
        let msg = "❌ Failed to report incident.";
        try {
          const data = await response.json();
          if (data?.error) {
            msg += `\n${typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}`;
          }
        } catch {}
        alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-xl mb-6 transform hover:scale-105 transition-all duration-300">
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-heading-serif">
              Report Water-Borne Disease Incident
            </h1>
          </div>
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-xl p-4 max-w-3xl mx-auto shadow-lg">
            <p className="text-lg text-amber-800 font-semibold mb-1">
              For ASHA/Community Volunteers/Local Clinic Workers Only
            </p>
            <p className="text-base text-amber-700">
              Report incidents to help protect community health
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Disease Selection */}
          <div className="relative">
            <div className="absolute -left-4 top-6 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              1
            </div>
            <Card className="bg-gradient-to-r from-white to-blue-50 border-blue-200 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ml-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg py-4">
                <CardTitle className="font-heading-sans text-xl">
                  Disease Selection
                </CardTitle>
                <CardDescription className="text-blue-100 text-base">
                  Select the suspected water-borne disease
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {diseases.map((disease) => (
                    <Button
                      key={disease.name}
                      type="button"
                      variant="outline"
                      onClick={() => form.setValue("disease", disease.name)}
                      className={`
                        relative overflow-hidden h-12 text-base font-semibold transition-all duration-300 transform hover:scale-105
                        ${form.watch("disease") === disease.name 
                          ? `bg-gradient-to-r ${disease.color} text-white border-2 shadow-lg scale-105` 
                          : `bg-gradient-to-r ${disease.bgColor} ${disease.textColor} ${disease.borderColor} border-2 hover:shadow-md`
                        }
                      `}
                    >
                      <span className="text-lg mr-2">{disease.emoji}</span>
                      {disease.name}
                      {form.watch("disease") === disease.name && (
                        <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Button>
                  ))}
                </div>
                {form.watch("disease") && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg">
                    <p className="text-green-800 font-medium flex items-center gap-2">
                      <span className="text-base">✓</span>
                      Selected: <span className="font-semibold">{form.watch("disease")}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Step 2: Location Selection */}
          <div className="relative">
            <div className="absolute -left-4 top-6 w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              2
            </div>
            <Card className="bg-gradient-to-r from-white to-green-50 border-green-200 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ml-6">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg py-4">
                <CardTitle className="font-heading-sans text-xl">
                  Location Selection
                </CardTitle>
                <CardDescription className="text-green-100 text-base">
                  Search or click on map to select incident location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {/* Location Search */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-200">
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Search Location
                  </label>
                  <LocationSearch
                    onLocationSelect={handleLocationSearchSelect}
                    placeholder="Enter location, address, or landmark..."
                    className="text-base h-10 border-2 border-blue-300 focus:border-blue-500 rounded-lg shadow-sm"
                  />
                </div>
                
                {/* Map Section */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-200">
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Interactive Map
                  </label>
                  <div className="h-80 rounded-lg overflow-hidden border-2 border-blue-300 shadow-lg">
                    <Map
                      position={position}
                      onPositionChange={handleMapClick}
                      selectedAddress={selectedAddress}
                    />
                  </div>
                </div>
                
                {/* Location Info */}
                {position && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg p-3 shadow-md">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📍</span>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-green-800 mb-1">
                          Location Selected
                        </p>
                        {isLoadingAddress ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-green-700 text-sm">Getting address...</span>
                          </div>
                        ) : (
                          <>
                            {selectedAddress && (
                              <p className="text-green-800 mb-2 text-sm leading-relaxed">
                                <span className="font-medium">Address:</span> {selectedAddress}
                              </p>
                            )}
                            <p className="text-xs text-green-600 font-mono bg-green-50 p-1 rounded border border-green-200">
                              Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Step 3: Additional Details */}
          <div className="relative">
            <div className="absolute -left-4 top-6 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              3
            </div>
            <Card className="bg-gradient-to-r from-white to-purple-50 border-purple-200 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ml-6">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg py-4">
                <CardTitle className="font-heading-sans text-xl">
                  Additional Details
                </CardTitle>
                <CardDescription className="text-purple-100 text-base">
                  Optional: Add relevant information about the incident
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Additional Information
                  </label>
                  <Textarea 
                    {...form.register("details")} 
                    placeholder="Describe symptoms, affected individuals, timeline, or other relevant details..."
                    className="min-h-24 text-base p-3 border-2 border-purple-300 focus:border-purple-500 rounded-lg shadow-sm"
                  />
                  <p className="text-sm text-gray-600">
                    Include: symptoms observed, number affected, incident timeline, water source information
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <Button 
              type="submit" 
              size="lg" 
              disabled={!form.watch("disease") || !position || isSubmitting}
              className={`
                text-lg font-semibold py-3 px-8 rounded-xl transform transition-all duration-300 shadow-lg
                ${(!form.watch("disease") || !position || isSubmitting)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:scale-105 hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <span>Submit Incident Report</span>
              )}
            </Button>
            
            {(!form.watch("disease") || !position) && (
              <div className="mt-3 p-3 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300 rounded-lg max-w-md mx-auto">
                <p className="text-yellow-800 text-sm font-medium">
                  Complete steps {!form.watch("disease") ? "1" : ""}{!form.watch("disease") && !position ? " and " : ""}{!position ? "2" : ""} to submit
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <ProtectedRoute allowedRoles={['ASHA_WORKER', 'COMMUNITY_VOLUNTEER', 'CLINIC_STAFF', 'INCIDENT_REPORTER', 'ADMIN']}>
      <ReportPageContent />
    </ProtectedRoute>
  );
}
