import { api_nearby_places, api_place_details } from "./constants";

export interface api_response<T> {
  data: T;
}
export type api_results = (NearbyPlacesResults | PlaceDetailsResults)[];

export interface PlacesAPIResponse {
  html_attributions: string[];
  next_page_token: string;
  results?: api_results;
  result?: PlaceDetailsResults;
  status:
    | "OK"
    | "UNKNOWN_ERROR"
    | "ZERO_RESULTS"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"
    | "NOT_FOUND";
}

export type place_type = typeof api_nearby_places[number];
export type detailed_place_type = place_type | typeof api_place_details[number];

export interface location {
  lat: number;
  lng: number;
}

export interface PlacesAPIResults {
  geometry: {
    location: location;
    viewport: {
      northeast: location;
      southwest: location;
    };
  };
  name: string;
}

export interface NearbyPlacesResults extends PlacesAPIResults {
  icon: string;
  photos: [
    {
      height: number;
      html_attributions: string[];
      photo_reference: string;
      width: number;
    }
  ];
  place_id: string;
  reference: string;
  scope: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
  types: detailed_place_type[];
  distance?: number;
  formatted_address?: string;
  forecast?: Object;
}

export interface PlaceDetailsResults extends PlacesAPIResults {
  rating: number;
  user_ratings_total: number;
  types: detailed_place_type[];
  formatted_address: string;
  distance?: number;
}
