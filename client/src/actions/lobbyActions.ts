import { ThunkAction } from "redux-thunk";
import { IRootState } from "../reducers";
import { ISocketArgument, init } from "../ws";
import { IAction, AppPage } from "../types";
import { io } from "../ws";
import { setPage } from "./appActions";

export const joinLobby: () => ThunkAction<any, IRootState, ISocketArgument, IAction> = () => (dispatch, getState) => {
  dispatch({ type: "LOBBY_JOIN" });
  dispatch(setPage("loading", "подключаюсь к лобби.."));
  io.emit("command", { action: "lobby.join" });
};

export const leaveLobby: () => ThunkAction<any, IRootState, ISocketArgument, IAction> = () => (dispatch, getState) => {
  dispatch({ type: "LOBBY_LEAVE" });
  dispatch(setPage("loading", "ливаю из лобби.."));
  io.emit("command", { action: "lobby.leave" });
};

export const toggleLobbyReady: () => ThunkAction<any, IRootState, ISocketArgument, IAction> = () => (dispatch, getState) => {
  dispatch({ type: "PLAYER_READY_LOADING" });
  io.emit("command", { action: "player.ready" });
};
