import SocketIOClient from "socket.io-client";
import { IRootState } from "../reducers";
import { Store } from "redux";
import { IAction } from "../types";
import { EventEmitter } from "events";
import { ThunkDispatch } from "redux-thunk";
import { setPage } from "../actions/appActions";
import store from "../store";

export interface ISocketArgument {
  socket: SocketIOClient.Socket;
}

export let io: SocketIOClient.Socket;
export const init = (dispatch: ThunkDispatch<IRootState, any, IAction>, username: string) => {
  if (io) io.disconnect();

  const server = new EventEmitter();

  server.on("error", error => {
    console.error(error.error);
  });
  server.on("player.connected", payload => {
    dispatch({ type: "PLAYER_CONNECTED", payload: { ...payload, playerId: username } });
    dispatch(setPage("connected"));
  });

  server.on("player.disconnected", payload => {
    dispatch({ type: "PLAYER_DISCONNECTED", payload: { ...payload, playerId: username } });
    dispatch(setPage("login"));
  });

  server.on("lobby.joined", payload => {
    dispatch({ type: "LOBBY_JOINED", payload });
    const state = store.getState();
    if (payload.playerId === state.lobby.playerId) dispatch(setPage("lobby"));
  });

  server.on("lobby.leaved", payload => {
    dispatch({ type: "LOBBY_LEAVED", payload });
    const state = store.getState();
    if (payload.playerId === state.lobby.playerId) dispatch(setPage("connected"));
    // dispatch(setPage("lobby"));
  });

  server.on("lobby.state", payload => {
    dispatch({ type: "LOBBY_STATE", payload });
  });

  server.on("player.state", payload => {
    dispatch({ type: "PLAYER_STATE", payload });
  });

  server.on("player.ready", payload => {
    dispatch({ type: "PLAYER_READY", payload: { ready: payload.ready } });
  });

  server.on("game.start", payload => {
    dispatch({ type: "GAME_START", payload });
    dispatch(setPage("game"));
  });

  server.on("game.addScore", payload => {
    dispatch({ type: "GAME_ADD_SCORE", payload });
  });

  server.on("game.over", payload => {
    dispatch({ type: "GAME_OVER", payload });
  });

  io = SocketIOClient({ query: { username }, transports: ["websocket"], upgrade: false });
  io.on("command", ({ action, payload }: any) => server.emit(action, payload));
};
