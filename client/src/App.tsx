import React, { useState, useEffect } from "react";
import axios from "axios";
import { Geolocation } from "./types/geolocation";
import { attemptGetGeolocation } from "./util/geolocation";
import Compass from './Compass';
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
    if (startSearch) attemptGetGeolocation(onGeolocationSuccess);
  }, [startSearch]);

  useEffect(() => {
    if (geolocation?.lat && geolocation?.lng) {
      const params = {
        lat: String(geolocation?.lat ?? "29.6483"),
        lng: String(geolocation?.lng ?? "-82.3494"),
        filter: "restaurant",
      };
      const searchParams = String(new URLSearchParams(params));

      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://us-central1-astral-outpost-303423.cloudfunctions.net/fetch_locations?${searchParams}`,
          {
            headers: { "Access-Control-Allow-Origin": "*" },
          }
        )
        .then((res) => {
          console.log(res);
          setData(res.data);
        })
        .catch((e) => console.error(e));
    }
  }, [geolocation]);

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
{geolocation &&  <Compass lat={geolocation.lat} lng={geolocation.lng} />}
        <button onClick={() => setStartSearch(true)} disabled={startSearch}>
          Search for places
        </button>
      </header>
    </div>
  );
}

export default App;