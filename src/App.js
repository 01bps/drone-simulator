import React from 'react';
import './App.css';
import { SimulationProvider } from './context/SimulationContext';
import MapComponent from './components/Map';
import SearchBox from './components/SearchBox';
import DataInput from './components/DataInput';
import DroneControls from './components/DroneControls';
import TelemetryDashboard from './components/TelemetryDashboard';

function App() {
  return (
    <SimulationProvider>
      <div className="app">
        <header className="app-header">
          <h1>Drone Motion Simulator</h1>
        </header>
        
        <main className="app-main">
          <div className="map-section">
            <div className="map-wrapper">
              <MapComponent />
              <SearchBox />
            </div>
          </div>
          
          <div className="controls-section">
            <DataInput />
            <DroneControls />
            <TelemetryDashboard />
          </div>
        </main>
        
        <footer className="app-footer">
          <p>Drone Motion Simulator © 2025</p>
        </footer>
      </div>
    </SimulationProvider>
  );
}

export default App;