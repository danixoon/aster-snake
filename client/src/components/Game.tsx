import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IRootState } from "../reducers";
import { IGameState } from "../reducers/gameReducer";
import { setPage } from "../actions/appActions";
import { addScore, changeDir } from "../actions/gameActions";
import { ILobbyState } from "../reducers/lobbyReducer";
import { animated, useSpring } from "react-spring";

import * as _ from "lodash";

import "../styles/game.scss";

interface IGameProps {
  lobby: ILobbyState;
  game: IGameState;
  setPage: typeof setPage;
  addScore: typeof addScore;
  changeDir: typeof changeDir;
}

interface ICellProps {
  selected: boolean;
}

const Cell: React.FC<ICellProps> = props => {
  const [spring, setSelected] = useSpring(() => ({ backgroundColor: "crimson", config: { tension: 0, friction: 0, velocity: 10 } })) as any;
  useEffect(() => {
    props.selected ? setSelected({ backgroundColor: "white" }) : setSelected({ backgroundColor: "crimson" });
    // console.log("effet");
  }, [props.selected]);

  // console.log(props.selected);

  return <animated.div className="cell" style={spring} />;
};

const xyToIndex = ([x, y]: [number, number], width: number = 10): number => {
  return y * width + x;
};

const Game: React.FC<IGameProps> = props => {
  const { game, setPage, addScore, lobby, changeDir } = props;
  const [selectedId, select] = useState(() => xyToIndex(game.xy));

  useEffect(() => {
    select(xyToIndex(game.xy));
    // console.log(selectedId);
  }, [game.xy]);

  useEffect(() => {
    console.log("effect");
    const bind = (e: KeyboardEvent) => {
      let dir;
      switch (e.key) {
        case "ArrowLeft":
          dir = "left";
          break;
        case "ArrowRight":
          dir = "right";
          break;
        case "ArrowUp":
          dir = "up";
          break;
        case "ArrowDown":
          dir = "down";
          break;
      }
      changeDir(dir as any);
    };
    window.addEventListener("keydown", bind as any);
    return () => {
      window.removeEventListener("keydown", bind as any);
    };
  }, []);

  const handleReturnToLobby = () => {
    setPage("lobby");
  };

  const handleAddScore = () => {
    addScore();
  };

  // const handleDirection = (e) => {
  //   // changeDir("down");
  // };

  const render = () => {
    // console.log("renderrr");
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
          <div className="app">
            <div className="game">
              {_.range(100).map((v: number) => (
                <Cell selected={v === selectedId} key={v} />
                // <div key={v} className={`cell ${isSelected(v) ? "selected" : ""}`} />
              ))}
              {/* <div className="cell" />
              <div className="cell" />
              <div className="cell" />
              <div className="cell" />
              <div className="cell" /> */}
            </div>
            {/* <button onClick={handleAddScore}>хочу очков!</button>
            {/* <button onClick={handleDirection}>менять позицию!</button> */}
            {/* <br /> */}
            {/* очки: {game.result.score} */}
            {/* позиция: {game.xy.toString()}  */}
          </div>
        );
      default:
        return <div />;
    }
  };
  return render();
};

const mapDispatch = { setPage, addScore, changeDir };

const mapState = (s: IRootState) => ({
  game: s.game,
  lobby: s.lobby
});

export default connect(
  mapState,
  mapDispatch
)(Game);
