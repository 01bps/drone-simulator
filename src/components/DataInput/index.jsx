import React, { useState } from 'react';
import './styles.css';
import { useSimulation } from '../../context/SimulationContext';
import Papa from 'papaparse';

function DataInput() {
  const { setWaypoints, selectedLocation } = useSimulation();
  const [manualPoints, setManualPoints] = useState([
    { lat: "", lng: "", timestamp: 0 }
  ]);

  // Add a new empty input row
  const addWaypoint = () => {
    setManualPoints([...manualPoints, { lat: "", lng: "", timestamp: 0 }]);
  };

  // Update specific input field
  const updateWaypoint = (index, field, value) => {
    const newPoints = [...manualPoints];
    newPoints[index][field] = value;
    setManualPoints(newPoints);
  };

  // Handle manual entry form submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    // Filter out incomplete entries and parse numbers
    const validPoints = manualPoints
      .filter(point => point.lat !== "" && point.lng !== "")
      .map((point, index) => ({
        lat: parseFloat(point.lat),
        lng: parseFloat(point.lng),
        timestamp: point.timestamp || index * 5 // Use timestamp or default to 5 seconds per point
      }));
    
    if (validPoints.length > 0) {
      setWaypoints(validPoints);
    } else {
      alert("Please enter at least one valid waypoint");
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedPoints = results.data
          .filter(row => row.lat && row.lng)
          .map((row, index) => ({
            lat: parseFloat(row.lat || row.latitude || 0),
            lng: parseFloat(row.lng || row.longitude || 0),
            timestamp: parseFloat(row.timestamp || index * 5)
          }));

        if (parsedPoints.length > 0) {
          setWaypoints(parsedPoints);
        } else {
          alert("No valid waypoints found in file");
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse file');
      }
    });
  };

  // Use selected location from search as first waypoint
  const useSelectedLocation = () => {
    if (selectedLocation) {
      if (manualPoints.length === 1 && manualPoints[0].lat === "" && manualPoints[0].lng === "") {
        // Replace the first empty point
        setManualPoints([
          { 
            lat: selectedLocation.lat.toString(), 
            lng: selectedLocation.lng.toString(), 
            timestamp: 0 
          }
        ]);
      } else {
        // Add as a new point
        setManualPoints([
          ...manualPoints,
          { 
            lat: selectedLocation.lat.toString(), 
            lng: selectedLocation.lng.toString(), 
            timestamp: manualPoints.length * 5 
          }
        ]);
      }
    }
  };

  return (
    <div className="data-input">
      <h3>Add Waypoints</h3>
      
      {selectedLocation && (
        <button 
          type="button" 
          className="use-location-btn"
          onClick={useSelectedLocation}
        >
          Use Selected Location
        </button>
      )}
      
      <div className="input-methods">
        <div className="manual-input">
          <h4>Manual Entry</h4>
          <form onSubmit={handleManualSubmit}>
            {manualPoints.map((point, index) => (
              <div key={index} className="waypoint-row">
                <div className="input-group">
                  <label>Latitude:</label>
                  <input
                    type="number"
                    step="any"
                    value={point.lat}
                    onChange={(e) => updateWaypoint(index, 'lat', e.target.value)}
                    placeholder="Latitude"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Longitude:</label>
                  <input
                    type="number"
                    step="any"
                    value={point.lng}
                    onChange={(e) => updateWaypoint(index, 'lng', e.target.value)}
                    placeholder="Longitude"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Time (s):</label>
                  <input
                    type="number"
                    value={point.timestamp}
                    onChange={(e) => updateWaypoint(index, 'timestamp', parseFloat(e.target.value))}
                    placeholder="Seconds"
                  />
                </div>
              </div>
            ))}
            <div className="button-group">
              <button type="button" onClick={addWaypoint}>
                Add Waypoint
              </button>
              <button type="submit">
                Set Path
              </button>
            </div>
          </form>
        </div>
        
        <div className="file-input">
          <h4>Upload Data File</h4>
          <p>CSV with columns: lat,lng,timestamp</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
}

export default DataInput;