// This file is dynamically imported with ssr: false to avoid window errors
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Add this for basic styling
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';

// Fix for default markers (must be inside client-only file)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const RoutingMachine = ({ userLocation, destination }: { userLocation: [number, number], destination: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (!userLocation || !map) return;
    // @ts-ignore
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      showAlternatives: true,
      fitSelectedRoutes: true,
      // Change the position of the routing box
      position: 'topright', // Default is 'topleft', 'topright', 'bottomleft', 'bottomright'
      // Add custom collapsed option for a cleaner look
      collapsible: true,
      collapsed: false, // Start with it collapsed or expanded
    }).addTo(map);
    return () => {
      // @ts-ignore
      routingControl.remove();
    };
  }, [userLocation, destination, map]);
  return null;
};

const MapWithRouting = ({ userLocation, destination }: { userLocation: [number, number], destination: [number, number] }) => (
  <MapContainer
    center={userLocation}
    zoom={13}
    style={{ height: '100%', width: '100%' }}
    zoomControl={false} // Disable default zoom control
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={userLocation}>
      <Popup>Your Location</Popup>
    </Marker>
    <Marker position={destination}>
      <Popup>Manipal University Jaipur</Popup>
    </Marker>
    <RoutingMachine userLocation={userLocation} destination={destination} />
    <ZoomControl position="bottomright" /> {/* Add a new zoom control at the bottom right */}
  </MapContainer>
);

export default MapWithRouting;