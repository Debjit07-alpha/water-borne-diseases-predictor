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

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const formSchema = z.object({
  disease: z.string().min(1, "Please select a disease"),
  latitude: z.number(),
  longitude: z.number(),
  details: z.string().optional(),
});

const diseases = ["Diarrhea", "Cholera", "Typhoid", "Hepatitis A"];

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
      alert("Failed to report incident.");
    }
  };

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center">Report an Incident</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Disease</CardTitle>
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
                >
                  {disease}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Select Location</CardTitle>
            <CardDescription>
              Click on the map to drop a pin or use your device's GPS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <Map
                position={position}
                onPositionChange={(lat, lng) => {
                  setPosition([lat, lng]);
                  form.setValue("latitude", lat);
                  form.setValue("longitude", lng);
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Additional Details (Optional)</CardTitle>
            <CardDescription>
              Provide any other relevant information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea {...form.register("details")} />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Submit Report
        </Button>
      </form>
    </div>
  );
}
