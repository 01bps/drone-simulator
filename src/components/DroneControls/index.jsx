import React, { useEffect, useRef } from 'react';
import './styles.css';
import { useSimulation } from '../../context/SimulationContext';

function DroneControls() {
  const { 
    waypoints, 
    isPlaying, 
    setIsPlaying,
    setCurrentPosition,
    progress,
    setProgress,
    setVisitedWaypoints
  } = useSimulation();
  
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Calculate total flight duration
  const totalDuration = waypoints.length > 0 
    ? waypoints[waypoints.length - 1].timestamp 
    : 0;

  const resetSimulation = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentPosition(waypoints.length > 0 ? waypoints[0] : null);
    setVisitedWaypoints([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    lastTimeRef.current = null;
  };

  // Find position at specific time
  const getPositionAtTime = (time) => {
    if (waypoints.length === 0) return null;
    if (time <= 0) return waypoints[0];
    if (time >= totalDuration) return waypoints[waypoints.length - 1];

    // Find waypoints before and after current time
    let beforeIndex = 0;
    let afterIndex = 1;

    for (let i = 0; i < waypoints.length - 1; i++) {
      if (waypoints[i].timestamp <= time && waypoints[i + 1].timestamp >= time) {
        beforeIndex = i;
        afterIndex = i + 1;
        break;
      }
    }

    const beforeWaypoint = waypoints[beforeIndex];
    const afterWaypoint = waypoints[afterIndex];
    const segmentDuration = afterWaypoint.timestamp - beforeWaypoint.timestamp;
    
    if (segmentDuration === 0) return beforeWaypoint;

    // Calculate interpolation factor
    const factor = (time - beforeWaypoint.timestamp) / segmentDuration;

    // Linear interpolation between waypoints
    return {
      lat: beforeWaypoint.lat + (afterWaypoint.lat - beforeWaypoint.lat) * factor,
      lng: beforeWaypoint.lng + (afterWaypoint.lng - beforeWaypoint.lng) * factor,
      timestamp: time
    };
  };

  // Handle animation frame
  const animateFrame = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      lastTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Calculate simulation time (speed up by factor of 2)
    const simulationElapsed = elapsed * 2 / 1000; // Convert to seconds and speed up
    
    // Update progress based on elapsed time
    const newProgress = Math.min(progress + (simulationElapsed / totalDuration) * 100, 100);
    setProgress(newProgress);

    // Calculate simulation time
    const currentTime = (newProgress / 100) * totalDuration;
    
    // Get current position
    const position = getPositionAtTime(currentTime);
    
    if (position) {
      setCurrentPosition(position);
      
      // Update visited waypoints
      setVisitedWaypoints(prev => {
        // Find all waypoints up to current time
        const visitedPoints = waypoints.filter(wp => wp.timestamp <= currentTime);
        
        // If we have more visited points than before, update the list
        if (visitedPoints.length > prev.length) {
          return visitedPoints;
        }
        return prev;
      });
    }

    // Continue animation if not complete
    if (newProgress < 100 && isPlaying) {
      animationRef.current = requestAnimationFrame(animateFrame);
    } else if (newProgress >= 100) {
      setIsPlaying(false);
    }
  };

  // Start/stop animation based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null; // Reset last time to avoid jumps
      animationRef.current = requestAnimationFrame(animateFrame);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, waypoints]);

  // Set initial position when waypoints change
  useEffect(() => {
    if (waypoints.length > 0 && progress === 0) {
      setCurrentPosition(waypoints[0]);
    } else if (waypoints.length === 0) {
      setCurrentPosition(null);
    }
  }, [waypoints]);

  // Jump to specific time in simulation
  const handleSeek = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    
    // Calculate time from progress
    const seekTime = (newProgress / 100) * totalDuration;
    
    // Get position at that time
    const position = getPositionAtTime(seekTime);
    if (position) {
      setCurrentPosition(position);
      
      // Update visited waypoints
      const visitedPoints = waypoints.filter(wp => wp.timestamp <= seekTime);
      setVisitedWaypoints(visitedPoints);
    }
  };

  if (waypoints.length === 0) {
    return (
      <div className="drone-controls disabled">
        <p>Add waypoints to start simulation</p>
      </div>
    );
  }

  return (
    <div className="drone-controls">
      <div className="simulation-progress">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="progress-slider"
        />
        <div className="progress-value">{Math.round(progress)}%</div>
      </div>
      
      <div className="control-buttons">
        {isPlaying ? (
          <button onClick={() => setIsPlaying(false)}>
            Pause
          </button>
        ) : (
          <button onClick={() => setIsPlaying(true)}>
            {progress > 0 && progress < 100 ? 'Resume' : 'Start'}
          </button>
        )}
        <button onClick={resetSimulation}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default DroneControls;