// This file is dynamically imported with ssr: false to avoid window errors
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';

// Fix for default markers (must be inside client-only file)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // @ts-expect-error - leaflet-routing-machine types might not be perfectly integrated
    const routingControl = L.Routing.control({
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
      // @ts-expect-error - a bit of a hack to remove the control
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
    zoomControl={false}
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
    <ZoomControl position="bottomright" />
  </MapContainer>
);

export default MapWithRouting;