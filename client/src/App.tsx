import React, { useState, useEffect } from "react";
import axios from "axios";
import { Geolocation } from "./types/geolocation";
import { attemptGetGeolocation } from "./util/geolocation";
import "./App.css";

function App() {
  const [geolocation, setGeolocation] = useState<Geolocation>();
  const [startSearch, setStartSearch] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (startSearch) {
      id = setInterval(() => {
        attemptGetGeolocation(onGeolocationSuccess);
      }, 120000);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [startSearch]);

  useEffect(() => {
    if (startSearch) {
      attemptGetGeolocation(onGeolocationSuccess);

      if (geolocation) {
        const params = {
          lat: String(geolocation.lat),
          lng: String(geolocation.lng),
          filter: "restaurant",
        };
        const searchParams = String(new URLSearchParams(params));
        axios
          .get(
            `https://us-central1-astral-outpost-303423.cloudfunctions.net/fetch_locations?${searchParams}`,
            {
              headers: { "Access-Control-Allow-Origin": "*" },
            }
          )
          .then((res) => {
            setData(res.data);
            console.log(res.data);
          })
          .catch((e) => console.error(e));
      }
    }
  }, [startSearch, geolocation]);

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
