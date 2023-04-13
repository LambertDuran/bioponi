import auth from "./auth";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const setHeader = () => {
  const token = auth.getToken();
  axios.defaults.headers.common["x-auth-token"] = token;
};
setHeader();

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError)
    toast.error("Problème de connexion avec le serveur distant.");

  return Promise.reject(error);
});

const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setHeader: setHeader,
};

export default http;
