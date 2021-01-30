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
      response.send(JSON.stringify(res.data.results, null, 2));
    });
};

main();
