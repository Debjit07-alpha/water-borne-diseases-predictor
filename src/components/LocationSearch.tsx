"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationSearch({ 
  onLocationSelect, 
  placeholder = "Search for a location...",
  className = ""
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 3) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&addressdetails=1`
        );
        const data = await response.json();
        setResults(data);
        setShowDropdown(data.length > 0);
      } catch (error) {
        console.error("Error searching locations:", error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const getCurrentLocation = () => {
    setIsAutoDetecting(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsAutoDetecting(false);
      return;
    }

    let watchId: number | null = null;
    let timeoutId: number | null = null;
    let best: { lat: number; lng: number; accuracy: number } | null = null;

    const stopWatching = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const finalize = async () => {
      if (!best) {
        setIsAutoDetecting(false);
        return;
      }
      const { lat, lng } = best;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name || "Current Location";

        setSelectedAddress(address);
        setQuery(address);
        onLocationSelect(lat, lng, address);
        setShowDropdown(false);
      } catch (error) {
        console.error("Error getting address:", error);
        setSelectedAddress("Current Location");
        setQuery("Current Location");
        onLocationSelect(lat, lng, "Current Location");
        setShowDropdown(false);
      } finally {
        setIsAutoDetecting(false);
      }
    };

    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          if (!best || accuracy < best.accuracy) {
            best = { lat: latitude, lng: longitude, accuracy: accuracy || Number.POSITIVE_INFINITY };
          }
          // If accuracy is good enough, stop early
          if (best.accuracy <= 30) {
            stopWatching();
            finalize();
          }
        },
        (error) => {
          console.error("Error watching location:", error);
          // Fall back to single reading
          navigator.geolocation.getCurrentPosition(
            (single) => {
              const { latitude, longitude, accuracy } = single.coords;
              best = { lat: latitude, lng: longitude, accuracy: accuracy || 1000 };
              finalize();
            },
            () => {
              alert("Unable to detect location.");
              setIsAutoDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );

      // Safety timeout: finalize with best fix after 6 seconds
      timeoutId = window.setTimeout(() => {
        stopWatching();
        finalize();
      }, 6000);
    } catch (e) {
      console.error(e);
      setIsAutoDetecting(false);
    }
  };

  const handleLocationSelect = (result: LocationResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setQuery(result.display_name);
    setSelectedAddress(result.display_name);
    onLocationSelect(lat, lng, result.display_name);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          className="pl-10 pr-4 py-2 w-full"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
        )}
      </div>

      <div className="mt-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isAutoDetecting}
          className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-3 text-sm font-medium transition-all ${
            isAutoDetecting 
              ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white cursor-pointer shadow-sm hover:shadow-md'
          }`}
          style={{ WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.3)' }}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isAutoDetecting ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </div>
          <span className="flex-1 text-center">
            {isAutoDetecting ? 'Detecting Location...' : '📍 Auto Detect Location'}
          </span>
          <div className="w-5 h-5"> {/* Spacer for centering */}</div>
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.place_id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleLocationSelect(result)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-900 leading-relaxed">
                  {result.display_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}