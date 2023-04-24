import IFish from "../interfaces/fish";
import http from "./httpServices";

const apiEndPoint = process.env.REACT_APP_API_ENDPOINT + "fish";

async function getAllFish() {
  let fish: IFish | null = null;
  let error = "";
  return http
    .get(apiEndPoint)
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
    .get(apiEndPoint + `/${id}`)
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
    .post(apiEndPoint, fish)
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
    .put(apiEndPoint + `/${fish.id}`, fish)
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
    .get(apiEndPoint + `/${id}`)
    .then((res) => {
      return { food: res.data.food, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: food, error: error };
    });
}

export { getAllFish, getFish, getFoodFromFish, postFish, putFish };
