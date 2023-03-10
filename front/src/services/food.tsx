import IFood from "../interfaces/food";
import http from "./httpServices";
import apiUrls from "../config.json";

async function getAllFood() {
  const allFood = await http.get(apiUrls.foodEndpoint);
  return allFood;
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

export { getAllFood, postFood };
