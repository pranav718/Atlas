"use client"; 

import React, {useState,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { BorderBeam } from './magicui/border-beam';


interface CardProps {
  title: string;
  imageUrl: string;
  coordinates: [number, number];
  mostVisited?: string[];
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

    // Helper to encode location data
    const encodeLocation = (name: string, coords: [number, number], id?: number) => {
      return encodeURIComponent(JSON.stringify({ name, coordinates: coords, id }));
    };

    // Card click: go to map with this card's location
    const handleCardClick = () => {
      const encodedData = encodeLocation(title, coordinates, locationId || undefined);
      router.push(`/directions/${encodedData}`);
    };

    // Most visited click: try to find coordinates for sub-place, else fallback to card's coordinates
    const handleLinkClick = (place: string) => {
      const encodedData = encodeLocation(place, coordinates, locationId || undefined);
      router.push(`/directions/${encodedData}`);
    };

    // ... rest of the component remains the same
  
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
      {/* Border Beam */}
      <BorderBeam size={150} duration={10} delay={0} />
    </div>
  );
};

export default Card;
