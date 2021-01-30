import express from "express";
import {
  find_closest_results,
  fetch_nearby_places,
  fetch_place_details,
} from "./util";
import { PlacesAPIResponse } from "./maps_api";

const main = async () => {
  const app = express();

  app.get("/", (req, res) => fetch_locations(req, res));

  app.listen(8000);
};

const fetch_locations = (_: any, response: any) => {
  const location = { lat: -33.8670522, lng: 151.1957362 };
  const radius = 100;
  const filter = "restaurant";

  fetch_nearby_places(location, radius, filter)
    .then((res: any) => {
      const data = res.data as PlacesAPIResponse;

      return find_closest_results(location.lat, location.lng, data.results, 10);
    })
    .then((res: any) => {
      // const
    });
};

main();
