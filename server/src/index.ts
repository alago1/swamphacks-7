import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import {
  filter_by_closest,
  fetch_nearby_places,
  fetch_place_details,
} from "./util";
import { PlacesAPIResponse, NearbyPlacesResults } from "./maps_api";

const main = async () => {
  const app = express();
  app.use(bodyParser.json());

  app.get("/", (req, res) => fetch_locations(req, res));

  axios
    .get(`https://besttime.app/api/v1/keys/${process.env.besttime_pri}`)
    .then((res: any) => {
      const e = res.data;
      if (
        e.status == "OK" &&
        e.active &&
        e.credits_forecast > 0 &&
        e.credits_query > 0
      ) {
        console.log(
          `Besttime api is ready! 🚀️  Credits left: ${e.credits_forecast}F ${e.credits_query}Q`
        );
      } else {
        console.log("Besttime api problem 😵️");
        console.log(e);
      }
    });

  app.listen(8000);
};

const fetch_locations = (_: any, response: any) => {
  const location = { lat: -33.8670522, lng: 151.1957362 };
  const radius = 100;
  const filter = "restaurant";

  fetch_nearby_places(location, radius, filter)
    .then((res: any) => {
      // filter closest places
      const data = res.data as PlacesAPIResponse;

      return filter_by_closest(
        location.lat,
        location.lng,
        data.results!,
        10
      ) as NearbyPlacesResults[];
    })
    .then(async (closest: NearbyPlacesResults[]) => {
      // get their addresses
      const detailed_places: NearbyPlacesResults[] = [];
      await Promise.all(
        closest.map(async (e) => {
          const details = fetch_place_details(e.place_id);
          detailed_places.push({
            ...(await details).data.result!,
            ...e,
          });
          return details;
        })
      );
      return detailed_places;
    })
    .then((places: NearbyPlacesResults[]) => {
      // get forecast data
      response.send(places);
    });
};

main();
