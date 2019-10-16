import { IAction, AppPage } from "../types";
import { Reducer } from "redux";

export interface IAppState {
  page: AppPage;
  message: string | null;
}

const initalState: IAppState = {
  page: "login",
  message: null
};

const reducer: Reducer<IAppState, IAction> = function(state = initalState, { type, payload }: IAction) {
  switch (type) {
    case "APP_PAGE":
      return { ...state, page: payload.page, message: payload.message };
    default:
      return state;
  }
};

export default reducer;
