import React, { useEffect, useState } from "react";
import { connect, ConnectedComponent } from "react-redux";
import { IRootState } from "../reducers";
import { IGameState } from "../reducers/gameReducer";
import { setPage } from "../actions/appActions";
import { addScore, changeDir } from "../actions/gameActions";
import { ILobbyState } from "../reducers/lobbyReducer";
// import * as reactSpring from "react-spring";

import * as _ from "lodash";

import "../styles/game.scss";

const { useSpring, animated } = require("react-spring");

interface IGameProps {
  lobby: ILobbyState;
  state: string;
  score: number;
  width: number;
  height: number;
  setPage: typeof setPage;
  addScore: typeof addScore;
  changeDir: typeof changeDir;
}

interface ICellProps {
  index: number;
  size: number;
  positions: number[];
}

// const CellLol: React.FC<ICellProps> = props => {
//   const [spring, setSelected] = useSpring(() => ({ backgroundColor: "crimson", config: { tension: 10, friction: 1, velocity: 100 } })) as any;
//   // const [spring, setSelected] = useSpring(() => ({ scale: 1, config: { tension: 10, friction: 1, velocity: 1000 } })) as any;
//   useEffect(() => {
//     props.selected ? setSelected({ backgroundColor: "white" }) : setSelected({ backgroundColor: "crimson" });
//     props.selected ? setSelected({ scale: 0.6 }) : setSelected({ scale: 1 });
//     // console.log("effet");
//   }, [props.selected]);

//   // console.log(props.selected);

//   return <animated.div className="cell" style={spring} />;
// };

const Cell: ConnectedComponent<React.FC<ICellProps>, any> = connect((s: IRootState) => {
  const tailPos = s.game.tail.map(v => v[1] as any);
  const pos = Array.from(s.game.positions.values()).map(xy => {
    return xy;
  });
  pos.push(...tailPos.flatMap(v => v));

  return {
    positions: pos
  };
})(
  React.memo(
    props => {
      const { size, index, positions } = props;
      console.log("render");
      // const [spring, setSelected] = useSpring(() => ({ scale: 1 })) as any;
      // useEffect(() => {
      // props.selected ? setSelected({ scale: 0 }) : setSelected({ scale: 1 });
      // }, [props.selected]);

      return (
        <div
          className="cell"
          //style={{ borderRadius: spring.scale.interpolate((v: any) => `${(1 - v) * 100}%`), transform: spring.scale.interpolate((v: number) => `scale(${v})`) }}
          style={{ backgroundColor: positions.includes(index) ? "white" : "crimson", width: `${size}px`, height: `${size}px` }}
        />
      );
    },
    (prev, prop) => {
      return prev.positions.includes(prop.index) === prop.positions.includes(prop.index);
    } // !prop.tail.includes(prop.index) && !(prev.tail.includes(prop.index) && !prop.tail.includes(prop.index))
  )
);

const xyToIndex = ([x, y]: [number, number], width: number): number => {
  return y * width + x;
};

// const indexToXy = (index: number, width: number = 10, height: number = 10): [number, number] => {
//   const c = [Math.floor(index / width), index % height];
//   // console.log(c);
//   return c as [number, number];
// };

const Game: React.FC<IGameProps> = props => {
  const { setPage, addScore, lobby, changeDir } = props;
  // const [selectedId, select] = useState(() => xyToIndex(game.xy));

  // useEffect(() => {
  //   select(xyToIndex(game.xy));
  //   // console.log(selectedId);
  // }, [game.xy]);

  useEffect(() => {
    // console.log("effect");
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
        default:
          return;
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
    console.log("renderrr");
    switch (props.state) {
      case "result":
        return (
          <div>
            твои очки {props.score} <br />
            <button onClick={handleReturnToLobby}>ну давай че в лобби</button>
          </div>
        );
      case "game":
        return (
          <div className="app">
            <div className="game">
              {_.range(props.width * props.height).map((v: number) => {
                return <Cell size={500 / Math.max(props.width, props.height)} index={v} key={v} />;
              })}
            </div>
          </div>
        );
      default:
        return <div />;
    }
  };
  return render();
};

const mapDispatch = { setPage, addScore, changeDir };

const mapState = (s: IRootState, what: any) => {
  return {
    width: s.game.width,
    height: s.game.height,
    state: s.game.state,
    score: s.game.result.score,
    lobby: s.lobby
  };
};

export default connect(
  mapState,
  mapDispatch
)(Game);
