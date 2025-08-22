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
  coordinates?: [number, number]; 
}

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [popularLocations, setPopularLocations] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const allLocations: SearchResult[] = [
    { id: 1, name: 'Academic Block 1 (AB1)', type: 'Building', category: 'Academic', coordinates: [26.84252267769878, 75.56475881089028] },
    { id: 2, name: 'Academic Block 2 (AB2)', type: 'Building', category: 'Academic', coordinates: [26.843009041165054, 75.56583836911558] },
    { id: 3, name: 'Academic Block 3 (AB3)', type: 'Building', category: 'Academic', coordinates: [26.844502393826332, 75.56476082808086] },
    { id: 4, name: 'Lecture Hall Complex', type: 'Building', category: 'Academic', coordinates: [26.84432342141948, 75.56480585671513] },
    { id: 5, name: 'Central Library', type: 'Facility', category: 'Library', coordinates: [26.84170260561239, 75.56624963390331] }, // Using Dome Building coordinates
    { id: 6, name: 'Sports Complex', type: 'Facility', category: 'Sports', coordinates: [26.84555260680592, 75.56437977970938] }, // Using Cricket Ground coordinates
    { id: 7, name: 'Cafeteria', type: 'Facility', category: 'Food', coordinates: [26.842958110025513, 75.56529740577874] }, // Using Old Mess coordinates
    { id: 8, name: 'Hostel Block A', type: 'Accommodation', category: 'Hostel', coordinates: [26.842587713834796, 75.56163910374428] }, // Using B10 coordinates
    { id: 9, name: 'Hostel Block B', type: 'Accommodation', category: 'Hostel', coordinates: [26.84159345497758, 75.56224247315566] }, // Using B3 coordinates
    { id: 10, name: 'Medical Center', type: 'Facility', category: 'Health', coordinates: [26.841242818416347, 75.56248092837704] },
    { id: 11, name: 'Auditorium', type: 'Facility', category: 'Events', coordinates: [26.843248340055393, 75.56626501290748] }, // Using Amphitheatre coordinates
    { id: 12, name: 'Computer Lab', type: 'Facility', category: 'Academic', coordinates: [26.84366810077311, 75.56690807407736] }, // Using AWS Building coordinates
  ];

  useEffect(() => {

    setPopularLocations(allLocations.slice(0, 5));
    
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

      setResults([]);
    } else {

      const filtered = allLocations.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.type.toLowerCase().includes(value.toLowerCase()) ||
        location.category?.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleLocationClick = (location: SearchResult) => {

  const recent = localStorage.getItem('recentSearches');
  const recentArray = recent ? JSON.parse(recent) : [];
  const updated = [location, ...recentArray.filter((item: SearchResult) => item.id !== location.id)].slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(updated));
  
  if (location.coordinates) {
    const locationData = {
      name: location.name,
      coordinates: location.coordinates,
      id: location.id
    };

    const encodedData = encodeURIComponent(JSON.stringify(locationData));
    router.push(`/directions/${encodedData}`);
  } else {

    alert('Location coordinates not available');
  }
  
  setIsOpen(false);
  setQuery('');
};

  const baseClasses = "relative w-full";
  const inputClasses = variant === 'hero' 
    ? "w-full px-6 py-4 pl-14 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
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