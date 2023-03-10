import IFood from "../interfaces/food";
import http from "./httpServices";
import apiUrls from "../config.json";

async function getAllFood() {
  const allFood = await http.get(apiUrls.foodEndpoint);
  return allFood;
}

async function postFood(food: IFood) {
  const newFood = await http.post(apiUrls.foodEndpoint, food);
  return newFood;
}

export { getAllFood, postFood };
