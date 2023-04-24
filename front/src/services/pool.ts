import IPool from "../interfaces/pool";
import http from "./httpServices";

const apiEndPoint = process.env.REACT_APP_API_ENDPOINT + "pool";
const fishEndpoint = process.env.REACT_APP_API_ENDPOINT + "fish";

async function getAllPool() {
  const allPools = await http.get(apiEndPoint);
  return allPools;
}

async function getPool(id: number) {
  const pool = await http.get(apiEndPoint + `/${id}`);
  return pool;
}

async function postPool(pool: IPool) {
  return http
    .post(apiEndPoint, pool)
    .then((res) => {
      return { pool: res.data, error: "" };
    })
    .catch((err) => {
      return { pool: null, error: err.response.data };
    });
}

async function putPool(pool: IPool) {
  let newPool: IPool | null = null;
  let error = "";
  return http
    .put(apiEndPoint + `/${pool.id}`, pool)
    .then((res) => {
      return { pool: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { pool: newPool, error: error };
    });
}

async function getFishFromPool(id: number) {
  const pool = await http.get(apiEndPoint + `/${id}`);
  if (!pool || !pool.data || pool.status !== 200) return null;

  let fishId: number | null = null;
  for (let action of pool.data.action) {
    if (action.fishId) {
      fishId = action.fishId;
      break;
    }
  }
  if (!fishId) return null;

  const fish = await http.get(fishEndpoint + `/${fishId}`);
  if (!fish || !fish.data || fish.status !== 200) return null;
  else return fish.data;
}

export { getAllPool, getPool, putPool, postPool, getFishFromPool };
