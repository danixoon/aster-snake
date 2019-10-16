import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import lobbyReducer, { ILobbyState } from "./lobbyReducer";
import appReducer, { IAppState } from "./appReducer";
import gameReducer, { IGameState } from "./gameReducer";

export interface IRootState {
  lobby: ILobbyState;
  app: IAppState;
  game: IGameState;
}

const rootReducer = (history: any) =>
  combineReducers<IRootState>({
    lobby: lobbyReducer,
    app: appReducer,
    game: gameReducer
  });

export default rootReducer;
