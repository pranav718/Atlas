
"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Manipal University Jaipur coordinates
const MANIPAL_COORDINATES: [number, number] = [26.8438, 75.5622];

interface DirectionsPageProps {
  params: {
    locationName: string;
  };
}


const MapWithRouting = dynamic(() => import('./MapWithRouting'), { ssr: false });

const DirectionsPage: React.FC<DirectionsPageProps> = ({ params }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[40px] bg-[#7A96D5] flex items-center px-4">
        <img src="/uniway.svg" alt="Uniway Logo" className="h-[30px]" />
      </div>
      {locationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{locationError}</span>
        </div>
      )}
      <div className="flex-1">
        {userLocation && (
          <MapWithRouting userLocation={userLocation} destination={MANIPAL_COORDINATES} />
        )}
      </div>
    </div>
  );
};


export default DirectionsPage;