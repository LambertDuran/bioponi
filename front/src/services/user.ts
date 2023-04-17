import http from "./httpServices";
import apiUrls from "../config.json";
import IUser from "../interfaces/user";

async function createUser(user: IUser) {
  return http
    .post(apiUrls.userEndpoint, user)
    .then((res) => {
      return { user: res.data, error: "" };
    })
    .catch((err) => {
      return { user: null, error: err.response.data };
    });
}

export { createUser };
