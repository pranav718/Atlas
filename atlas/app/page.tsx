"use client";
// In app/page.tsx
import React, { useState, useRef, useEffect } from 'react';
import locationsData from '../data/locations.json';

type Location = {
  id: number;
  name: string;
  coordinates: number[];
  hours: string;
  status: string;
};



const getRandomSuggestions = (locations: Location[], count = 5): Location[] => {
  const shuffled = [...locations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};


const SearchBar: React.FC = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) {
      setSuggestions(getRandomSuggestions(locationsData, 5));
    } else {
      setSuggestions([]);
    }
  }, [focused]);

  // Filter suggestions if query is typed
  useEffect(() => {
    if (query.trim() !== '') {
      setSuggestions(
        locationsData.filter(loc =>
          loc.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      );
    } else if (focused) {
      setSuggestions(getRandomSuggestions(locationsData, 5));
    }
  }, [query, focused]);

  // Collapse on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    if (focused) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [focused]);

  return (
    <div
      className={`w-full flex justify-center absolute left-0 px-4 sm:px-8 transition-all duration-300 ${focused ? 'z-20' : ''}`}
      style={{ top: '190px' }}
      ref={inputRef}
    >
      {/* This is the new container for the search bar and suggestions. */}
      {/* We are using a fixed max-w-xl to keep the search box contained and centered. */}
      <div className={`relative w-full max-w-xl transition-all duration-300`}> 
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search locations..."
          className="w-full px-4 py-2 rounded-lg shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 placeholder-gray-500 caret-black text-black transition-all duration-300"
          style={{ zIndex: 10 }}
        />
        {focused && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-30 w-full">
            {suggestions.map((loc) => (
              <li
                key={loc.id}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-black"
                onMouseDown={() => {
                  setQuery(loc.name);
                  setFocused(false);
                }}
              >
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Add a style tag for the custom caret blink animation
if (typeof window !== 'undefined') {
  const styleId = 'custom-caret-blink-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes caretBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .custom-caret-blink:focus {
        caret-color: black;
        animation: caretBlink 1s steps(1) infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

const Header: React.FC = () => (
  <header className="relative">
    {/* These class names correspond to the colors and heights from your design */}
    <div className="h-[40px] bg-[#7A96D5]"></div> 
    <div className="h-[200px] bg-[#88DBE7]"></div>
    <SearchBar />
  </header>
);

const Footer: React.FC = () => (
  <footer className="h-[80px] bg-[#7A96D5]"></footer>
);

export default function Home() {
  return (
    // This is the main container for the whole page
    <div className="flex flex-col h-screen">
      <Header />
      {/* Main content area with centered white rectangle */}
      <main className="flex-1 bg-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl h-[500px] my-3 p-10 mt-4 mb-4 grid grid-cols-2 grid-rows-2 gap-x-32 gap-y-20">
          <div className="text-black text-3xl font-extrabold self-start justify-self-start">ACADEMIC BLOCK 1</div>
          <div className="text-black text-3xl font-extrabold self-start justify-self-end text-right mt-30">ACADEMIC BLOCK 2</div>
          <div className="text-black text-3xl font-extrabold self-end justify-self-start mb-30">ACADEMIC BLOCK 3</div>
          <div className="text-black text-3xl font-extrabold self-end justify-self-end text-right">LECTURE HALL<br/>COMPLEX</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}