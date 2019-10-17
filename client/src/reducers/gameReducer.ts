import { IAction, AppPage } from "../types";
import { Reducer } from "redux";

export interface IGameState {
  state: "game" | "lobby" | "result";
  result: {
    score: 0;
  };
  xy: [number, number];
}

const initalState: () => IGameState = () => ({
  state: "lobby",
  result: { score: 0 },
  xy: [0, 0]
});

const reducer: Reducer<IGameState, IAction> = function(state = initalState(), { type, payload }: IAction) {
  switch (type) {
    case "GAME_START":
      return { ...state, ...payload };
    case "GAME_ADD_SCORE":
      return { ...state, result: { ...state.result, score: payload.score } };
    case "GAME_POS":
      return { ...state, xy: payload };
    case "APP_PAGE":
      if (payload.page === "lobby") return initalState();
      else return state;
    case "GAME_OVER":
      return { ...state, state: "result" };
    default:
      return state;
  }
};

export default reducer;
