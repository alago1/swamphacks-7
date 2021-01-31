import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  console.log("App started at least");

  return (<div className="App">
    <header className="App-header">
      <div className="compass">
      <div className="arrow"></div>
      <div className="compass-circle"></div>
      <div className="my-point"></div>
    </div>
      <button className="start-btn" onClick={() => start_compass()}>Start compass</button></header></div>);
}

function start_compass() {
  console.log("in start_compass()");
  navigator.geolocation.getCurrentPosition(locationHandler);
  const compassCircle:any = document.querySelector(".compass-circle");
  const startBtn = document.querySelector(".start-btn");
  const myPoint = document.querySelector(".my-point");
  let compass;

  function handler(e: any) {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
  }

  // Qibla geolocation
  const location = {
    lat: 21.422487,
    lng: 39.826206,
  };

  const isIOS = !(
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
  );

  let pointDegree;

  function locationHandler(position: any) {
    const { latitude, longitude } = position.coords;
    pointDegree = calcDegreeToPoint(latitude, longitude);

    if (pointDegree < 0) {
      pointDegree = pointDegree + 360;
    }
  }

  function calcDegreeToPoint(latitude: number, longitude: number) {

    const phiK = (latitude * Math.PI) / 180.0;
    const lambdaK = (longitude * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
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
    console.log("Is definitely IOS");
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handler, true);
        } else {
          alert("has to be allowed!");
        }
      })
      .catch(() => alert("not supported"));
  } else {
    console.log("Not IOS");
    window.addEventListener("deviceorientationabsolute", handler, true);
  }

}

export default App;
