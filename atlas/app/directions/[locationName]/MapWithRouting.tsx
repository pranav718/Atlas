// app/directions/[locationName]/MapWithRouting.tsx
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const BUILDINGS_WITH_FLOOR_PLANS = [
  "Academic Block 1 (AB1)",
  "Academic Block 2 (AB2)",
  "Academic Block 3 (AB3)",
  "LECTURE HALL COMPLEX"
];

interface FloorSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFloor: (floor: number) => void;
  buildingName: string;
}

interface FloorPlanViewerProps {
  floor: number | null;
  buildingName: string;
  isOpen: boolean;
  onClose: () => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ isOpen, onClose, onSelectFloor, buildingName }) => {
  const handleFloorSelect = (floorNumber: number) => {
    onSelectFloor(floorNumber);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-lg border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-[#7A96D5] border-b border-blue-100 pb-3">
          {buildingName}
        </h2>
        <div className="space-y-2.5">
          <button
            onClick={() => handleFloorSelect(0)}
            className="w-full bg-[#7A96D5] text-white py-2.5 rounded-lg hover:bg-[#6A86C5] 
              transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            Ground Floor
          </button>
          <button
            onClick={() => handleFloorSelect(1)}
            className="w-full bg-[#7A96D5] text-white py-2.5 rounded-lg hover:bg-[#6A86C5] 
              transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            First Floor
          </button>
          <button
            onClick={() => handleFloorSelect(2)}
            className="w-full bg-[#7A96D5] text-white py-2.5 rounded-lg hover:bg-[#6A86C5] 
              transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            Second Floor
          </button>
          <button
            onClick={() => handleFloorSelect(3)}
            className="w-full bg-[#7A96D5] text-white py-2.5 rounded-lg hover:bg-[#6A86C5] 
              transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            Third Floor
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-100 text-gray-600 py-2.5 rounded-lg hover:bg-gray-200 
            transition-all duration-200 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({ floor, buildingName, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imagePath, setImagePath] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    
    const buildingPath = buildingName
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/\s+/g, '-');

    const path = floor === 0 
      ? `/floorplans/${buildingPath}/ground.jpeg`
      : `/floorplans/${buildingPath}/floor-${floor}.jpeg`;

    setImagePath(path);
  }, [floor, buildingName]);

  if (!isOpen || floor === null) return null;

  const getFloorLabel = (floorNumber: number) => {
    if (floorNumber === 0) return 'Ground Floor';
    return `Floor ${floorNumber}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full mx-4 shadow-lg">
        <div className="bg-[#7A96D5] px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {buildingName} - {getFloorLabel(floor)}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-[#6A86C5] rounded-lg p-1.5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="relative aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            {isLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#7A96D5] border-t-transparent"></div>
              </div>
            )}
            
            {!imageError ? (
              <img
                key={imagePath}
                src={imagePath}
                alt={`${buildingName} ${getFloorLabel(floor)} Plan`}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => {
                  setIsLoading(false);
                  setImageError(false);
                }}
                onError={() => {
                  setIsLoading(false);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <svg 
                    className="w-10 h-10 text-[#7A96D5]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Floor plan not available</p>
                <p className="text-gray-500 text-sm mt-1">The requested floor plan could not be loaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RoutingMachine = ({ userLocation, destination }: { userLocation: [number, number], destination: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!userLocation || !map) return;

    try {
      const routingControl = (L.Routing as any).control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1])
        ],
        routeWhileDragging: false,
        showAlternatives: true,
        fitSelectedRoutes: true,
        position: 'topright',
        collapsible: true,
        collapsed: false,
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    } catch (error) {
      console.error('Error setting up routing:', error);
    }
  }, [userLocation, destination, map]);

  return null;
};

const DestinationMarker = ({ position, locationName, onViewFloorPlans }: {
  position: [number, number],
  locationName: string,
  onViewFloorPlans: () => void
}) => {
  const hasFloorPlans = BUILDINGS_WITH_FLOOR_PLANS.includes(locationName);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

  return (
    <Marker 
      position={position}
      ref={markerRef}
      eventHandlers={{
        popupclose: () => {
          setTimeout(() => {
            markerRef.current?.openPopup();
          }, 100);
        }
      }}
    >
      <Popup closeButton={false}>
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold">{locationName}</p>
          {hasFloorPlans && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewFloorPlans();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View Floor Plans
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

const MapWithRouting = ({ userLocation, destination, locationName }: {
  userLocation: [number, number],
  destination: [number, number],
  locationName: string
}) => {
  const [showFloorSelector, setShowFloorSelector] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  const handleViewFloorPlans = () => {
    setShowFloorSelector(true);
  };

  const handleSelectFloor = (floor: number) => {
    setSelectedFloor(floor);
    setShowFloorSelector(false);
    setShowFloorPlan(true);
  };

  return (
    <>
      <MapContainer
        center={destination}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
        <DestinationMarker
          position={destination}
          locationName={locationName}
          onViewFloorPlans={handleViewFloorPlans}
        />
        <RoutingMachine userLocation={userLocation} destination={destination} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      <FloorSelector
        isOpen={showFloorSelector}
        onClose={() => setShowFloorSelector(false)}
        onSelectFloor={handleSelectFloor}
        buildingName={locationName}
      />

      <FloorPlanViewer
        floor={selectedFloor}
        buildingName={locationName}
        isOpen={showFloorPlan}
        onClose={() => setShowFloorPlan(false)}
      />
    </>
  );
};

export default MapWithRouting;