"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  LayoutDashboard, 
  AlertCircle, 
  GraduationCap, 
  Map, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true); // Closed by default

  return (
    <aside 
      className={cn(
        "h-full bg-white/70 backdrop-blur-lg shadow-2xl border-r border-white/30 transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/20">
        <div className="font-semibold tracking-tight font-heading-sans text-[#0B86FF]">
          {collapsed ? "RP" : "River Pulse"}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-[#0B86FF]/10 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} className="text-[#0B86FF]" /> : <ChevronLeft size={16} className="text-[#0B86FF]" />}
        </button>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors",
                "text-sm font-medium text-[#0B2545]"
              )}
            >
              <LayoutDashboard size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/map"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors",
                "text-sm font-medium text-[#0B2545]"
              )}
            >
              <Map size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Disease Map</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/report"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors",
                "text-sm font-medium text-[#0B2545]"
              )}
            >
              <AlertCircle size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Report Incident</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/diseases"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors",
                "text-sm font-medium text-[#0B2545]"
              )}
            >
              <GraduationCap size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Learn More</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
