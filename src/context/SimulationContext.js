import React, { createContext, useState, useContext } from 'react';

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  // Waypoints array: each point has lat, lng, and timestamp
  const [waypoints, setWaypoints] = useState([]);
  
  // Current position of the drone
  const [currentPosition, setCurrentPosition] = useState(null);
  
  // Track which waypoints have been visited
  const [visitedWaypoints, setVisitedWaypoints] = useState([]);
  
  // Simulation control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100%
  
  // Selected map position (from search)
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const value = {
    waypoints,
    setWaypoints,
    currentPosition,
    setCurrentPosition,
    visitedWaypoints,
    setVisitedWaypoints,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    selectedLocation,
    setSelectedLocation,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => useContext(SimulationContext);