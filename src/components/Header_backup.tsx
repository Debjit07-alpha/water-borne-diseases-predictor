"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleProtectedNavigation = (targetPath: string) => {
    if (!isAuthenticated) {
      router.push(`/auth?redirect=${encodeURIComponent(targetPath)}`);
    } else {
      router.push(targetPath);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg w-full m-0 p-0">
      {/* First Line - Platform Title */}
      <div className="bg-blue-800/30 py-2 px-6 border-b border-blue-500/20 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white group">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-yellow-300 to-orange-300 p-2 rounded-full">
                  <span className="text-blue-800 font-bold text-sm">RP</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight transition-all duration-300 group-hover:scale-105">
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">RIVER PULSE</span>
                    <span className="text-white ml-2">Water-Borne Disease Prevention Platform</span>
                  </h1>
                  <div className="text-xs font-medium opacity-90 animate-pulse">
                    🇮🇳 A Digital India Initiative - Empowering Communities Through Technology
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="text-xs text-white/70 animate-bounce">
            Building a Healthier Tomorrow | भविष्य का स्वास्थ्य
          </div>
        </div>
      </div>
      
      {/* Second Line - Navigation Menu */}
      <div className="flex h-12 items-center justify-between px-6 w-full">
        <div className="flex items-center space-x-2">
          <div className="text-white/60 text-sm font-medium">
            Quick Access:
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-white/10 px-4 py-2 rounded-full relative group hover:shadow-lg">
              <span className="relative z-10 animate-pulse">🏠 HOME</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/map" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-white/10 px-4 py-2 rounded-full relative group hover:shadow-lg">
              <span className="relative z-10">🛡️ PREVENTION</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/diseases" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-white/10 px-4 py-2 rounded-full relative group hover:shadow-lg">
              <span className="relative z-10">📚 LEARN MORE</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <button 
              onClick={() => handleProtectedNavigation('/report')}
              className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-white/10 px-4 py-2 rounded-full cursor-pointer relative group hover:shadow-lg"
            >
              <span className="relative z-10">📋 REPORT</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </button>
            <button 
              onClick={() => handleProtectedNavigation('/sms-alerts')}
              className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-white/10 px-4 py-2 rounded-full cursor-pointer relative group hover:shadow-lg"
            >
              <span className="relative z-10">📱 SMS ALERTS</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </button>
            <Link href="/medical-services" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-white/10 px-4 py-2 rounded-full relative group hover:shadow-lg animate-bounce">
              <span className="relative z-10">🚨 24/7</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-300/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-red-300 hover:text-red-100 text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-red-500/10 px-4 py-2 rounded-full relative group animate-pulse hover:shadow-lg">
                <span className="relative z-10">👑 ADMIN</span>
                <span className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </Link>
            )}
          </nav>
          
          {/* User Authentication Section */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <User className="w-4 h-4" />
                <span>Welcome, {user?.fullName || user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-white/10 px-4 py-2 rounded-full relative group hover:shadow-lg"
              >
                <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>🚪 Logout</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl relative group overflow-hidden border border-white/20 hover:border-white/40"
            >
              <span className="relative z-10">🔐 Login / Register</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 rounded-full"></span>
            </Link>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}