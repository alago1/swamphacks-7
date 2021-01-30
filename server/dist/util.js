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
exports.fetch_place_details = exports.fetch_nearby_places = exports.find_closest_results = void 0;
const axios_1 = __importDefault(require("axios"));
const dist_between_coords = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};
const find_closest_results = (lat1, lng1, google_places_results, amt) => {
    let all_dists = [];
    for (let i = 0; i < google_places_results.length; i++) {
        const lat2 = google_places_results[i].geometry.location.lat;
        const lng2 = google_places_results[i].geometry.location.lng;
        const dist = dist_between_coords(lat1, lng1, lat2, lng2);
        all_dists[i] = dist;
        google_places_results[i].distance = dist;
    }
    let closest_results = [];
    let taken_indices = [];
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
};
exports.find_closest_results = find_closest_results;
const fetch_nearby_places = (location, radius, filter) => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&${filter ? `type=${filter}&` : ""}key=${process.env.googlemaps_api_key}`);
});
exports.fetch_nearby_places = fetch_nearby_places;
const fetch_place_details = (place_id) => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_address&key=${process.env.googlemaps_api_key}`);
});
exports.fetch_place_details = fetch_place_details;
//# sourceMappingURL=util.js.map