import axios from "axios";

const main = async () => {
  const location = { lat: -33.8670522, lng: 151.1957362 };
  const radius = 50;
  const filter = "restaurant";

  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${filter}&key=${process.env.googlemaps_api_key}`
    )
    .then((res: any) => {
      console.log(res.data.results);
    });
};

main();
