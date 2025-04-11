# Drone Motion Simulator

A responsive, interactive web application that simulates drone movement over a map using waypoint-based path planning. Built with React and Leaflet, this tool allows users to define drone routes, control simulation playback, and visualize telemetry data in real-time.

---

## Overview

Drone Motion Simulator enables users to:

- Define flight paths via manual input or CSV upload
- Visualize routes with animated drone movement
- Control simulation with play/pause/reset
- Track real-time telemetry like speed, altitude, ETA, and battery level
- Use intuitive UI with a premium dark theme and responsive design

# Drone Simulator
![image](https://github.com/user-attachments/assets/049c7d40-4b72-46fb-92ba-a66d56ef9272)

## Demonstaration Video:

https://github.com/user-attachments/assets/8824b8ce-8e90-420e-8065-a1b4a2a08684

## Prerequisites
- Node.js (v14+)
- npm (v6+)

## Steps to Setup the app locally:
```
npx create-react-app .

npm install leaflet react-leaflet @ant-design/icons react-geocode papaparse

npm start
```


## Features

#### Interactive Map & Path Planning
- Leaflet-based interactive map
- Add waypoints via:
  - Manual coordinate entry
  - Double-clicking on the map
  - CSV file upload
- Visual distinction between:
  - Traveled path (solid line)
  - Future path (dotted line)

#### Simulation Controls
- Play, pause, and reset buttons
- Jump to any part of the simulation using a progress slider
- Auto-fit map bounds to display entire flight path

#### Telemetry Dashboard
- Live updates for:
  - Latitude and Longitude
  - Speed (based on timestamps)
  - Simulated Altitude
  - Distance traveled
  - Estimated Time of Arrival (ETA)
  - Simulated Battery Level

#### UI/UX Enhancements
- Dark theme with matte black styling
- Enhanced button and form styling
- Responsive design for desktop and mobile
- Smooth animations and real-time feedback

---

## Example CSV Format

```csv
lat,lng,timestamp
28.7041,77.1025,0
28.7045,77.1030,5
28.7050,77.1035,10
28.7055,77.1040,15
```

Each row defines a waypoint with a timestamp (in seconds). At least two points are needed to run the simulation.

---

## Future Enhancements

- 3D Visualization using altitude data  
- Weather simulation (wind, rain, visibility)  
- Battery consumption models based on distance and speed  
- Flight plan export for real drone systems  
- Multi-drone support with parallel flight paths  

---
