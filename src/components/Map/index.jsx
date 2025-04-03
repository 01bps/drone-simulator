import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import L from 'leaflet';
import { useSimulation } from '../../context/SimulationContext';
import PathVisualizer from '../PathVisualizer';

// This component handles map view changes when selectedLocation changes
function MapController() {
  const map = useMap();
  const { selectedLocation } = useSimulation();

  useEffect(() => {
    if (selectedLocation) {
      map.setView(
        [selectedLocation.lat, selectedLocation.lng],
        16 // Zoom level
      );
    }
  }, [selectedLocation, map]);

  return null;
}

function WaypointsBoundsAdjuster() {
  const map = useMap();
  const { waypoints } = useSimulation();

  useEffect(() => {
    if (waypoints && waypoints.length > 1) {
      // Create bounds object
      const bounds = L.latLngBounds(waypoints.map(point => [point.lat, point.lng]));
      
      // Fit map to these bounds with some padding
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [waypoints, map]);

  return null;
}

function MapComponent() {
  // Default center at a random location (can be changed)
  const defaultCenter = [28.7041, 77.1025]; // Delhi, India
  const defaultZoom = 13;

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController />
        <WaypointsBoundsAdjuster />
        <PathVisualizer />
      </MapContainer>
    </div>
  );
}

export default MapComponent;