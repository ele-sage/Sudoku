import React, { useState, useEffect } from "react";
import Sudoku from "../utils/sudoku";
import NewGame from "./NewGameModal";
import { Board, PossibleValues } from "./Squares";
import "../css/buttons.css";

const SQUARE_TO_REMOVE = 40;

const Game = () => {
  const [sudoku, setSudoku] = useState(new Sudoku(SQUARE_TO_REMOVE)); // Sudoku object for game logic
  const [squares, setSquares] = useState(sudoku.getSquares(1)); // 1D Array of representing all 81 squares value in Sudoku grid (a value of 0 means the square is empty)
  const [selectedSquare, setSelectedSquare] = useState(null); // Index of the selected square to display possible values

  useEffect(() => {
    setSquares(sudoku.getSquares(1));
    setSelectedSquare(null);
  }, [sudoku]);

  useEffect(() => {
    if (selectedSquare === null)
      setSquares(sudoku.getSquares(1));
    if (sudoku.isGridCompleted())
      alert("Congratulations! You have completed the Sudoku grid.");
  }, [selectedSquare]);

  const resetGrid = () => {
    sudoku.removeSquares();
    setSquares(sudoku.getSquares(1));
    setSelectedSquare(null);
  }

  return (
    <div className="game">
      <div className="board-buttons">
        <NewGame setSudoku={setSudoku} />
        <button className="button-google" onClick={resetGrid}>Reset</button>
      </div>
      <Board squares={squares} setSelectedSquare={setSelectedSquare} sudoku={sudoku} />
      {selectedSquare && (
        <PossibleValues selectedSquare={selectedSquare} setSelectedSquare={setSelectedSquare} sudoku={sudoku} />
      )}
    </div>
  );
};

export default Game;