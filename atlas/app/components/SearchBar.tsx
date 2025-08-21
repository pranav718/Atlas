"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  variant?: 'default' | 'hero';
}

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    setIsOpen(value.length > 0);
    
    // Add your search logic here
    if (value.length > 0) {
      // Mock search results - replace with actual search
      setResults([
        { id: 1, name: 'Academic Block 1', type: 'Building' },
        { id: 2, name: 'Library', type: 'Facility' },
      ]);
    } else {
      setResults([]);
    }
  };

  const baseClasses = "relative w-full";
  const inputClasses = variant === 'hero' 
    ? "w-full px-6 py-4 pl-14 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
    : "w-full px-4 py-3 pl-12 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <div className={`${baseClasses} ${variant === 'hero' ? 'static' : 'relative'}`} ref={searchRef}>
      <div className="relative">
        <Search className={`absolute left-4 ${variant === 'hero' ? 'top-5' : 'top-3.5'} text-gray-400 w-5 h-5 z-10`} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Search buildings, facilities, or locations..."
          className={inputClasses}
        />
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden ${
              variant === 'hero' ? 'z-[100]' : 'z-50'
            }`}
            style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              ...(variant === 'hero' && { 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
              })
            }}
          >
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  router.push(`/location/${result.id}`);
                  setIsOpen(false);
                  setQuery('');
                }}
                className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">{result.name}</p>
                  <p className="text-sm text-gray-500">{result.type}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;