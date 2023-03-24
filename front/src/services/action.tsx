import IAction from "../interfaces/action";
import http from "./httpServices";
import apiUrls from "../config.json";

async function getActions() {
  const allActions = await http.get(apiUrls.actionEndpoint);
  return allActions;
}

async function postAction(action: IAction) {
  let newAction: IAction | null = null;
  let error = "";
  return http
    .post(apiUrls.actionEndpoint, action)
    .then((res) => {
      return { action: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { action: newAction, error: error };
    });
}

async function putAction(action: IAction) {
  let newAction: IAction | null = null;
  let error = "";
  return http
    .put(apiUrls.actionEndpoint + `/${action.id}`, action)
    .then((res) => {
      return { action: res.data, error: error };
    })
    .catch((err) => {
      error = err.response.data;
      return { action: newAction, error: error };
    });
}

export { getActions, postAction, putAction };
