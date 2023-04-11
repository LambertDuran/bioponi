import http from "./httpServices";
import apiUrls from "../config.json";

export async function login(email: string, password: string) {
  let user: any = null;
  let error = "";
  return http
    .post(apiUrls.authEndpoint, { email, password })
    .then((res) => {
      return { user: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { user: user, error: error };
    });
}
