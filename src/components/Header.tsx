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
    <header className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white">
            <div className="text-xs font-medium opacity-90">A Digital India Initiative</div>
            <h1 className="text-xl font-bold tracking-tight">
              RIVER PULSE
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
            <button 
              onClick={() => handleProtectedNavigation('/report')}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              REPORT
            </button>
            <button 
              onClick={() => handleProtectedNavigation('/sms-alerts')}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              SMS ALERTS
            </button>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-red-300 hover:text-red-100 text-sm font-medium transition-colors">
                ADMIN
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
                className="flex items-center space-x-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Login / Register
            </Link>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
