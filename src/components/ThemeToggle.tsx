"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Palette } from 'lucide-react';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
      >
        <span className="text-sm font-medium text-blue-200">Choose your theme</span>
        <Palette size={16} className="text-blue-300" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-3 min-w-[200px] z-50">
          {/* Header */}
          <div className="px-4 pb-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-blue-600">Theme Options</h3>
          </div>
          
          {/* Theme Options */}
          <div className="py-2">
            <button
              onClick={() => {
                if (theme !== 'light') toggleTheme();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                theme === 'light' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Sun size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Light Theme</div>
                  <div className="text-xs text-gray-500">Bright and clean</div>
                </div>
              </div>
              {theme === 'light' && (
                <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
              )}
            </button>
            
            <button
              onClick={() => {
                if (theme !== 'dark') toggleTheme();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                theme === 'dark' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-800 flex items-center justify-center">
                  <Moon size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Dark Theme</div>
                  <div className="text-xs text-gray-500">Easy on the eyes</div>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}