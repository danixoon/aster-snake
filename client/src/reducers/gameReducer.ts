import { IAction, AppPage } from "../types";
import { Reducer } from "redux";
import * as _ from "lodash";

export interface IGameState {
  state: "game" | "lobby" | "result";
  result: {
    score: 0;
  };
  positions: number[];
  tail: [string, number[]];
  // tail: [string, number[]];
  width: number;
  height: number;
}

const initalState: () => IGameState = () => ({
  state: "lobby",
  result: { score: 0 },
  positions: [] as any,
  tail: [] as any,
  height: 5,
  width: 5
});

const xyToIndex = ([x, y]: [number, number], width: number): number => {
  return y * width + x;
};

const reducer: Reducer<IGameState, IAction> = function(state = initalState(), { type, payload }: IAction) {
  switch (type) {
    case "GAME_START":
      return { ...state, ...payload };
    case "GAME_ADD_SCORE":
      return { ...state, result: { ...state.result, score: payload.score } };
    case "GAME_POS":
      return {
        ...state,
        positions: payload.map(([id, xy]: any) => xy),
        // tail:
        tail: payload.map(([id, xy]: any) => {
          let tk = state.tail.find(s => s[0] === id);
          let t: any[] = tk === undefined ? null : (tk[1] as any);
          if (!t) {
            t = _.range(5).map(v => 0);
            // state.tail.push([id, t]);
          } else t = t.map((v, i) => (i === 0 ? xy : i === 1 ? t[0] : t[i - 1]));

          return [id, t];
        })

        // tail: state.tail.map((t, i) =>
        //   i === 0 ? state.positions : state.tail[i - 1]
        // ) /* tail: state.tail.map((t, i) => (i === 0 ? xyToIndex(state.xy, state.width) : state.tail[i - 1])) */
      };
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
