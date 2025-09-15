"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function ChatPage() {
  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto py-10 px-4 bg-gradient-to-br from-sky-50 via-white to-sky-100">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" /> AI Health Assistant
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Ask questions about water-borne diseases, symptoms, prevention, and send images for analysis.
          </p>
        </div>
        <Card className="w-full min-h-[600px] h-[70vh] shadow-xl border border-primary/20 flex flex-col">
          <Chat />
        </Card>
      </div>
    </div>
  );
}
