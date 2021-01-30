import axios from "axios";
import express from "express";

const main = async () => {
  const app = express();

  app.get("/", (req, res) => fetch_locations(req, res));

  app.listen(8000);
};

const fetch_locations = (_: any, response: any) => {
  const location = { lat: -33.8670522, lng: 151.1957362 };
  const radius = 1000;
  const filter = "restaurant";

  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${filter}&key=${process.env.googlemaps_api_key}`
    )
    .then((res: any) => {
      //   res.data.results.forEach((e: any) => {
      //     console.log(e);
      //     console.log(e.geometry.location);
      //   });
      console.log(`${res.data.results.length} results`);
      
      let closest_results = find_closest_results(location.lat, location.lng, res.data.results, 10);

      response.send(JSON.stringify(closest_results, null, 2));
    });
};

function dist_between_coords(lat1: number, lng1:number, lat2:number, lng2:number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  return d;
}

function find_closest_results(lat1: number, lng1: number, google_places_results: any, amt: number) {
  let all_dists = [];

  for (let i = 0; i < google_places_results.length; i++) {
    const lat2 = google_places_results[i].geometry.location.lat;
    const lng2 = google_places_results[i].geometry.location.lng;
    const dist = dist_between_coords(lat1, lng1, lat2, lng2);
    all_dists[i] = dist;
    google_places_results[i].distance = dist;
  }

  let closest_results: number[] = []
  let taken_indices: number[] = []

  for (let k = 0; k < amt; k++) {
    let lowest_dist = Infinity;
    let low_dist_index = -1;
    for (let i = 0; i < google_places_results.length; i++) {
      if (all_dists[i] < lowest_dist && !taken_indices.includes(i)) {
        lowest_dist = all_dists[i];
        low_dist_index = i;
      }
    }
    closest_results.push(google_places_results[low_dist_index]);
    taken_indices.push(low_dist_index);
  }

  return closest_results;
}

main();
