"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";

export default function Header() {
  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white">
            <div className="text-xs font-medium opacity-90">A Digital India Initiative</div>
            <h1 className="text-xl font-bold tracking-tight">
              River Pulse
              <span className="text-sm font-normal opacity-80 ml-2">
                Water-Borne Disease Prevention Platform
              </span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              HOME
            </Link>
            <Link href="/map" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              DISEASE MAP
            </Link>
            <Link href="/diseases" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              LEARN MORE
            </Link>
            <Link href="/report" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              REPORT
            </Link>
            <Link href="/admin" className="text-red-300 hover:text-red-100 text-sm font-medium transition-colors">
              ADMIN
            </Link>
          </nav>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
