"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  variant?: 'default' | 'hero';
}

type Location = {
  id: number;
  name: string;
  coordinates: number[];
  hours: string;
  status: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isHero = variant === 'hero';

  useEffect(() => {
    // Fetch locations from API
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (query.trim() !== '') {
      setSuggestions(
        locations.filter(loc =>
          loc.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      );
    } else if (isFocused) {
      // Show random suggestions when focused but no query
      const shuffled = [...locations].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query, isFocused, locations]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    if (isFocused) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isFocused]);

  const handleLocationSelect = (location: Location) => {
    const locationData = {
      name: location.name,
      coordinates: location.coordinates as [number, number],
      id: location.id
    };
    const encodedData = encodeURIComponent(JSON.stringify(locationData));
    router.push(`/directions/${encodedData}`);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <motion.div 
      ref={inputRef}
      className={`relative ${isHero ? 'w-full max-w-lg' : 'absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px]'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={`relative ${isHero ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-full shadow-lg`}
        animate={{
          boxShadow: isFocused 
            ? isHero 
              ? '0 0 30px rgba(255, 255, 255, 0.3)' 
              : '0 0 30px rgba(147, 51, 234, 0.3)'
            : isHero
              ? '0 4px 20px rgba(0, 0, 0, 0.1)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.3 }}
            >
        <div className="flex items-center">
          <motion.div
            className={`pl-5 ${isHero ? 'text-white/70' : 'text-purple-600'}`}
            animate={{
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <Search size={20} />
          </motion.div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, rooms, or facilities..."
            onFocus={() => setIsFocused(true)}
            className={`w-full px-4 py-4 bg-transparent rounded-full focus:outline-none ${
              isHero ? 'text-white placeholder-white/60' : 'text-gray-700 placeholder-gray-400'
            }`}
          />

          <motion.button
            className={`mr-2 px-6 py-2 rounded-full font-medium transition-colors ${
              isHero 
                ? 'bg-white text-purple-700 hover:bg-purple-50' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </div>
      </motion.div>

      {/* Suggestions dropdown */}
      {isFocused && suggestions.length > 0 && (
        <motion.ul
          className={`absolute left-0 right-0 mt-2 ${
            isHero ? 'bg-white' : 'bg-white'
          } rounded-2xl shadow-xl max-h-60 overflow-auto z-30 w-full`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {suggestions.map((loc) => (
            <li
              key={loc.id}
              className="px-6 py-3 cursor-pointer hover:bg-purple-50 text-gray-700 flex justify-between items-center transition-colors"
              onMouseDown={() => handleLocationSelect(loc)}
            >
              <span className="font-medium">{loc.name}</span>
              <svg 
                width="20px" 
                height="20px" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-purple-400"
              >
                <path 
                  d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default SearchBar;