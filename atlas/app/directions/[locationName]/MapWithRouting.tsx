// This file is dynamically imported with ssr: false to avoid window errors
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

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
  </MapContainer>
);

export default MapWithRouting;
