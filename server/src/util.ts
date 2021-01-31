import axios from "axios";
import { api_pois } from "./constants";
import {
  location,
  PlacesAPIResponse,
  api_results,
  api_response,
  detailed_place_type,
} from "./maps_api";
import { venue_forecast } from "./besttime_api";
const fetch = require("node-fetch");

export const removeDups = <T>(arr: T[], key: Function): T[] => {
  const seen = new Set();
  return arr.filter((e) => {
    if (seen.has(key(e))) {
      return false;
    }
    seen.add(key(e));
    return true;
  });
};

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
  disabled_pois: detailed_place_type[]
): Promise<any> => {
  const filters = api_pois.filter(
    (e) => !disabled_pois || !disabled_pois.includes(e)
  );

  return Promise.all(
    filters.map((filter) =>
      get_filtered_pois(location, radius, filter)
        .then((res) => res.data.results!)
        .then((res) => filter_by_closest(location.lat, location.lng, res, 5))
    )
  );
};

export const deg_to_rad = (degrees: number) => {
  return degrees*2*Math.PI/360;
}

export const rad_to_deg = (degrees: number) => {
  return degrees*360/2/Math.PI;
}

export const geo_coords_to_cartesian = (lat_deg: number, lng_deg: number) => {
  const lat_rad = deg_to_rad(lat_deg);
  const lng_rad = deg_to_rad(lng_deg);

  const x = Math.sin(lat_rad) * Math.cos(lng_rad);
  const y = Math.sin(lat_rad) * Math.sin(lng_rad);
  const z = Math.cos(lat_rad); 

  return {x, y, z};
}

export const cartesian_to_geo_coords = (x: number, y: number, z: number) => {
  const lat = rad_to_deg(Math.atan2(z, Math.sqrt(x * x + y * y)))
  const lng = rad_to_deg(Math.atan2(-y, x));
  return {lat, lng};
}

export const weighted_avg_geo_coords = (geo_coords: any) => {
  // geo_coords should be formatted: [{lat: 22.12313, lng: 41.3123, weight: 3}, {lat: 31.213, lng: 41.3123, weight: 8}, ...]

  // sums all weights
  let totalWeight = 0;
  geo_coords.array.forEach((element:any) => {
    totalWeight += element.weight;
  });

  // makes new coords object with cartesian instead of geo coords
  let cartesian_coords: any = [];
  geo_coords.array.forEach((element:any) => {
    let {x, y, z} = geo_coords_to_cartesian(element.lat, element.lng);
    cartesian_coords.push({x: x, y: y, z: z, weight: element.weight});
  });

  // gets the weighed average of all cartesian coords
  let weighted_x_avg = 0;
  let weighted_y_avg = 0;
  let weighted_z_avg = 0;
  cartesian_coords.forEach((element: any) => {
    weighted_x_avg += element.x*element.weight;
    weighted_y_avg += element.y*element.weight;
    weighted_z_avg += element.z*element.weight;
  });
  weighted_x_avg /= totalWeight;
  weighted_y_avg /= totalWeight;
  weighted_z_avg /= totalWeight;

  // converts back to geo coords and returns
  return cartesian_to_geo_coords(weighted_x_avg, weighted_y_avg, weighted_z_avg);
}

export const get_filtered_pois = async (
  location: location,
  radius: number,
  filter: detailed_place_type
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

export const fetch_venue_forecast = async (
  venue_name: string,
  venue_address: string
): Promise<venue_forecast> => {
  const params = {
    api_key_private: process.env.besttime_pri!,
    venue_name: venue_name,
    venue_address: venue_address,
  };
  const response = await fetch(
    `https://besttime.app/api/v1/forecasts/live?${new URLSearchParams(params)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    }
  );

  return response.json();
  //   return axios.post(
  //     `https://besttime.app/api/v1/forecasts/live?${new URLSearchParams(params)}`,
  //     params
  //   );
};
