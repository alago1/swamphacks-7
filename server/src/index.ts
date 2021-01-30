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
import { NearbyPlacesResults } from "./maps_api";

const main = async () => {
  const app = express();
  app.use(bodyParser.json());

  app.get("/", (req, res) => fetch_locations(req, res));
  app.get("/compass", (req, res) => show_compass(req, res));

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

  app.listen(process.env.PORT || 8000);
};

const fetch_locations = (request: any, response: any) => {
  const location = { lat: request.query.lat, lng: request.query.lng };
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

const show_compass = (request: any, response: any) => {
  /*let compass;
  let compassCircle: any;
  let myPoint: any;

  function handler(e: any) {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
  }

  // Qibla geolocation
  const location = {
    lat: 21.422487,
    lng: 39.826206,
  };

  const isIOS = !(
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
  );

  let pointDegree;

  function locationHandler(position: any) {
    const { latitude, longitude } = position.coords;
    pointDegree = calcDegreeToPoint(latitude, longitude);

    if (pointDegree < 0) {
      pointDegree = pointDegree + 360;
    }
  }

  function calcDegreeToPoint(latitude: number, longitude: number) {

    const phiK = (latitude * Math.PI) / 180.0;
    const lambdaK = (longitude * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
    return Math.round(psi);
  }

  if (isIOS) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handler, true);
        } else {
          alert("has to be allowed!");
        }
      })
      .catch(() => alert("not supported"));
  } else {
    window.addEventListener("deviceorientationabsolute", handler, true);
  }*/

  response.send(`<style>
  body {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .compass {
    position: relative;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: auto;
  }

  .compass > .arrow {
    position: absolute;
    width: 0;
    height: 0;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 30px 20px 0 20px;
    border-color: red transparent transparent transparent;
    z-index: 1;
  }

  .compass > .compass-circle,
  .compass > .my-point {
    position: absolute;
    width: 90%;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease-out;
    background: url(https://purepng.com/public/uploads/large/purepng.com-compasscompassinstrumentnavigationcardinal-directionspointsdiagram-1701527842316onq7x.png)
      center no-repeat;
    background-size: contain;
  }

  .compass > .my-point {
    opacity: 0;
    width: 20%;
    height: 20%;
    background: rgb(8, 223, 69);
    border-radius: 50%;
    transition: opacity 0.5s ease-out;
  }

  .start-btn {
    margin-bottom: auto;
  }
</style><div class="compass">
  <div class="arrow"></div>
  <div class="compass-circle"></div>
  <div class="my-point"></div>
</div>
<button class="start-btn">Start compass</button>`);
}

main();
