import { Geolocation } from "../types/geolocation";

const navigation_options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const attemptGetGeolocation = (
  success: Function = () => {},
  fail: Function = () => {}
): any | undefined => {
  let position = null;
  navigator.geolocation.getCurrentPosition(
    (pos: any) => {
      position = success(pos);
    },
    fail as PositionErrorCallback,
    navigation_options
  );

  return position;
};
