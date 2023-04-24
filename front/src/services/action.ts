import IAction from "../interfaces/action";
import http from "./httpServices";

const apiEndPoint = process.env.REACT_APP_API_ENDPOINT + "action";

async function getAllActions() {
  const allActions = await http.get(apiEndPoint);
  return allActions;
}

async function postAction(action: IAction) {
  let newAction: IAction | null = null;
  let error = "";
  return http
    .post(apiEndPoint, action)
    .then((res) => {
      return {
        action: {
          ...res.data,
          date: new Date(res.data.date),
          createdAt: new Date(res.data.createdAt),
          updatedAt: new Date(res.data.updatedAt),
        },
        error: error,
      };
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
    .put(apiEndPoint + `/${action.id}`, action)
    .then((res) => {
      return {
        action: {
          ...res.data,
          date: new Date(res.data.date),
          createdAt: new Date(res.data.createdAt),
          updatedAt: new Date(res.data.updatedAt),
        },
        error: error,
      };
    })
    .catch((err) => {
      error = err.response.data;
      return { action: newAction, error: error };
    });
}

async function deleteAction(action: IAction) {
  let newAction: IAction | null = null;
  let error = "";
  return http
    .delete(apiEndPoint + `/${action.id}`)
    .then((res) => {
      return {
        action: {
          ...res.data,
          date: new Date(res.data.date),
          createdAt: new Date(res.data.createdAt),
          updatedAt: new Date(res.data.updatedAt),
        },
        error: error,
      };
    })
    .catch((err) => {
      error = err.response.data;
      return { action: newAction, error: error };
    });
}

export { getAllActions, postAction, putAction, deleteAction };
