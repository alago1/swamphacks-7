import React from "react";
import { isConstTypeReference } from "typescript";

const Compass = (props: any) => {
  function start_compass(dest_lat: number, dest_lng: number) {
    console.log("in start_compass()");
    navigator.geolocation.getCurrentPosition(locationHandler);
    const compassCircle: any = document.querySelector(".compass-circle");
    const startBtn = document.querySelector(".start-btn");
    const myPoint = document.querySelector(".my-point");
    let compass;

    function handler(e: any) {
      compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
    }

    var isIOS = (function () {
      var iosQuirkPresent = function () {
        var audio = new Audio();

        audio.volume = 0.5;
        return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
      };

      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      var isAppleDevice = navigator.userAgent.includes("Macintosh");
      var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

      return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
    })();

    let pointDegree;

    function locationHandler(cur_position: any) {
      const { latitude, longitude } = cur_position.coords;
      pointDegree = calcDegreeToPoint(latitude, longitude, dest_lat, dest_lng);

      if (pointDegree < 0) {
        pointDegree = pointDegree + 360;
      }
    }

    function calcDegreeToPoint(
      lat1: number,
      lng1: number,
      lat2: number,
      lng2: number
    ) {
      const phiK = (lat1 * Math.PI) / 180.0;
      const lambdaK = (lng1 * Math.PI) / 180.0;
      const phi = (lat2 * Math.PI) / 180.0;
      const lambda = (lng2 * Math.PI) / 180.0;
      const psi =
        (180.0 / Math.PI) *
        Math.atan2(
          Math.sin(lambdaK - lambda),
          Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
      return Math.round(psi);
    }

    console.log("Before IOS check");
    if (isIOS) {
      compassCircle.style.transform = `translate(-50%, -50%) rotate(180deg)`;
      console.log("Is definitely IOS");
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.removeEventListener("deviceorientation", handler, true);
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("has to be allowed!");
          }
        })
        .catch(() => alert("not supported"));
    } else {
      compassCircle.style.transform = `translate(-50%, -50%) rotate(90deg)`;
      console.log("Not IOS");
      window.removeEventListener("deviceorientationabsolute", handler, true);
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  }

  return (
    <div>
      <div className="compass">
        {/* <div className="arrow"></div> */}
        <div className="compass-ring"></div>
        <div className="compass-circle"></div>
        {/* <div className="my-point"></div> */}
      </div>
      <button
        className="start-btn"
        onClick={() => start_compass(props.lat, props.lng)}
      >
        Start compass
      </button>
    </div>
  );
};

export default Compass;
