"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Navigation, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationSuggestion {
  id: string;
  display_name: string;
  lat: string;
  lon: string;
  place_rank?: number;
  type?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
  initialValue?: string;
  onReverseGeocode?: (lat: number, lng: number) => Promise<string>;
}

export default function LocationSearch({ 
  onLocationSelect, 
  placeholder = "Search for a location...",
  initialValue = "",
  onReverseGeocode
}: LocationSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Expose reverse geocoding function to parent
  useEffect(() => {
    if (onReverseGeocode) {
      // This allows parent component to call reverse geocoding
      // We'll pass the function reference
    }
  }, [onReverseGeocode]);

  // Method to update location from external source (like map click)
  const updateLocationFromCoordinates = async (lat: number, lng: number) => {
    setIsLoading(true);
    const address = await reverseGeocode(lat, lng);
    setQuery(address);
    saveRecentSearch(address);
    setIsLoading(false);
    return address;
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-locations');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Auto-resize textarea when query changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 100) + 'px';
    }
  }, [query]);

  // Save recent searches
  const saveRecentSearch = (location: string) => {
    const updated = [location, ...recentSearches.filter(item => item !== location)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-locations', JSON.stringify(updated));
  };

  // Debounced search function
  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Using Nominatim (OpenStreetMap) geocoding API as it's free
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `limit=15&` +
        `addressdetails=1&` +
        `countrycodes=in&` + // Focus on India
        `accept-language=en&` +
        `dedupe=1`
      );

      if (response.ok) {
        const data: LocationSuggestion[] = await response.json();
        // Sort by place rank and importance
        const sortedData = data.sort((a, b) => {
          const rankA = typeof a.place_rank === 'number' ? a.place_rank : parseInt(a.place_rank || '30');
          const rankB = typeof b.place_rank === 'number' ? b.place_rank : parseInt(b.place_rank || '30');
          return rankA - rankB;
        });
        setSuggestions(sortedData);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(true);

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 100) + 'px';
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300); // Reduced debounce time for faster response
  };

  // Handle manual text editing (when user types in the field)
  const handleManualEdit = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(true);

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 100) + 'px';
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle location selection
  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const address = formatFullAddress(suggestion); // Use full address
    
    setQuery(address);
    setIsOpen(false);
    setSuggestions([]);
    saveRecentSearch(address);
    onLocationSelect(lat, lng, address);
    
    // Keep focus on input for editing with a slight delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Place cursor at the end of the text
        inputRef.current.setSelectionRange(address.length, address.length);
      }
    }, 50);
  };

  // Get full address from coordinates (reverse geocoding)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `addressdetails=1&` +
        `accept-language=en`
      );

      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    console.log('getCurrentLocation called');
    
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      alert('Geolocation is not supported by this browser.');
      return;
    }

    console.log('Starting geolocation request...');
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Position obtained:', position.coords);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          console.log('Making reverse geocoding request...');
          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
            `format=json&` +
            `lat=${lat}&` +
            `lon=${lng}&` +
            `addressdetails=1&` +
            `accept-language=en`
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            console.log('Address obtained:', address);
            
            // Set the location data
            setQuery(address);
            saveRecentSearch(address);
            setIsOpen(false); // Close dropdown
            onLocationSelect(lat, lng, address);
            
            // Keep focus and cursor
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                const length = address.length;
                inputRef.current.setSelectionRange(length, length);
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error getting address:', error);
          const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setQuery(address);
          setIsOpen(false); // Close dropdown
          onLocationSelect(lat, lng, address);
          
          // Keep focus and cursor
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              const length = address.length;
              inputRef.current.setSelectionRange(length, length);
            }
          }, 100);
        } finally {
          console.log('Geolocation request completed');
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your current location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permission denied. Please allow location access and try again.';
            console.log('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            console.log('Location unavailable');
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            console.log('Location timeout');
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            console.log('Unknown location error');
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,  // Increased timeout
        maximumAge: 60000
      }
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow normal text editing keys to work
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      // Let the default behavior happen for text editing
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleLocationSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        // Only close dropdown, don't blur the input
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatAddress = (suggestion: LocationSuggestion) => {
    const parts = suggestion.display_name.split(',');
    // Return first 4-5 parts for more detailed display
    if (parts.length > 5) {
      return parts.slice(0, 5).join(', ').trim();
    }
    return suggestion.display_name.trim();
  };

  const formatFullAddress = (suggestion: LocationSuggestion) => {
    return suggestion.display_name.trim();
  };

  const getLocationIcon = (suggestion: LocationSuggestion) => {
    const type = suggestion.type || '';
    if (type.includes('city') || type.includes('town')) return '🏙️';
    if (type.includes('village')) return '🏘️';
    if (type.includes('road') || type.includes('street')) return '🛣️';
    if (type.includes('hospital')) return '🏥';
    if (type.includes('school')) return '🏫';
    return '📍';
  };

  return (
    <div className="relative w-full">
      <div className="relative" onClick={() => {
        if (inputRef.current) {
          inputRef.current.focus();
          setTimeout(() => {
            if (inputRef.current) {
              const length = query.length;
              inputRef.current.setSelectionRange(length, length);
            }
          }, 0);
        }
      }}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
          <Search className="h-4 w-4" />
        </div>
        
        <textarea
          ref={inputRef as any}
          value={query}
          onChange={(e) => handleManualEdit(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true);
            // Always position cursor at the end when focusing
            setTimeout(() => {
              if (inputRef.current) {
                const length = query.length;
                inputRef.current.setSelectionRange(length, length);
              }
            }, 0);
            
            if (query.length >= 2) {
              searchLocations(query);
            }
          }}
          onClick={() => {
            // Ensure focus when clicked and position cursor at end
            if (inputRef.current) {
              inputRef.current.focus();
              setTimeout(() => {
                if (inputRef.current) {
                  const length = query.length;
                  inputRef.current.setSelectionRange(length, length);
                }
              }, 0);
            }
          }}
          onMouseDown={() => {
            // Additional handler for mouse down to ensure cursor positioning
            setTimeout(() => {
              if (inputRef.current && document.activeElement === inputRef.current) {
                const length = query.length;
                inputRef.current.setSelectionRange(length, length);
              }
            }, 10);
          }}
          onBlur={() => {
            // Don't close immediately to allow for suggestion clicks
            setTimeout(() => setIsOpen(false), 150);
          }}
          placeholder={placeholder}
          className="pl-10 pr-20 text-sm min-h-[50px] max-h-[100px] py-3 leading-relaxed cursor-text focus:cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none w-full border border-gray-300 rounded-md overflow-y-auto"
          disabled={isLoading}
          maxLength={1000}
          autoComplete="off"
          spellCheck={false}
          tabIndex={0}
          readOnly={false}
          rows={1}
          style={{
            caretColor: '#000',
            userSelect: 'text',
            pointerEvents: 'auto',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
                if (inputRef.current) {
                  inputRef.current.focus();
                  // Since query is empty, cursor will be at position 0
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.setSelectionRange(0, 0);
                    }
                  }, 0);
                }
              }}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {/* Auto Detect Location Button - Always visible at top */}
          <div className="p-2 border-b border-gray-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Auto-detect button clicked!');
                getCurrentLocation();
              }}
              disabled={isLoading}
              className={`w-full text-left px-3 py-3 hover:bg-blue-50 active:bg-blue-100 rounded-md flex items-center gap-3 text-sm transition-colors cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-sm'}`}
              style={{ WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.1)' }}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Navigation className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-700">📍 Auto Detect Location</div>
                <div className="text-xs text-blue-600">
                  {isLoading ? 'Getting your location...' : 'Use your current location'}
                </div>
              </div>
            </button>
          </div>

          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Searching locations...
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="p-2">
              {query.length < 2 && recentSearches.length > 0 && (
                <>
                  <div className="text-xs font-medium text-gray-500 mb-2 px-3">Recent Searches</div>
                  {recentSearches.map((recent, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(recent);
                        setIsOpen(false);
                        // Keep focus and cursor after selecting recent search
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                            const length = recent.length;
                            inputRef.current.setSelectionRange(length, length);
                          }
                        }, 100);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-2 text-sm"
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{recent}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}

          {!isLoading && query.length < 2 && recentSearches.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <div className="text-sm">Start typing to search locations</div>
              <div className="text-xs text-gray-400 mt-1">Or use auto-detect above</div>
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <div className="p-2">
              {query.length >= 2 && (
                <div className="text-xs font-medium text-gray-500 mb-2 px-3">Suggestions</div>
              )}
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id || index}
                  onClick={() => handleLocationSelect(suggestion)}
                  className={`w-full text-left px-3 py-4 rounded-md flex items-start gap-3 text-sm transition-colors ${
                    selectedIndex === index
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg mt-1 flex-shrink-0">
                    {getLocationIcon(suggestion)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 leading-relaxed text-wrap break-words">
                      {formatFullAddress(suggestion)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      📍 Click to select this location
                    </div>
                  </div>
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}

          {!isLoading && query.length >= 2 && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <div className="text-sm">No locations found</div>
              <div className="text-xs text-gray-400">Try a different search term</div>
            </div>
          )}

          {query.length > 0 && query.length < 2 && (
            <div className="p-4 text-center text-gray-500">
              <div className="text-sm">Type at least 2 characters to search</div>
            </div>
          )}
        </div>
      )}
      
      {/* Standalone Auto-Detect Button - Always Visible */}
      <div className="mt-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Standalone auto-detect button clicked!');
            getCurrentLocation();
          }}
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-3 text-sm font-medium transition-all ${
            isLoading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white cursor-pointer shadow-sm hover:shadow-md'
          }`}
          style={{ WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.3)' }}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </div>
          <span>
            {isLoading ? 'Getting your location...' : '📍 Use My Current Location'}
          </span>
        </button>
      </div>
    </div>
  );
}