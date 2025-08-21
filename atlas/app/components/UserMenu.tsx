"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Star, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Location {
  id: number;
  name: string;
  coordinates: number[];
  hours: string;
  status: string;
}

const UserMenu: React.FC = () => {
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

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {session?.user?.image ? (
          <img 
            src={session.user.image} 
            alt="Profile" 
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <User size={18} />
        )}
        <span className="font-medium">{session?.user?.name || 'User'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* User info header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-center gap-3">
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{session?.user?.name || 'User'}</p>
                  <p className="text-sm text-purple-200">{session?.user?.email}</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {/* Favorites button */}
              <button
                onClick={handleFavoritesClick}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  <Star size={18} />
                  My Favorites
                </span>
                <motion.svg
                  className="w-4 h-4"
                  animate={{ rotate: showFavorites ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Favorites list */}
              <AnimatePresence>
                {showFavorites && (
                  <motion.div
                    className="px-4 pb-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {loading ? (
                      <div className="py-4 text-center text-gray-500">Loading...</div>
                    ) : favorites.length === 0 ? (
                      <div className="py-4 text-center text-gray-500 text-sm">
                        No favorites yet
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto">
                        {favorites.map((location) => (                          <button
                            key={location.id}
                            onClick={() => navigateToLocation(location)}
                            className="w-full text-left py-2 px-3 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 group"
                          >
                            <MapPin size={14} className="text-blue-500 group-hover:text-blue-600" />
                            <span className="text-gray-700 group-hover:text-gray-900">{location.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={() => signOut()}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-3"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;