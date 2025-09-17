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

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const formSchema = z.object({
  disease: z.string().min(1, "Please select a disease"),
  latitude: z.number(),
  longitude: z.number(),
  details: z.string().optional(),
});

const diseases = [
  "Diarrhea", 
  "Cholera", 
  "Typhoid", 
  "Hepatitis A", 
  "Dysentery", 
  "Giardiasis", 
  "Salmonellosis", 
  "Leptospirosis"
];

export default function ReportPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);

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

    const response = await fetch("/api/incidents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      alert("Incident reported successfully!");
      form.reset();
      setPosition(null);
    } else {
      let msg = "Failed to report incident.";
      try {
        const data = await response.json();
        if (data?.error) {
          msg += `\n${typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}`;
        }
      } catch {}
      alert(msg);
    }
  };

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center font-heading-serif">Report an Incident (for ASHA/Community Volunteers/Local Clinic workers only)</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sans">Step 1: Select Disease</CardTitle>
            <CardDescription>
              Choose the suspected water-borne disease.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {diseases.map((disease) => (
                <Button
                  key={disease}
                  type="button"
                  variant={
                    form.watch("disease") === disease ? "default" : "outline"
                  }
                  onClick={() => form.setValue("disease", disease)}
                  className="font-bookman-old-style text-lg md:text-xl"
                >
                  {disease}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sans">Step 2: Select Location</CardTitle>
            <CardDescription>
              Search for a location, use auto-detect, or click on the map to drop a pin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for Location
              </label>
              <LocationSearch
                onLocationSelect={(lat, lng, address) => {
                  setPosition([lat, lng]);
                  form.setValue("latitude", lat);
                  form.setValue("longitude", lng);
                }}
                placeholder="Search for incident location..."
                className="mb-4"
              />
            </div>
            
            {/* Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Click on Map
              </label>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <Map
                  position={position}
                  onPositionChange={(lat, lng) => {
                    setPosition([lat, lng]);
                    form.setValue("latitude", lat);
                    form.setValue("longitude", lng);
                  }}
                />
              </div>
            </div>
            
            {/* Location Info */}
            {position && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-800">
                  <span className="mr-2">📍</span>
                  <span className="text-sm">
                    Location selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sans">Step 3: Additional Details (Optional)</CardTitle>
            <CardDescription>
              Provide any other relevant information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea {...form.register("details")} />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={!form.watch("disease") || !position}>
          Submit Report
        </Button>
      </form>
    </div>
  );
}
