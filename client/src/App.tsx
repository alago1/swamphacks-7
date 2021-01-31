import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Compass from './Compass';

function App() {

  // Qibla geolocation
  const location = {
    lat: 21.422487,
    lng: 39.826206,
  };

  const [dest_lat, setLat] = useState(location.lat);
  const [dest_lng, setLng] = useState(location.lng);

  return (<div className="App">
    <header className="App-header">
      <Compass lat={dest_lat} lng={dest_lng} />
    </header></div>
  );
}

export default App;