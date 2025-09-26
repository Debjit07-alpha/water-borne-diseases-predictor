"use client";

import Link from "next/link";
import { Button } from "./ui/button";
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
    <header className="shadow-lg w-full m-0 p-0" style={{backgroundColor: '#0f172a'}}>
      {/* First Line - Platform Title */}
      <div className="py-2 px-6 border-b w-full" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(15, 23, 42, 0.7)'}}>
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
                  </h1>
                  <div className="text-xs font-medium opacity-90 animate-pulse" style={{color: 'rgba(255, 255, 255, 0.7)'}}>
                    🇮🇳 A Digital India Initiative - Empowering Communities Through Technology
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="text-xs animate-bounce" style={{color: 'rgba(255, 255, 255, 0.7)'}}>
            Building a Healthier Tomorrow | भविष्य का स्वास्थ्य
          </div>
        </div>
      </div>
      
      {/* Second Line - Navigation Menu */}
      <div className="flex h-12 items-center justify-between px-6 w-full" style={{backgroundColor: '#0f172a'}}>
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium" style={{color: 'rgba(255, 255, 255, 0.6)'}}>
            Quick Access:
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className="text-sm font-medium transition-all duration-300 hover:scale-110 px-4 py-2 rounded-full relative group hover:shadow-lg" style={{color: 'rgba(255, 255, 255, 0.8)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
              <span className="relative z-10 animate-pulse">🏠 HOME</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/education" className="text-sm font-medium transition-all duration-300 hover:scale-110 px-4 py-2 rounded-full relative group hover:shadow-lg" style={{color: 'rgba(255, 255, 255, 0.8)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
              <span className="relative z-10">🎓 EDUCATION</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/diseases" className="text-sm font-medium transition-all duration-300 hover:scale-110 px-4 py-2 rounded-full relative group hover:shadow-lg" style={{color: 'rgba(255, 255, 255, 0.8)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
              <span className="relative z-10">📚 LEARN MORE</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <button 
              onClick={() => handleProtectedNavigation('/report')}
              className="text-sm font-medium transition-all duration-300 hover:scale-110 px-4 py-2 rounded-full cursor-pointer relative group hover:shadow-lg"
              style={{color: 'rgba(255, 255, 255, 0.8)'}} 
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'} 
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              <span className="relative z-10">📋 REPORT</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </button>
            <button 
              onClick={() => handleProtectedNavigation('/sms-alerts')}
              className="text-sm font-medium transition-all duration-300 hover:scale-110 px-4 py-2 rounded-full cursor-pointer relative group hover:shadow-lg"
              style={{color: 'rgba(255, 255, 255, 0.8)'}} 
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'} 
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              <span className="relative z-10">📱 SMS ALERTS</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </button>
            <Link href="/medical-services" className="text-sm font-medium transition-all duration-300 hover:scale-110 px-4 py-2 rounded-full relative group hover:shadow-lg animate-bounce" style={{color: 'rgba(255, 255, 255, 0.8)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
              <span className="relative z-10">🚨 24/7</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-300/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
          </nav>
          
          {/* User Authentication Section */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
                <User className="w-4 h-4" />
                <span>Welcome, {user?.fullName || user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm font-medium transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full relative group hover:shadow-lg"
                style={{color: 'rgba(255, 255, 255, 0.8)'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'} 
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>🚪 Logout</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl relative group overflow-hidden border border-white/20 hover:border-white/40"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              <span className="relative z-10">🔐 Login / Register</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 rounded-full"></span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
