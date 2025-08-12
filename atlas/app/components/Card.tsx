"use client"; 

import React from 'react';
import { useRouter } from 'next/navigation';


interface CardProps {
  title: string;
  imageUrl: string;
  coordinates: [number, number];
  mostVisited?: string[];
}


const Card: React.FC<CardProps> = ({ title, imageUrl, coordinates, mostVisited }) => {
    const router = useRouter();

    // Helper to encode location data
    const encodeLocation = (name: string, coords: [number, number]) => {
      return encodeURIComponent(JSON.stringify({ name, coordinates: coords }));
    };

    // Card click: go to map with this card's location
    const handleCardClick = () => {
      const encodedData = encodeLocation(title, coordinates);
      router.push(`/directions/${encodedData}`);
    };

    // Most visited click: try to find coordinates for sub-place, else fallback to card's coordinates
    const handleLinkClick = (place: string) => {
      // Try to find coordinates for sub-place (if available in locationsData)
      // For now, fallback to card's coordinates
      const encodedData = encodeLocation(place, coordinates);
      router.push(`/directions/${encodedData}`);
    };

  
    return (
    <div className="relative w-full h-[250px] rounded-lg overflow-hidden shadow-lg group cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Overlay with opacity */}
        <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
      </div>

      {/* Default Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 transition-all duration-300 group-hover:transform group-hover:scale-95 group-hover:opacity-0">
        <h2 className="text-3xl font-extrabold font-twcenmt">{title}</h2>

      </div>

      {/* Hover Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold font-twcenmt">{title}</h2>
          
        </div>
        {mostVisited && (
          <div className="text-right mt-4 self-end">
            <h4 className="text-lg font-bold">Most Visited Places:</h4>
            <ul className="text-sm"> 
                {mostVisited.map((place, index) => (
                    <li
                        key={index}
                        className="cursor-pointer hover:underline hover:text-blue-500"
                        onClick={() => handleLinkClick(place)}
                        >
                        {place}
                    </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
