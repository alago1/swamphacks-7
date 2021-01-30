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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.get("/", (req, res) => fetch_locations(req, res));
    app.listen(8000);
});
const fetch_locations = (_, response) => {
    const location = { lat: -33.8670522, lng: 151.1957362 };
    const radius = 1000;
    const filter = "restaurant";
    axios_1.default
        .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${filter}&key=${process.env.googlemaps_api_key}`)
        .then((res) => {
        console.log(`${res.data.results.length} results`);
        response.send(JSON.stringify(res.data.results, null, 2));
    });
};
main();
//# sourceMappingURL=index.js.map