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
      className="flex flex-col min-h-screen transition-all duration-300 m-0 p-0"
    >
      {children}
    </div>
  );
}