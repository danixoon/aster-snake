import React from "react";
import { connect } from "react-redux";
import { IRootState } from "../reducers";
import { IGameState } from "../reducers/gameReducer";
import { setPage } from "../actions/appActions";
import { addScore } from "../actions/gameActions";
import { ILobbyState } from "../reducers/lobbyReducer";

interface IGameProps {
  lobby: ILobbyState;
  game: IGameState;
  setPage: typeof setPage;
  addScore: typeof addScore;
}

const Game: React.FC<IGameProps> = props => {
  const { game, setPage, addScore, lobby } = props;

  const handleReturnToLobby = () => {
    setPage("lobby");
  };

  const handleAddScore = () => {
    addScore();
  };

  const render = () => {
    switch (game.state) {
      case "result":
        return (
          <div>
            твои очки {game.result.score} <br />
            <button onClick={handleReturnToLobby}>ну давай че в лобби</button>
          </div>
        );
      case "game":
        return (
          <div>
            <button onClick={handleAddScore}>хочу очков!</button>
            <br />
            очки: {game.result.score}
          </div>
        );
      default:
        return <div />;
    }
  };
  return render();
};

const mapDispatch = { setPage, addScore };

const mapState = (s: IRootState) => ({
  game: s.game,
  lobby: s.lobby
});

export default connect(
  mapState,
  mapDispatch
)(Game);
