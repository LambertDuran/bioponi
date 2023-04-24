import http from "./httpServices";
import IUser from "../interfaces/user";

const apiEndPoint = process.env.REACT_APP_API_ENDPOINT + "user";

async function createUser(user: IUser) {
  return http
    .post(apiEndPoint, user)
    .then((res) => {
      return { user: res.data, error: "" };
    })
    .catch((err) => {
      return { user: null, error: err.response.data };
    });
}

export { createUser };
