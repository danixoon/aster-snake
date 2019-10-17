import { ThunkAction } from "redux-thunk";
import { IRootState } from "../reducers";
import { ISocketArgument, init } from "../ws";
import { IAction, AppPage } from "../types";
import { io } from "../ws";
import { setPage } from "./appActions";

export const addScore: () => ThunkAction<any, IRootState, ISocketArgument, IAction> = () => (dispatch, getState) => {
  io.emit("command", { action: "game.addScore" });
};

export const changeDir: (dir: "up" | "left" | "down" | "right") => ThunkAction<any, IRootState, ISocketArgument, IAction> = dir => (dispatch, getState) => {
  let d = 0;
  switch (dir) {
    case "right":
      d = 1;
      break;
    case "up":
      d = 2;
      break;
    case "left":
      d = 3;
      break;
  }
  io.emit("command", { action: "game.direction", payload: { dir: d } });
};

export const setPos: (pos: [number, number]) => ThunkAction<any, IRootState, ISocketArgument, IAction> = pos => (dispatch, getState) => {
  dispatch({ type: "GAME_POS", payload: pos });
};
