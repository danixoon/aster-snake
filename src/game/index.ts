import { Lobby, Player } from "astra-engine";
import { EventEmitter } from "events";

interface IPlayerState {
  ready: boolean;
  score: number;
  dir: 0 | 1 | 2 | 3;
  xy: [number, number];
}

interface ILobbyState {
  maxPlayers: number;
  state: ILobbyStateType;
}

type ILobbyStateType = "game" | "lobby";

export class GameLobby extends Lobby<ILobbyState, IPlayerState> {
  private emitter = new EventEmitter();
  maxPlayers = 1;
  createLobbyState = () =>
    ({
      maxPlayers: this.maxPlayers,
      state: "lobby"
    } as ILobbyState);
  createPlayerState = () =>
    ({
      ready: false,
      xy: [0, 0],
      score: 0,
      dir: 0
    } as IPlayerState);

  getScores = () => {
    const scores = this.players.map(p => [p.id, this.getPlayerState(p).data.score]);
    return scores;
  };

  onJoined(player: Player) {
    const lState = this.getLobbyState();
    const pState = this.getPlayerState(player);

    const scores = this.getScores();

    this.command(player, "lobby.state", { ...lState.modify(s => s).apply(), result: { scores } });
    this.command(player, "player.state", pState.modify(s => s).apply());
  }

  get allReady() {
    return this.players.find(p => !this.getPlayerState(p).data.ready) === undefined;
  }

  onInit() {
    const gameOver = () => {
      clearInterval(tickTimer);

      const lState = this.getLobbyState()
        .modify(s => ({ state: "lobby" }))
        .apply();

      const scores = this.getScores();

      this.players.forEach(p => {
        this.command(p, "game.over", { ...lState, result: { scores } });
      });
    };

    let tickTimer: NodeJS.Timeout;

    const addDir = ([x, y]: [number, number], dir: 0 | 1 | 2 | 3, add: number = 1): [number, number] => {
      switch (dir) {
        case 0:
          return [x, y + add];
        case 1:
          return [x + add, y];
        case 2:
          return [x, y - add];
        case 3:
          return [x - add, y];
      }
    };

    const repeatXY = ([x, y]: [number, number], width: number = 10, height: number = 10): [number, number] => {
      if(x < 0) x = width - 1;
      if(y < 0) y = height - 1;
      return [x % width, y % height];
    };

    const onTick = () => {
      this.mapPlayerState((p, s) => {
        const c = s.modify(s => ({ xy: repeatXY(addDir(s.xy, s.dir)) })).apply();
        this.command(p, "game.pos", c);
      });
    };

    const gameStart = () => {
      this.emitter.off("player.ready", onReady);
      this.emitter.on("game.addScore", onAddScore);
      this.emitter.on("game.direction", onChangeDirection);
      const lState = this.getLobbyState()
        .modify(s => ({ state: "game" }))
        .apply();

      this.mapPlayerState((p, s) => {
        this.broadcast(this, "game.start", lState);
        this.command(p, "player.state", s.modify(s => ({ ready: false })).apply());
      });

      tickTimer = setInterval(onTick, 100);

      // setTimeout(() => {
      //   gameOver();
      //   lobbyInit();
      // }, 5000);
    };

    const onChangeDirection = (player: Player, { dir }: { dir: 0 | 1 | 2 | 3 }) => {
      if (![0, 1, 2, 3].includes(dir)) throw "invalid direction";

      const s = this.getPlayerState(player);
      const c = s.modify(s => ({ dir })).apply();
      this.command(player, "game.direction", c);
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
