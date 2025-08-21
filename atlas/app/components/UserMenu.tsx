"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Location {
  id: number;
  name: string;
  coordinates: number[];
  hours: string;
  status: string;
}

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFavorites(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritesClick = async () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites && favorites.length === 0) {
      await fetchFavorites();
    }
  };

  const navigateToLocation = (location: Location) => {
    const locationData = {
      name: location.name,
      coordinates: location.coordinates as [number, number],
      id: location.id
    };
    const encodedData = encodeURIComponent(JSON.stringify(locationData));
    router.push(`/directions/${encodedData}`);
    setIsOpen(false);
    setShowFavorites(false);
  };

  if (!session) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200 text-[#7A96D5]"
        aria-label="User menu"
      >
        {session.user?.image?.startsWith("http") ? (
            <img
                src={session.user.image}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
            />
            ) : (
            <div className="w-full h-full rounded-full bg-[#7A96D5] text-white flex items-center justify-center font-semibold">
                {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
            </div>
        )}

      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-down">
          {/* User Info Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                {session.user?.image ? (
                    <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    ) : (
                    <div className="w-14 h-14 rounded-full bg-[#7A96D5] text-white flex items-center justify-center font-bold text-lg">
                        {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                )}

              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-lg truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-white/80 text-sm truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Favorites Button */}
            <button
              onClick={handleFavoritesClick}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-xl flex items-center justify-between transition-all duration-200 group"
            >
              <span className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-900">My Favorites</span>
                  <p className="text-xs text-gray-500">Quick access to saved locations</p>
                </div>
              </span>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showFavorites ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Favorites List */}
            {showFavorites && (
              <div className="mx-4 mb-2 p-3 bg-gray-50 rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">No favorites yet</p>
                    <p className="text-xs text-gray-400 mt-1">Add locations from the map!</p>
                  </div>
                ) : (
                  <ul className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {favorites.map((location) => (
                      <li key={location.id}>
                        <button
                          onClick={() => navigateToLocation(location)}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-white rounded-lg transition-all duration-200 flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-700 group-hover:text-gray-900 font-medium">{location.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Sign Out Button */}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={() => signOut()}
                className="w-full px-4 py-3 text-left hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Sign Out</span>
                  <p className="text-xs text-gray-500">See you next time!</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}