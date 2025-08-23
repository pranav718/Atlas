// app/directions/[locationName]/page.tsx
"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface LocationData {
  name: string;
  coordinates: [number, number];
  id?: number;
}

interface DirectionsPageProps {
  params: Promise<{
    locationName: string;
  }>;
}

const MapWithRouting = dynamic(() => import('./MapWithRouting'), { ssr: false });

const DirectionsPage: React.FC<DirectionsPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const processLocationData = async () => {
      try {
        const decodedData = decodeURIComponent(resolvedParams.locationName);
        const parsedData = JSON.parse(decodedData);
        
        if (!parsedData.name || !Array.isArray(parsedData.coordinates) || parsedData.coordinates.length !== 2) {
          throw new Error('Invalid location data format');
        }

        setLocationData({
          name: parsedData.name,
          coordinates: [Number(parsedData.coordinates[0]), Number(parsedData.coordinates[1])],
          id: parsedData.id
        });

        // Fetch location ID if not provided
        if (!parsedData.id) {
          try {
            const res = await fetch('/api/locations');
            if (res.ok) {
              const locations = await res.json();
              const location = locations.find((loc: any) => loc.name === parsedData.name);
              if (location) {
                setLocationId(location.id);
              }
            }
          } catch (error) {
            console.error('Error fetching location ID:', error);
          }
        } else {
          setLocationId(parsedData.id);
        }
      } catch (error) {
        console.error('Error parsing location data:', error);
        setLocationError('Invalid location data provided.');
      }
    };

    if (resolvedParams.locationName) {
      processLocationData();
    }
  }, [resolvedParams]);

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
        <button
          onClick={() => router.push('/')}
          aria-label="Go to home page"
          className="focus:outline-none"
          style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
        >
          <img src="/uniway.svg" alt="Uniway Logo" className="h-[30px]" />
        </button>
      </div>
      {locationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{locationError}</span>
        </div>
      )}
      <div className="flex-1">
        {userLocation && locationData && locationId && (
          <MapWithRouting 
            userLocation={userLocation} 
            destination={locationData.coordinates}
            locationName={locationData.name}
            locationId={locationId}
          />
        )}
      </div>
    </div>
  );
};

export default DirectionsPage;