import { IAction } from "../types";
import { Reducer } from "redux";

export interface IPlayer {
  id: string;
  score: number;
}

export interface ILobbyState {
  players: { id: string; score: number }[];
  lobbyId: string | null;
  playerId: string | null;
  ready: boolean | null;
  maxPlayers: number | null;
}

const initalState: () => ILobbyState = () => ({
  players: [],
  lobbyId: null,
  playerId: null,
  ready: false,
  maxPlayers: null
});

const createPlayer: (id: string) => IPlayer = id => {
  return { id, score: 0 };
};

const reducer: Reducer<ILobbyState, IAction> = function(state = initalState(), { type, payload }: IAction) {
  switch (type) {
    case "GAME_OVER":
      return { ...state, players: state.players.map(p => ({ ...p, score: payload.result.scores.find((v: any) => v[0] === p.id)[1] })) };
    case "PLAYER_DISCONNECTED":
      return initalState();
    case "PLAYER_CONNECTED":
      return { ...state, playerId: payload.playerId };
    case "PLAYER_READY_LOADING":
      return { ...state, ready: null };
    case "PLAYER_READY":
      return { ...state, ready: payload.ready };
    case "PLAYER_STATE":
      return { ...state, ...payload };
    case "LOBBY_STATE":
      return { ...state, ...payload };
    case "LOBBY_JOINED":
      return state.playerId === null || payload.playerId === state.playerId
        ? { ...state, players: payload.playerIds.map((id: string) => createPlayer(id)), lobbyId: payload.lobbyId }
        : { ...state, players: [...state.players, createPlayer(payload.playerId)] };
    case "LOBBY_LEAVED":
      return state.playerId === null || payload.playerId === state.playerId
        ? { ...state, lobbyId: null, players: [], ready: false }
        : { ...state, players: state.players.filter(p => p.id !== payload.playerId) };
    default:
      return state;
  }
};

export default reducer;
