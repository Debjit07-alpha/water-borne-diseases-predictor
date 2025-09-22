"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

// Simple icon components matching data.gov.in style
const DashboardIcon = ({ className = "" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const MapIcon = ({ className = "" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9 2L15 6L21 4V18L15 20L9 16L3 18V4L9 2Z"/>
  </svg>
);

const ReportIcon = ({ className = "" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <path d="M8 6H16M8 10H16M8 14H12" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LearnIcon = ({ className = "" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
    <path d="M2 17L12 22L22 17"/>
    <path d="M2 12L12 17L22 12"/>
  </svg>
);

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();

  const menuItems = [
    { href: "/", icon: DashboardIcon, label: "Dashboard" },
    { href: "/map", icon: MapIcon, label: "Disease Map" },
    { href: "/report", icon: ReportIcon, label: "Report Incident" },
    { href: "/diseases", icon: LearnIcon, label: "Learn More" },
  ];

  return (
    <aside 
      className={cn(
        "h-screen bg-gradient-to-b from-blue-600 to-blue-800 transition-all duration-300 fixed left-0 top-0 z-40 shadow-xl",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-lg">
            {collapsed ? "RP" : "River Pulse"}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              {collapsed ? (
                <path d="M9 18L15 12L9 6"/>
              ) : (
                <path d="M15 18L9 12L15 6"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 relative group",
                    isActive 
                      ? "bg-white/20 text-white shadow-sm" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                  title={collapsed ? item.label : ""}
                >
                  <Icon className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[9999] transition-opacity">
                      {item.label}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer section */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white/60 text-xs">
            <div className="mb-2 font-medium">A Digital India Initiative</div>
            <div className="text-white/40">Government of India</div>
          </div>
        </div>
      )}
    </aside>
  );
}
