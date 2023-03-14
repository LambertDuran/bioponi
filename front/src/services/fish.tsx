import IFish from "../interfaces/fish";
import http from "./httpServices";
import apiUrls from "../config.json";

async function getAllFish() {
  const allFish = await http.get(apiUrls.fishEndpoint);
  return allFish;
}

async function postFish(fish: IFish) {
  let newFish: IFish | null = null;
  let error = "";
  return http
    .post(apiUrls.fishEndpoint, fish)
    .then((res) => {
      return { fish: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { fish: newFish, error: error };
    });
}

async function putFish(fish: IFish) {
  let newFish: IFish | null = null;
  let error = "";
  return http
    .put(apiUrls.fishEndpoint + `/${fish.id}`, fish)
    .then((res) => {
      return { fish: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { fish: newFish, error: error };
    });
}

export { getAllFish, postFish, putFish };
