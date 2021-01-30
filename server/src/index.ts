import axios from "axios";

const main = async () => {
  axios.get("https://api.kanye.rest").then((res: any) => {
    console.log(res.data);
  });

  console.log(process.env.test);
};

main();
