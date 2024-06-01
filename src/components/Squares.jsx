import "../css/squares.css";
import React from "react";

const SIZE = 9;

const Square = React.memo(({ index, value, isChangeable, setSelectedSquare }) => {
  const handleClick = () => {
    if (isChangeable) setSelectedSquare(index);
  };
  return (
    <button onClick={handleClick} className={`square ${isChangeable ? "changeable" : ""}`}>
      {value === 0 ? " " : value}
    </button>
  );
});

const PossibleValue = ({ value, onPossibleValueClick }) => {
  return (
    <button onClick={onPossibleValueClick} className="square possible">
      {value === 0 ? " " : value}
    </button>
  );
};

const PossibleValues = ({ selectedSquare, setSelectedSquare, sudoku }) => {
  const i = Math.floor(selectedSquare / SIZE);
  const j = selectedSquare % SIZE;
  const possibleValueClick = (value) => {
    if (value !== null && sudoku.setValue(i, j, value))
      setSelectedSquare(null);
  };
  const possibleValues = sudoku.getPossibleValues(i, j).map((value, index) => (
    <PossibleValue
      key={index}
      value={value}
      onPossibleValueClick={() => possibleValueClick(value)}
    />
  ));
  return <div className="possible-values">{possibleValues}</div>;
};

const Board = ({ squares, setSelectedSquare, sudoku }) => {
  const tiles = [];
  for (let i = 0; i < SIZE * SIZE; i++) {
    tiles[i] = (
      <Square
        key={i}
        index={i}
        value={squares[i]}
        isChangeable={sudoku.isChangeableSquare(i)}
        setSelectedSquare={setSelectedSquare}
      />
    );
  }
  return <div className="board">{tiles}</div>;
};

export { Board, PossibleValues };