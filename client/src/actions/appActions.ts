import { ThunkAction } from "redux-thunk";
import { IRootState } from "../reducers";
import { ISocketArgument, init, io } from "../ws";
import { IAction, AppPage } from "../types";

export const setPage: (page: AppPage, message?: string) => ThunkAction<any, IRootState, ISocketArgument, IAction> = (page, message) => (dispatch, getState) => {
  dispatch({ type: "APP_PAGE", payload: { page, message } });
};

export const connectWebsocket: (username: string) => ThunkAction<any, IRootState, ISocketArgument, IAction> = (username: string) => (dispatch, getState) => {
  init(dispatch, username);
  dispatch({ type: "PLAYER_CONNECT" });
  dispatch(setPage("loading", "подключаюсь к серверу.."));
};

export const disconnectWebsocket: () => ThunkAction<any, IRootState, ISocketArgument, IAction> = () => (dispatch, getState) => {
  io.disconnect();
  dispatch({ type: "PLAYER_DISCONNECTED" });
  dispatch(setPage("login"));
};
