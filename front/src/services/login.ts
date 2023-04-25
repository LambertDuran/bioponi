import http from "./httpServices";
import auth from "./auth";

const apiEndPoint = process.env.REACT_APP_API_ENDPOINT + "auth";

export async function login(email: string, password: string) {
  return http
    .post(apiEndPoint, { email, password })
    .then((res) => {
      auth.setToken(res.data);
      http.setHeader();
      return null;
    })
    .catch((err) => {
      return err.response.data;
    });
}
