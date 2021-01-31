import React, { useState, useEffect } from "react";
import axios from "axios";
import { Geolocation } from "./types/geolocation";
import { attemptGetGeolocation } from "./util/geolocation";
import Compass from "./Compass";
import Timer from "./Timer";
import "./App.css";
import { calculate_weighted_avg } from "./util/weighted_avg";

function App() {
  const [geolocation, setGeolocation] = useState<Geolocation>();
  const [startSearch, setStartSearch] = useState(false);
  const [data, setData] = useState();
  const [weighted, setWeighted] = useState<Geolocation>();

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
          const res_data = res.data.map((e: any) => {
            const rating = e.rating ?? 2.5;
            const distance = e.distance ?? 500;
            const buzyness = e.forecast.venue_live_busyness ?? 100;

            e.weight = Math.pow(rating, 4) / (buzyness * distance);
            return e;
          });
          setData(res_data);
          setWeighted(calculate_weighted_avg(res_data));
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
        {geolocation && <Compass lat={weighted?.lat} lng={weighted?.lng} />}
        <button onClick={() => setStartSearch(true)} disabled={startSearch}>
          Search for places
        </button>
        <Timer
          duration={120}
          start={startSearch}
          onCountdownEnd={() => {
            setWeighted(calculate_weighted_avg(data));
          }}
        />
      </header>
    </div>
  );
}

export default App;
