import http from "./httpServices";
import apiUrls from "../config.json";

async function getAllFood() {
  const allFood = await http.get(apiUrls.foodEndpoint);
  console.log("allFood: ", allFood);
  return allFood;
}

export { getAllFood };
