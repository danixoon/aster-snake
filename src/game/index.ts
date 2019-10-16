import { Lobby, Player } from "astra-engine";
import { EventEmitter } from "events";

interface IPlayerState {
  ready: boolean;
  score: number;
}

interface ILobbyState {
  maxPlayers: number;
  state: ILobbyStateType;
}

type ILobbyStateType = "game" | "lobby";

export class GameLobby extends Lobby<ILobbyState, IPlayerState> {
  private emitter = new EventEmitter();
  maxPlayers = 2;
  createLobbyState = () => ({
    maxPlayers: this.maxPlayers,
    state: "lobby" as ILobbyStateType
  });
  createPlayerState = () => ({
    ready: false,
    score: 0
  });

  onJoined(player: Player) {
    const lState = this.getLobbyState();
    const pState = this.getPlayerState(player);

    this.command(player, "lobby.state", lState.modify(s => s).apply());
    this.command(player, "player.state", pState.modify(s => s).apply());
  }

  get allReady() {
    return this.players.find(p => !this.getPlayerState(p).data.ready) === undefined;
  }

  onInit() {
    const gameOver = () => {
      const scores = this.players.map(p => [p.id, this.getPlayerState(p).data.score]);
      const lState = this.getLobbyState()
        .modify(s => ({ state: "lobby" }))
        .apply();

      this.players.forEach(p => {
        this.command(p, "game.over", { ...lState, result: { scores } });
      });
    };

    const gameStart = () => {
      this.emitter.off("player.ready", onReady);
      this.emitter.on("game.addScore", onAddScore);
      const lState = this.getLobbyState()
        .modify(s => ({ state: "game" }))
        .apply();

      this.mapPlayerState((p, s) => {
        this.broadcast(this, "game.start", lState);
        this.command(p, "player.state", s.modify(s => ({ ready: false })).apply());
      });

      setTimeout(() => {
        gameOver();
        lobbyInit();
      }, 3000);
    };

    const onAddScore = (player: Player) => {
      const state = this.getPlayerState(player);
      this.command(player, "game.addScore", state.modify(s => ({ score: ++s.score })).apply());
    };

    const onReady = (player: Player) => {
      const state = this.getPlayerState(player);

      this.command(player, "player.ready", state.modify(s => ({ ready: !s.ready })).apply());

      if (!this.isFull || !this.allReady) return;
      gameStart();
    };

    const lobbyInit = () => {
      this.emitter.removeAllListeners();
      this.emitter.on("player.ready", onReady);
    };

    lobbyInit();
  }

  onCommand(player: Player, action: string, payload: any) {
    this.emitter.emit(action, player, payload);
  }
}
