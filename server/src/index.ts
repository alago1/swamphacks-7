import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import {
  filter_by_closest,
  fetch_nearby_places,
  fetch_place_details,
  fetch_venue_forecast,
  removeDups,
} from "./util";
import { PlacesAPIResults, NearbyPlacesResults } from "./maps_api";

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

const fetch_locations = (request: any, response: any) => {
  const location = /*{ lat: request.query.lat, lng: request.query.lng };*/ {
    lat: 28.54685,
    lng: -81.53067,
  };
  const radius = 1000;
  const disabled_pois = request.query.filter;

  fetch_nearby_places(location, radius, disabled_pois)
    .then((places: any[]) => {
      // filter closest places
      const queried_places: any = removeDups(
        places
          .filter((e: any[]) => e.length > 0)
          .reduce((acc, val) => acc.concat(val), []),
        (e: any) => e.place_id
      );
      // console.log(queried_places);
      // console.log(queried_places.length);

      return filter_by_closest(
        location.lat,
        location.lng,
        queried_places,
        20
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
    .then(async (places: NearbyPlacesResults[]) => {
      // get forecast data
      const forecasted_places: NearbyPlacesResults[] = [];
      await Promise.all(
        places.map(async (e) => {
          const forecast = fetch_venue_forecast(e.name, e.formatted_address!);
          forecasted_places.push({
            forecast: await forecast,
            ...e,
          });
          return forecast;
        })
      );
      return forecasted_places.map((e: any) => ({
        ...e,
        forecast: e.forecast?.analysis ?? null,
      }));
    })
    .then((e) => {
      // console.log("success");
      // console.log(e);
      // console.log(e.length);
      response.send(e);
    })
    .catch((e) => console.error(e));
};

main();
