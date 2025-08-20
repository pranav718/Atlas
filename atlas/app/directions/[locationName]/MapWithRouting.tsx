import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';

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
    // ... (code for this component is unchanged)
    if (!isOpen || floor === null) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            {/* ... modal content ... */}
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
        
        {/* ✨ ADDED: The new recenter button */}
        <RecenterButton userLocation={userLocation} />
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