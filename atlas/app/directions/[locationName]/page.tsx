"use client";

import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

// Manipal University Jaipur coordinates
const MANIPAL_COORDINATES: [number, number] = [26.8438, 75.5622];

interface DirectionsPageProps {
  params: {
    locationName: string;
  };
}

const DirectionsPage: React.FC<DirectionsPageProps> = ({ params }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    if ('geolocation' in navigator) {
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
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User Location Marker */}
            <Marker position={userLocation}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Manipal University Marker */}
            <Marker position={MANIPAL_COORDINATES}>
              <Popup>Manipal University Jaipur</Popup>
            </Marker>

            {/* Routing Control */}
            <RoutingMachine
              userLocation={userLocation}
              destination={MANIPAL_COORDINATES}
            />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

// Routing Machine Component
// Add this type declaration at the top of your file (after imports)
declare global {
  interface Window {
    L: typeof L & {
      Routing: any;
    };
  }
}

const RoutingMachine = ({ userLocation, destination }: { userLocation: [number, number], destination: [number, number] }) => {
  useEffect(() => {
    if (!userLocation) return;

    // Get the map instance from leaflet context instead of creating a new one
    // This component should be refactored to use leaflet's useMap hook from react-leaflet
    // For now, access Routing from window.L
    const routingControl = window.L.Routing.control({
      waypoints: [
        window.L.latLng(userLocation[0], userLocation[1]),
        window.L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      showAlternatives: true,
      fitSelectedRoutes: true,
    });

    // Find the map instance from leaflet's global maps
    const mapElements = document.getElementsByClassName('leaflet-container');
    if (mapElements.length > 0) {
      const mapId = mapElements[0].id;
      const map = mapId ? window.L.map(mapId) : null;
      if (map) {
        routingControl.addTo(map);
      }
    }

    return () => {
      routingControl.remove();
    };
  }, [userLocation, destination]);

  return null;
};

export default DirectionsPage;