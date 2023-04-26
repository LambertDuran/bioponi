import IFood from "../interfaces/food";
import http from "./httpServices";

const apiEndPoint = process.env.REACT_APP_API_ENDPOINT + "food";

async function getAllFood() {
  let food: IFood | null = null;
  let error = "";
  return http
    .get(apiEndPoint)
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
    .get(apiEndPoint + `/${id}`)
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
    .post(apiEndPoint, food)
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
    .put(apiEndPoint + `/${food.id}`, food)
    .then((res) => {
      return { food: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: newFood, error: error };
    });
}

async function deleteFood(id: number) {
  let food: IFood | null = null;
  let error = "";
  return http
    .delete(apiEndPoint + `/${id}`)
    .then((res) => {
      return { food: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { food: food, error: error };
    });
}

export { getAllFood, getFood, postFood, putFood, deleteFood };
