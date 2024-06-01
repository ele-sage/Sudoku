import "../css/squares.css";

const PossibleValue = ({ value, onPossibleValueClick }) => {
  return (
    <button onClick={onPossibleValueClick} className="square possible">
      {value === 0 ? " " : value}
    </button>
  );
};

const PossibleValues = ({ selectedSquare, setSelectedSquare, sudoku }) => {
  const possibleValueClick = (value) => {
    if (value !== null && sudoku.setValue(selectedSquare.i, selectedSquare.j, value))
      setSelectedSquare(null);
  };
  const possibleValues = sudoku.getPossibleValues(selectedSquare.i, selectedSquare.j).map((value, index) => (
    <PossibleValue
      key={index}
      value={value}
      onPossibleValueClick={() => possibleValueClick(value)}
    />
  ));
  return <div className="possible-values">{possibleValues}</div>;
};
PossibleValues.whyDidYouRender = true;
export default PossibleValues;