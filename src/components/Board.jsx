import "../css/squares.css";
import React from "react";

const SIZE = 9;

const Square = React.memo(({ value, isChangeable, onSquareClick }) => {
  return (
    <button
      onClick={onSquareClick}
      className={`square ${isChangeable ? "changeable" : ""}`}
    >
      {value === 0 ? " " : value}
    </button>
  );
});

const Board = ({ setSelectedSquare, sudoku }) => {
  const handleSquareClick = (index) => () => {
    const i = Math.floor(index / SIZE);
    const j = index % SIZE;
    setSelectedSquare({ i, j });
  };

  const squares = sudoku.getSquares(1).map((value, i) => (
    <Square
      key={i}
      value={value}
      isChangeable={sudoku.isChangeableSquare(i)}
      onSquareClick={handleSquareClick(i)}
    />
  ));
  return <div className="board">{squares}</div>;
};
Board.whyDidYouRender = true;
export default Board;