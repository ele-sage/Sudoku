import React, { useState, useEffect } from "react";
import Sudoku from "../utils/sudoku";
import NewGame from "./NewGameModal";
import Board from "./Board";
import PossibleValues from "./PossibleValues";
import "../css/buttons.css";

const SQUARE_TO_REMOVE = 40;

const Game = () => {
  const [sudoku, setSudoku] = useState(new Sudoku(SQUARE_TO_REMOVE)); // Sudoku object for game logic
  const [selectedSquare, setSelectedSquare] = useState(null);

  useEffect(() => {
    setSelectedSquare(null);
  }, [sudoku]);

  return (
    <div className="game">
      <div className="board-buttons">
        <NewGame setSudoku={setSudoku} />
      </div>
      <Board setSelectedSquare={setSelectedSquare} sudoku={sudoku} />
      {selectedSquare && <PossibleValues selectedSquare={selectedSquare} setSelectedSquare={setSelectedSquare} sudoku={sudoku} />}
    </div>
  );
};

Game.whyDidYouRender = true;

export default Game;