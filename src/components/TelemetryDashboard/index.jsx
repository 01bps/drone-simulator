import React from 'react';
import './styles.css';
import { useSimulation } from '../../context/SimulationContext';

function TelemetryDashboard() {
  const { 
    currentPosition, 
    waypoints, 
    progress, 
    visitedWaypoints 
  } = useSimulation();

  if (!currentPosition || waypoints.length === 0) {
    return null;
  }

  // Calculate current speed (distance between consecutive points / time difference)
  const calculateSpeed = () => {
    if (visitedWaypoints.length < 2) return 0;
    
    const current = currentPosition;
    const prev = visitedWaypoints[visitedWaypoints.length - 1];
    
    // Skip calculation if they are the same point
    if (current.lat === prev.lat && current.lng === prev.lng) return 0;
    
    // Calculate distance using Haversine formula (in meters)
    const R = 6371e3; // Earth radius in meters
    const φ1 = prev.lat * Math.PI / 180;
    const φ2 = current.lat * Math.PI / 180;
    const Δφ = (current.lat - prev.lat) * Math.PI / 180;
    const Δλ = (current.lng - prev.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Calculate time difference in seconds
    const timeDiff = current.timestamp - prev.timestamp;
    
    // Calculate speed in m/s
    const speed = timeDiff > 0 ? distance / timeDiff : 0;
    
    return speed;
  };

  // Calculate total distance traveled
  const calculateTotalDistance = () => {
    if (visitedWaypoints.length === 0) return 0;
    
    const points = [...visitedWaypoints, currentPosition];
    let totalDistance = 0;
  
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Skip calculation if they are the same point
      if (curr.lat === prev.lat && curr.lng === prev.lng) continue;
      
      // Calculate distance using Haversine formula
      const R = 6371e3; // Earth radius in meters
      const φ1 = prev.lat * Math.PI / 180;
      const φ2 = curr.lat * Math.PI / 180;
      const Δφ = (curr.lat - prev.lat) * Math.PI / 180;
      const Δλ = (curr.lng - prev.lng) * Math.PI / 180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      totalDistance += distance;
    }
    
    return totalDistance;
  };

  // Calculate estimated time of arrival
  const calculateETA = () => {
    if (progress >= 100) return "Arrived";
    
    const totalTime = waypoints[waypoints.length - 1].timestamp;
    const currentTime = currentPosition.timestamp;
    const remainingTime = totalTime - currentTime;
    
    // Format the time
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    
    return `${minutes}m ${seconds}s`;
  };

  // Calculate current altitude (simulated)
  const calculateAltitude = () => {
    // Let's simulate altitude based on progress
    // This creates a takeoff, cruise, landing pattern
    const maxAltitude = 120; // meters
    
    if (progress < 10) {
      // Takeoff phase (0-10%)
      return (progress / 10) * maxAltitude;
    } else if (progress > 90) {
      // Landing phase (90-100%)
      return ((100 - progress) / 10) * maxAltitude;
    } else {
      // Cruise phase with small variations (10-90%)
      const base = maxAltitude;
      const variation = Math.sin(progress * 0.2) * 10;
      return base + variation;
    }
  };

  // Calculate simulated battery level
  const calculateBattery = () => {
    // Simple linear drain based on progress
    return 100 - progress * 0.8; // Ends with 20% remaining
  };

  const speed = calculateSpeed();
  const distance = calculateTotalDistance();
  const eta = calculateETA();
  const altitude = calculateAltitude();
  const battery = calculateBattery();

  return (
    <div className="telemetry-dashboard">
      <h3>Drone Telemetry</h3>
      
      <div className="telemetry-grid">
        <div className="telemetry-item">
          <div className="telemetry-label">Current Position</div>
          <div className="telemetry-value">
            {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
          </div>
        </div>
        
        <div className="telemetry-item">
          <div className="telemetry-label">Speed</div>
          <div className="telemetry-value">
            {speed.toFixed(1)} m/s
          </div>
        </div>
        
        <div className="telemetry-item">
          <div className="telemetry-label">Altitude</div>
          <div className="telemetry-value">
            {altitude.toFixed(1)} m
          </div>
        </div>
        
        <div className="telemetry-item">
          <div className="telemetry-label">Distance</div>
          <div className="telemetry-value">
            {(distance / 1000).toFixed(2)} km
          </div>
        </div>
        
        <div className="telemetry-item">
          <div className="telemetry-label">ETA</div>
          <div className="telemetry-value">
            {eta}
          </div>
        </div>
        
        <div className="telemetry-item">
          <div className={`telemetry-label ${battery < 30 ? 'warning' : ''}`}>Battery</div>
          <div className={`telemetry-value ${battery < 30 ? 'warning' : ''}`}>
            {battery.toFixed(1)}%
            <div className="battery-bar">
              <div 
                className="battery-level" 
                style={{ 
                  width: `${battery}%`,
                  backgroundColor: battery < 30 ? '#ff4d4d' : '#4CAF50'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelemetryDashboard;