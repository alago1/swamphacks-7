import React, { useState, useEffect } from "react";
import { Geolocation } from "./types/geolocation";
import { attemptGetGeolocation } from "./util/geolocation";
import "./App.css";

function App() {
  const [geolocation, setGeolocation] = useState<Geolocation>();
  const [startSearch, setStartSearch] = useState(false);

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (startSearch) {
      attemptGetGeolocation(onGeolocationSuccess);
      id = setInterval(() => {
        attemptGetGeolocation(onGeolocationSuccess);
      }, 120000);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [startSearch]);

  const onGeolocationSuccess = (pos: any) => {
    const crd = pos.coords;
    setGeolocation({
      lat: crd.latitude,
      lng: crd.longitude,
      accuracy: crd.accuracy,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setStartSearch(true)} disabled={startSearch}>
          Search for places
        </button>
        <h3>
          {geolocation &&
            `${geolocation.lat} ${geolocation.lng} @ ${geolocation.accuracy} accuracy`}
        </h3>
      </header>
    </div>
  );
}

export default App;
