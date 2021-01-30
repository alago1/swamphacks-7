import { Geolocation } from "../types/geolocation";

const navigation_options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const attemptGetGeolocation = (
  success: Function = () => {},
  fail: Function = () => {}
) => {
  navigator.geolocation.getCurrentPosition(
    success as PositionCallback,
    fail as PositionErrorCallback,
    navigation_options
  );
};
