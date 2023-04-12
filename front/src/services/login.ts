import http from "./httpServices";
import apiUrls from "../config.json";
import auth from "./auth";

export async function login(email: string, password: string) {
  let user: any = null;
  let error = "";
  return http
    .post(apiUrls.authEndpoint, { email, password })
    .then((res) => {
      auth.setToken(res.data);
      return null;
    })
    .catch((err) => {
      return err.response.data;
    });
}
