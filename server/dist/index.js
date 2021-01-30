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
const express_1 = __importDefault(require("express"));
const util_1 = require("./util");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.get("/", (req, res) => fetch_locations(req, res));
    app.listen(8000);
});
const fetch_locations = (_, response) => {
    const location = { lat: -33.8670522, lng: 151.1957362 };
    const radius = 100;
    const filter = "restaurant";
    util_1.fetch_nearby_places(location, radius, filter)
        .then((res) => {
        const data = res.data;
        return util_1.filter_by_closest(location.lat, location.lng, data.results, 10);
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
        .then((e) => {
        response.send(e);
    });
};
main();
//# sourceMappingURL=index.js.map