"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { collapsed } = useSidebar();

  return (
    <div 
      className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        collapsed ? "ml-16" : "ml-56"
      )}
    >
      {children}
    </div>
  );
}