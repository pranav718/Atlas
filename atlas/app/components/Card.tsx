"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CardProps {
  title: string;
  imageUrl: string;
  coordinates: [number, number];
  mostVisited: string[];
}

const Card: React.FC<CardProps> = ({ title, imageUrl, coordinates, mostVisited }) => {
  const router = useRouter();
  const [locationId, setLocationId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch location ID
    const fetchLocationId = async () => {
      try {
        const res = await fetch('/api/locations');
        if (res.ok) {
          const locations = await res.json();
          const location = locations.find((loc: any) => loc.name === title);
          if (location) {
            setLocationId(location.id);
          }
        }
      } catch (error) {
        console.error('Error fetching location ID:', error);
      }
    };
    
    fetchLocationId();
  }, [title]);

  const handleCardClick = () => {
    const locationData = {
      name: title,
      coordinates: coordinates,
      id: locationId || undefined
    };
    const encodedData = encodeURIComponent(JSON.stringify(locationData));
    router.push(`/directions/${encodedData}`);
  };

  const handlePlaceClick = (e: React.MouseEvent, place: string) => {
    e.stopPropagation();
    const locationData = {
      name: place,
      coordinates: coordinates,
      id: locationId || undefined
    };
    const encodedData = encodeURIComponent(JSON.stringify(locationData));
    router.push(`/directions/${encodedData}`);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.15)' }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
    >
      {/* Image section */}
      <div className="h-48 overflow-hidden relative">
        <motion.img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin size={16} className="text-purple-500" />
          <span className="text-sm">View on map</span>
          <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Popular spots:</p>
          <div className="flex flex-wrap gap-2">
            {mostVisited.map((place, index) => (
              <motion.span
                key={index}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: '#9333ea', color: '#ffffff' }}
                onClick={(e) => handlePlaceClick(e, place)}
              >
                {place}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;