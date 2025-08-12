"use client";

import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect, useRef, useState } from 'react';

const API_KEY = 'AIzaSyCISyDk-L9RlzwUVKRMPQmIXsWlyqfkvTQ';

// Manipal University Jaipur coordinates
const MANIPAL_COORDINATES = {
  lat: 26.8438,
  lng: 75.5622
};

interface DirectionsPageProps {
  params: {
    locationName: string;
  };
}

const DirectionsPage: React.FC<DirectionsPageProps> = ({ params }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    
    const loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    const handleLocationError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      let errorMessage = 'Unable to retrieve your location. ';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Location permission was denied. Please enable location access in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable. Please try again.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage += 'Please enable location services and refresh the page.';
      }
      
      setLocationError(errorMessage);
      alert(errorMessage);
    };

    const checkLocationPermission = async () => {
      try {
        // Check if permissions API is supported
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          
          if (result.state === 'denied') {
            throw new Error('Location permission is denied. Please enable it in your browser settings.');
          }
        }

        // Proceed with getting location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const origin = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              initializeMapAndDirections(origin);
            },
            handleLocationError,
            { 
              timeout: 10000,
              enableHighAccuracy: true,
              maximumAge: 0 // Force fresh location
            }
          );
        } else {
          throw new Error('Geolocation is not supported by this browser.');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setLocationError(errorMessage);
        alert(errorMessage);
      }
    };

    async function initializeMapAndDirections(origin: { lat: number; lng: number }) {
      if (!mapRef.current || !isMounted) return;

      try {
        const google = await loader.load();
        
        // Initialize map
        const newMap = new google.maps.Map(mapRef.current, {
          center: origin,
          zoom: 15,
          disableDefaultUI: false,
        });
        
        // Initialize directions renderer
        const newDirectionsRenderer = new google.maps.DirectionsRenderer();
        newDirectionsRenderer.setMap(newMap);
        
        if (isMounted) {
          setMap(newMap);
          setDirectionsRenderer(newDirectionsRenderer);
        }

        // Get directions
        const directionsService = new google.maps.DirectionsService();
        const request = {
          origin: new google.maps.LatLng(origin.lat, origin.lng),
          destination: new google.maps.LatLng(MANIPAL_COORDINATES.lat, MANIPAL_COORDINATES.lng),
          travelMode: google.maps.TravelMode.DRIVING,
        };

        interface DirectionsRequest {
            origin: any; // google.maps.LatLng at runtime
            destination: any; // google.maps.LatLng at runtime
            travelMode: string; // e.g., 'DRIVING'
        }

        interface DirectionsResponseCallback {
            (
                response: any | null, // google.maps.DirectionsResult at runtime
                status: string // google.maps.DirectionsStatus at runtime
            ): void;
        }

        const directionsRequest: DirectionsRequest = request;

        directionsService.route(
            directionsRequest,
            ((response, status) => {
                if (status === 'OK' && response && isMounted) {
                    newDirectionsRenderer.setDirections(response);
                } else {
                    console.error('Directions request failed:', status);
                    alert('Unable to find directions to Manipal University Jaipur. Please try again.');
                }
            }) as DirectionsResponseCallback
        );
      } catch (error) {
        console.error('Map initialization error:', error);
        alert('Error loading the map. Please try refreshing the page.');
      }
    }

    // Start the location permission check and map initialization
    checkLocationPermission();

    // Cleanup function
    return () => {
      isMounted = false;
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
      setMap(null);
      setDirectionsRenderer(null);
    };
  }, []);

  // Add an error message display to the UI
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
      <div className="flex-1" ref={mapRef} style={{ height: '100%' }} />
    </div>
  );
};

export default DirectionsPage;