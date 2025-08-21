import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { useSession } from 'next-auth/react';

// Fix for default markers
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const BUILDINGS_WITH_FLOOR_PLANS = [
  "Academic Block 1 (AB1)",
  "Academic Block 2 (AB2)",
  "Academic Block 3 (AB3)",
  "Lecture Hall Complex"
];

// --- FloorSelector and FloorPlanViewer components remain the same ---
interface FloorSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFloor: (floor: number) => void;
  buildingName: string;
}
const FloorSelector: React.FC<FloorSelectorProps> = ({ isOpen, onClose, onSelectFloor, buildingName }) => {
    // ... (code for this component is unchanged)
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            {/* ... modal content ... */}
        </div>
    );
};

interface FloorPlanViewerProps {
  floor: number | null;
  buildingName: string;
  isOpen: boolean;
  onClose: () => void;
}
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
            
            { }
            
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
    // ... (code for this component is unchanged)
    return <Marker position={position}><Popup>{locationName}</Popup></Marker>;
};


// ✨ NEW: Component for the "Recenter" button
const RecenterButton = ({ userLocation }: { userLocation: [number, number] }) => {
  const map = useMap();

  const handleRecenter = () => {
    map.flyTo(userLocation, map.getZoom());
  };

  return (
    <button
      onClick={handleRecenter}
      className="absolute bottom-10 left-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      title="Recenter map on your location"
    >
      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15l-4-4h3V9h2v4h3l-4 4z" />
      </svg>
    </button>
  );
};

const FavoriteButton = ({ locationId, locationName }: { locationId: number, locationName: string }) => {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (session) {
      checkIfFavorite();
    }
  }, [session, locationId]);

  const checkIfFavorite = async () => {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const favorites = await res.json();
        setIsFavorite(favorites.some((fav: any) => fav.id === locationId));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!session) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId })
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="absolute bottom-[140px] right-[10px] z-[1000]">
      <button
        onClick={toggleFavorite}
        disabled={loading}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-white p-2.5 rounded-md shadow-lg hover:bg-gray-100 transition-colors border-2 border-gray-200 relative"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {loading ? (
          <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#7A96D5]"></div>
        ) : (
          <svg 
            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'} transition-colors`} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        )}
      </button>
      
      {/* Tooltip */}
      {showTooltip && !loading && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap">
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};


const MapWithRouting = ({ userLocation, destination, locationName, locationId }: {
  userLocation: [number, number],
  destination: [number, number],
  locationName: string,
  locationId: number
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
        
        {/* Add the recenter button */}
        <RecenterButton userLocation={userLocation} />
        
        {/* Add the favorite button */}
        <FavoriteButton locationId={locationId} locationName={locationName} />
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