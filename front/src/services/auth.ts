import jwtDecode from "jwt-decode";

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getUser() {
  try {
    const jwt = localStorage.getItem("token");
    if (!jwt) return null;
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default {
  setToken,
  getToken,
  removeToken,
  getUser,
};
