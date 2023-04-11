import IFood from "../interfaces/food";
import http from "./httpServices";
import apiUrls from "../config.json";

async function getAllFood() {
  let food: IFood | null = null;
  let error = "";
  return http
    .get(apiUrls.foodEndpoint)
    .then((res) => {
      return { food: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: food, error: error };
    });
}

async function getFood(id: number) {
  let food: IFood | null = null;
  let error = "";
  return http
    .get(apiUrls.foodEndpoint + `/${id}`)
    .then((res) => {
      return { food: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: food, error: error };
    });
}

async function postFood(food: IFood) {
  let newFood: IFood | null = null;
  let error = "";
  return http
    .post(apiUrls.foodEndpoint, food)
    .then((res) => {
      return { food: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: newFood, error: error };
    });
}

async function putFood(food: IFood) {
  let newFood: IFood | null = null;
  let error = "";
  return http
    .put(apiUrls.foodEndpoint + `/${food.id}`, food)
    .then((res) => {
      return { food: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: newFood, error: error };
    });
}

export { getAllFood, getFood, postFood, putFood };
