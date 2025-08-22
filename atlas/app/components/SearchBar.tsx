// components/SearchBar.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  variant?: 'default' | 'hero';
}

interface SearchResult {
  id: number;
  name: string;
  type: string;
  category?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [popularLocations, setPopularLocations] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock data - replace with actual data from your API
  const allLocations: SearchResult[] = [
    { id: 1, name: 'Academic Block 1 (AB1)', type: 'Building', category: 'Academic' },
    { id: 2, name: 'Academic Block 2 (AB2)', type: 'Building', category: 'Academic' },
    { id: 3, name: 'Academic Block 3 (AB3)', type: 'Building', category: 'Academic' },
    { id: 4, name: 'Lecture Hall Complex', type: 'Building', category: 'Academic' },
    { id: 5, name: 'Central Library', type: 'Facility', category: 'Library' },
    { id: 6, name: 'Sports Complex', type: 'Facility', category: 'Sports' },
    { id: 7, name: 'Cafeteria', type: 'Facility', category: 'Food' },
    { id: 8, name: 'Hostel Block A', type: 'Accommodation', category: 'Hostel' },
    { id: 9, name: 'Hostel Block B', type: 'Accommodation', category: 'Hostel' },
    { id: 10, name: 'Medical Center', type: 'Facility', category: 'Health' },
    { id: 11, name: 'Auditorium', type: 'Facility', category: 'Events' },
    { id: 12, name: 'Computer Lab', type: 'Facility', category: 'Academic' },
  ];

  useEffect(() => {
    // Set popular locations on mount
    setPopularLocations(allLocations.slice(0, 5));
    
    // Get recent searches from localStorage
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent).slice(0, 3));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    
    if (value.trim() === '') {
      // Show popular/recent when query is empty
      setResults([]);
    } else {
      // Filter locations based on query
      const filtered = allLocations.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.type.toLowerCase().includes(value.toLowerCase()) ||
        location.category?.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleLocationClick = (location: SearchResult) => {
  // Save to recent searches
  const recent = localStorage.getItem('recentSearches');
  const recentArray = recent ? JSON.parse(recent) : [];
  const updated = [location, ...recentArray.filter((item: SearchResult) => item.id !== location.id)].slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(updated));
  
  // Navigate to location
  router.push(`/location/${location.id}`);
  setIsOpen(false);
  setQuery('');
};

  const baseClasses = "relative w-full";
  const inputClasses = variant === 'hero' 
    ? "w-full px-6 py-4 pl-14 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
    : "w-full px-4 py-3 pl-12 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500";

  const showSuggestions = query.trim() === '' && (recentSearches.length > 0 || popularLocations.length > 0);
  const showResults = query.trim() !== '' && results.length > 0;

  return (
    <div className={`${baseClasses} ${variant === 'hero' ? 'static' : 'relative'}`} ref={searchRef}>
      <div className="relative">
        <Search className={`absolute left-4 ${variant === 'hero' ? 'top-5' : 'top-3.5'} text-gray-400 w-5 h-5 z-10`} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search buildings, facilities, or locations..."
          className={inputClasses}
        />
      </div>

      <AnimatePresence>
        {isOpen && (showSuggestions || showResults) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden ${
              variant === 'hero' ? 'z-[100]' : 'z-50'
            }`}
            style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              ...(variant === 'hero' && { 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
              })
            }}
          >
            {/* Show search results when query exists */}
            {showResults && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Search Results
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleLocationClick(result)}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{result.name}</p>
                      <p className="text-sm text-gray-500">{result.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Show suggestions when query is empty */}
            {showSuggestions && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Recent Searches
                    </div>
                    {recentSearches.map((location) => (
                      <button
                        key={`recent-${location.id}`}
                        onClick={() => handleLocationClick(location)}
                        className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">{location.name}</p>
                          <p className="text-sm text-gray-500">{location.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Locations */}
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Popular Locations
                  </div>
                  {popularLocations.map((location) => (
                    <button
                      key={`popular-${location.id}`}
                      onClick={() => handleLocationClick(location)}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{location.name}</p>
                        <p className="text-sm text-gray-500">{location.type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;