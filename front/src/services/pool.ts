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
  let newPool: IPool | null = null;
  let error = "";
  return http
    .post(apiUrls.poolEndpoint, pool)
    .then((res) => {
      return { pool: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { pool: newPool, error: error };
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

export { getAllPool, getPool, putPool, postPool };
