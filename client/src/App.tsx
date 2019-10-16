import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IRootState } from "./reducers";
import { setPage, connectWebsocket, disconnectWebsocket } from "./actions/appActions";
import Game from "./components/Game";

import "./styles/default.scss";
import "./styles/app.scss";
import { joinLobby, leaveLobby, toggleLobbyReady } from "./actions/lobbyActions";
import { ILobbyState } from "./reducers/lobbyReducer";
import { IAppState } from "./reducers/appReducer";

interface IAppProps {
  connectWebsocket: typeof connectWebsocket;
  disconnectWebsocket: typeof disconnectWebsocket;
  joinLobby: typeof joinLobby;
  leaveLobby: typeof leaveLobby;
  toggleLobbyReady: typeof toggleLobbyReady;

  app: IAppState;
  lobby: ILobbyState;
}

const App: React.FC<IAppProps> = props => {
  const { connectWebsocket, disconnectWebsocket, joinLobby, leaveLobby, toggleLobbyReady } = props;
  const { page, message: loadingMessage } = props.app;
  const { ready, lobbyId, playerId, players, maxPlayers } = props.lobby;

  const [username, setUsername] = useState<string>(() => "");

  const handleConnect = () => {
    connectWebsocket(username);
  };

  const handleDisconnect = () => {
    disconnectWebsocket();
  };

  const handleLobbyJoin = () => {
    joinLobby();
  };

  const handleLobbyLeave = () => {
    leaveLobby();
  };

  const handlePlayerReady = () => {
    toggleLobbyReady();
  };

  const render = () => {
    switch (page) {
      case "game":
        return (
          <div className="app">
            <Game />
          </div>
        );
      case "lobby":
        return (
          <div className="app">
            <p>ты в лобби {lobbyId}!</p>
            <ul>
              игроков {players.length} из {maxPlayers}:
              {players
                .sort((a, b) => (a.score > b.score ? -1 : 1))
                .map(p => (
                  <li key={p.id}>
                    {p.id === playerId ? `${p.id} (ты)` : p.id} - {p.score} очков
                  </li>
                ))}
            </ul>
            <button onClick={handleLobbyLeave}>ливнуть</button>
            <button disabled={ready === null} onClick={handlePlayerReady}>
              {ready === null ? "..." : ready ? "не готов.." : "я готов!"}
            </button>
            {/* <button onClick={handleLobbyJoin}>в лобби давай</button> */}
          </div>
        );
      case "connected":
        return (
          <div className="app">
            <p>{playerId}, ты подключился</p>
            <button onClick={handleLobbyJoin}>в лобби давай</button>
            <button onClick={handleDisconnect}>отключиться хочу</button>
          </div>
        );

      case "login":
        return (
          <div className="app">
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="имя введи а" />
            <button onClick={handleConnect}>коннекти</button>
          </div>
        );
      case "loading":
        return (
          <div className="app">
            <p>{loadingMessage}</p>
          </div>
        );
      default:
        return <div>404</div>;
    }
  };

  return render();
};

const mapState = (state: IRootState) => ({
  app: state.app,
  lobby: state.lobby
});
const mapActions = { connectWebsocket, disconnectWebsocket, joinLobby, leaveLobby, toggleLobbyReady };

export default connect(
  mapState,
  mapActions
)(App);
