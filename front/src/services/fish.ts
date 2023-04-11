import IFish from "../interfaces/fish";
import http from "./httpServices";
import apiUrls from "../config.json";

async function getAllFish() {
  let fish: IFish | null = null;
  let error = "";
  return http
    .get(apiUrls.fishEndpoint)
    .then((res) => {
      return { fish: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { fish: fish, error: error };
    });
}

async function getFish(id: number) {
  let fish: IFish | null = null;
  let error = "";
  return http
    .get(apiUrls.fishEndpoint + `/${id}`)
    .then((res) => {
      return { fish: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { fish: fish, error: error };
    });
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

async function getFoodFromFish(id: number) {
  let food: IFish | null = null;
  let error = "";
  return http
    .get(apiUrls.fishEndpoint + `/${id}`)
    .then((res) => {
      return { food: res.data.food, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: food, error: error };
    });
}

export { getAllFish, getFish, getFoodFromFish, postFish, putFish };
