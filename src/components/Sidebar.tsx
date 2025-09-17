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
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors relative group",
                "text-sm font-medium text-[#0B2545]"
              )}
              title={collapsed ? "Dashboard" : ""}
            >
              <LayoutDashboard size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Dashboard</span>}
              {collapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[9999] border border-gray-700">
                  Dashboard
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/map"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors relative group",
                "text-sm font-medium text-[#0B2545]"
              )}
              title={collapsed ? "Disease Map" : ""}
            >
              <Map size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Disease Map</span>}
              {collapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[9999] border border-gray-700">
                  Disease Map
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/report"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors relative group",
                "text-sm font-medium text-[#0B2545]"
              )}
              title={collapsed ? "Report Incident" : ""}
            >
              <AlertCircle size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Report Incident</span>}
              {collapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[9999] border border-gray-700">
                  Report Incident
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/diseases"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B86FF]/10 transition-colors relative group",
                "text-sm font-medium text-[#0B2545]"
              )}
              title={collapsed ? "Learn More" : ""}
            >
              <GraduationCap size={18} className="text-[#0B86FF]" />
              {!collapsed && <span>Learn More</span>}
              {collapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[9999] border border-gray-700">
                  Learn More
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
