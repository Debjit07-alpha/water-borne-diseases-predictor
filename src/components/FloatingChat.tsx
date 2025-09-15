"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Dynamically import existing Chat to avoid SSR issues if any
const ChatInner = dynamic(() => import("@/components/Chat"), { ssr: false });

/**
 * FloatingChat renders a small launcher button bottom-right and when opened
 * displays the full existing Chat interface. This wrapper keeps global layout clean.
 */
export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  // Close on route change (optional enhancement) - we rely on hashchange/popstate
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return (
    <div className="pointer-events-none">
      {/* Launcher Button */}
      <Button
        onClick={() => setOpen(o => !o)}
        size="icon"
        aria-label={open ? "Close chat" : "Open chat"}
        className="pointer-events-auto fixed bottom-4 right-4 z-[60] h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {open && (
        <div className="pointer-events-auto fixed bottom-24 right-4 z-[55] w-[380px] max-w-[90vw] h-[520px] animate-in fade-in zoom-in-95">
          <Card className="w-full h-full flex flex-col overflow-hidden shadow-2xl border border-primary/30 bg-white">
            <ChatInner />
          </Card>
        </div>
      )}
    </div>
  );
}
