import { ThunkAction } from "redux-thunk";
import { IRootState } from "../reducers";
import { ISocketArgument, init } from "../ws";
import { IAction, AppPage } from "../types";
import { io } from "../ws";
import { setPage } from "./appActions";

export const addScore: () => ThunkAction<any, IRootState, ISocketArgument, IAction> = () => (dispatch, getState) => {
  io.emit("command", { action: "game.addScore" });
};
