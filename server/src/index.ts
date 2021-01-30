import express from "express";
import {
  filter_by_closest,
  fetch_nearby_places,
  fetch_place_details,
} from "./util";
import {
  PlacesAPIResponse,
  api_results,
  NearbyPlacesResults,
  PlaceDetailsResults,
} from "./maps_api";

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

      return filter_by_closest(
        location.lat,
        location.lng,
        data.results!,
        10
      ) as NearbyPlacesResults[];
    })
    .then(async (closest: NearbyPlacesResults[]) => {
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
    .then((e: any) => {
      response.send(e);
    });
};

main();
