import axios from "axios";
import {
  NearbyPlacesResults,
  PlaceDetailsResults,
  location,
  PlacesAPIResults,
  PlacesAPIResponse,
  api_results,
  api_response,
} from "./maps_api";

const dist_between_coords = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};

export const filter_by_closest = (
  lat1: number,
  lng1: number,
  google_places_results: api_results,
  amt: number
): api_results => {
  const all_dists: number[] = [];

  google_places_results = google_places_results.map((e) => {
    const lat2 = e.geometry.location.lat;
    const lng2 = e.geometry.location.lng;
    const dist = dist_between_coords(lat1, lng1, lat2, lng2);
    all_dists.push(dist);
    e.distance = dist;
    return e;
  });

  let closest_results: api_results = [];
  let taken_indices: number[] = [];

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

  return closest_results.filter((e) => e); //filter out undefined if there are less than amt results
};

export const fetch_nearby_places = async (
  location: location,
  radius: number,
  filter: string
): Promise<api_response<PlacesAPIResponse>> => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
      location.lat
    },${location.lng}&radius=${radius}&${filter ? `type=${filter}&` : ""}key=${
      process.env.googlemaps_api_key
    }`
  );
};

export const fetch_place_details = async (
  place_id: string
): Promise<api_response<PlacesAPIResponse>> => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_address&key=${process.env.googlemaps_api_key}`
  );
};
