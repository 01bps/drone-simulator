import React, { useEffect } from 'react';
import { Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useSimulation } from '../../context/SimulationContext';
import './styles.css';

// Create a custom drone icon
const createDroneIcon = () => {
  return L.divIcon({
    className: 'drone-icon',
    html: `<div class="drone-marker"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

function PathVisualizer() {
  const { 
    waypoints, 
    currentPosition, 
    visitedWaypoints, 
    isPlaying 
  } = useSimulation();

  // No rendering if no waypoints
  if (waypoints.length === 0) return null;

  // Create the positions array for the traveled path (solid line)
  const traveledPath = currentPosition 
    ? [...visitedWaypoints, currentPosition] 
    : visitedWaypoints;

  // Calculate remaining path (dotted line)
  const remainingPathIndex = visitedWaypoints.length;
  const remainingPath = waypoints.slice(
    Math.max(0, remainingPathIndex),
    waypoints.length
  );

  return (
    <>
      {/* Solid line for traveled path */}
      {traveledPath.length > 1 && (
        <Polyline
          positions={traveledPath.map(wp => [wp.lat, wp.lng])}
          pathOptions={{ color: '#00BFFF', weight: 3 }}
        />
      )}

      {/* Dotted line for future path */}
      {remainingPath.length > 1 && (
        <Polyline
          positions={remainingPath.map(wp => [wp.lat, wp.lng])}
          pathOptions={{ 
            color: '#00BFFF', 
            weight: 3, 
            dashArray: '10, 10',
            opacity: 0.7
          }}
        />
      )}

      {/* Drone marker */}
      {currentPosition && (
        <Marker
          position={[currentPosition.lat, currentPosition.lng]}
          icon={createDroneIcon()}
        />
      )}
    </>
  );
}

export default PathVisualizer;