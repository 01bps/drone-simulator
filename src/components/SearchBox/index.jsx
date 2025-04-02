import React, { useState } from 'react';
import './styles.css';
import { useSimulation } from '../../context/SimulationContext';

function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('');
  const { setSelectedLocation } = useSimulation();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      // Using Nominatim API (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        setSelectedLocation({
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          name: location.display_name
        });
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('Failed to search for location');
    }
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBox;