"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.use(body_parser_1.default.json());
    app.get("/", (req, res) => fetch_locations(req, res));
    app.get("/compass", (req, res) => show_compass(req, res));
    axios_1.default
        .get(`https://besttime.app/api/v1/keys/${process.env.besttime_pri}`)
        .then((res) => {
        const e = res.data;
        if (e.status == "OK" &&
            e.active &&
            e.credits_forecast > 0 &&
            e.credits_query > 0) {
            console.log(`Besttime api is ready! 🚀️  Credits left: ${e.credits_forecast}F ${e.credits_query}Q`);
        }
        else {
            console.log("Besttime api problem 😵️");
            console.log(e);
        }
    });
    app.listen(process.env.PORT || 8000);
});
const fetch_locations = (request, response) => {
    const location = { lat: request.query.lat, lng: request.query.lng };
    const radius = 1000;
    const disabled_pois = request.query.filter;
    util_1.fetch_nearby_places(location, radius, disabled_pois)
        .then((places) => {
        const queried_places = util_1.removeDups(places
            .filter((e) => e.length > 0)
            .reduce((acc, val) => acc.concat(val), []), (e) => e.place_id);
        return util_1.filter_by_closest(location.lat, location.lng, queried_places, 20);
    })
        .then((closest) => __awaiter(void 0, void 0, void 0, function* () {
        const detailed_places = [];
        yield Promise.all(closest.map((e) => __awaiter(void 0, void 0, void 0, function* () {
            const details = util_1.fetch_place_details(e.place_id);
            detailed_places.push(Object.assign(Object.assign({}, (yield details).data.result), e));
            return details;
        })));
        return detailed_places;
    }))
        .then((places) => __awaiter(void 0, void 0, void 0, function* () {
        const forecasted_places = [];
        yield Promise.all(places.map((e) => __awaiter(void 0, void 0, void 0, function* () {
            const forecast = util_1.fetch_venue_forecast(e.name, e.formatted_address);
            forecasted_places.push(Object.assign({ forecast: yield forecast }, e));
            return forecast;
        })));
        return forecasted_places.map((e) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, e), { forecast: (_b = (_a = e.forecast) === null || _a === void 0 ? void 0 : _a.analysis) !== null && _b !== void 0 ? _b : null }));
        });
    }))
        .then((e) => {
        response.send(e);
    })
        .catch((e) => console.error(e));
};
const show_compass = (request, response) => {
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
};
main();
//# sourceMappingURL=index.js.map