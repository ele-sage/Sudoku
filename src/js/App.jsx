import { useState } from "react";
import Sudoku from "./utils/game";
import "../css/buttons.css";
import "../css/squares.css";
import NewGrid from "./components/NewGridModal";
import { Square, PossibleValues } from "./components/Squares";

const SIZE = 9;
let sudoku = new Sudoku(40);

function Board({ squares, onSquareClick, selectedSquare }) {
  const tiles = [];
  for (let i = 0; i < SIZE * SIZE; i++) {
    tiles[i] = (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => onSquareClick(i)}
        isChangeable={sudoku.isChangeableSquare(i)}
        isSelected={selectedSquare === i}
      />
    );
  }
  return <div className="board">{tiles}</div>;
}

export default function Game() {
  const [squares, setSquares] = useState(sudoku.getSquares(1));
  const [possibleValueButtons, setPossibleValueButtons] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [completed, setCompleted] = useState(null);

  function squareClick(index) {
    if (!sudoku.isChangeableSquare(index)) return;
    const i = Math.floor(index / SIZE);
    const j = index % SIZE;
    const possibleValues = sudoku.getPossibleValues(i, j);
    possibleValues.push(0);

    function possibleSquareClick(newValue) {
      if (newValue !== null) {
        const parsedValue = parseInt(newValue);
        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 9) {
          if (sudoku.setValue(i, j, parsedValue)) {
            const updatedSquares = [...squares];
            updatedSquares[index] = parsedValue;
            setSquares(updatedSquares);
            setPossibleValueButtons([]);
            setSelectedSquare(null);
            if (sudoku.isGridCompleted())
              setCompleted(<h1 className="completed">Sudoku Completed!</h1>);
            else if (completed !== null) setCompleted(null);
          }
        }
      }
    }

    setPossibleValueButtons(
      PossibleValues(possibleValues, possibleSquareClick)
    );
    setSelectedSquare(index);
  }

  function resetGrid() {
    sudoku.removeSquares();
    setSquares(sudoku.getSquares(1));
    setPossibleValueButtons([]);
    setSelectedSquare(null);
    setCompleted(null);
  }

  const createNewGrid = (numToRemove) => {
    sudoku = new Sudoku(numToRemove);
    setSquares(sudoku.getSquares(1));
    setPossibleValueButtons([]);
    setSelectedSquare(null);
    setCompleted(null);
  };

  return (
    <div className="game">
      <div className="board-buttons">
        <NewGrid onCreate={createNewGrid} />
        <button onClick={resetGrid} className="button-google">
          Reset Grid
        </button>
      </div>
      <Board
        squares={squares}
        onSquareClick={squareClick}
        selectedSquare={selectedSquare}
      />
      <div className="possible-values">{possibleValueButtons}</div>
      {completed}
    </div>
  );
}
