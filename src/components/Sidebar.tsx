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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-full bg-[#2C3E50] text-white shadow-lg transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="font-semibold tracking-tight">
          {collapsed ? "AW" : "AquaWatch"}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                "text-sm font-medium"
              )}
            >
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/map"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                "text-sm font-medium"
              )}
            >
              <Map size={18} />
              {!collapsed && <span>Disease Map</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/report"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                "text-sm font-medium"
              )}
            >
              <AlertCircle size={18} />
              {!collapsed && <span>Report Incident</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/diseases"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                "text-sm font-medium"
              )}
            >
              <GraduationCap size={18} />
              {!collapsed && <span>Learn More</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
