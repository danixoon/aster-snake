import { Action } from "redux";

export type AppPage = "game" | "connected" | "login" | "lobby" | "loading";

export interface IAction extends Action<ActionType> {
  payload?: any;
}

export type ActionType =
  | "SOCKET_ERROR"
  | "LOBBY_JOIN"
  | "LOBBY_JOINED"
  | "LOBBY_LEAVE"
  | "LOBBY_LEAVED"
  | "LOBBY_STATE"
  | "PLAYER_STATE"
  | "PLAYER_CONNECT"
  | "PLAYER_CONNECTED"
  | "PLAYER_DISCONNECT"
  | "PLAYER_DISCONNECTED"
  | "PLAYER_READY_LOADING"
  | "PLAYER_READY"
  | "GAME_START"
  | "GAME_OVER"
  | "GAME_ADD_SCORE"
  | "APP_PAGE";
