import IPool from "../interfaces/pool";
import http from "./httpServices";
import apiUrls from "../config.json";

async function getAllPool() {
  const allPools = await http.get(apiUrls.poolEndpoint);
  return allPools;
}

async function getPool(id: number) {
  const pool = await http.get(apiUrls.poolEndpoint + `/${id}`);
  return pool;
}

async function postPool(pool: IPool) {
  return http
    .post(apiUrls.poolEndpoint, pool)
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
    .put(apiUrls.poolEndpoint + `/${pool.id}`, pool)
    .then((res) => {
      return { pool: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { pool: newPool, error: error };
    });
}

async function getFishFromPool(id: number) {
  const pool = await http.get(apiUrls.poolEndpoint + `/${id}`);
  if (!pool || !pool.data || pool.status !== 200) return null;

  let fishId: number | null = null;
  for (let action of pool.data.action) {
    if (action.fishId) {
      fishId = action.fishId;
      break;
    }
  }
  if (!fishId) return null;

  const fish = await http.get(apiUrls.fishEndpoint + `/${fishId}`);
  if (!fish || !fish.data || fish.status !== 200) return null;
  else return fish.data;
}

export { getAllPool, getPool, putPool, postPool, getFishFromPool };
