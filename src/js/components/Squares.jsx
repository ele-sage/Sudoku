function Square({ value, onSquareClick, isChangeable, isSelected }) {
  if (value === 0) value = " ";
  let cssClass = "square";
  if (isChangeable) cssClass += " changeable";
  if (isSelected) cssClass += " selected";
  return (
    <button onClick={onSquareClick} className={cssClass}>
      {value}
    </button>
  );
}

function PossibleValue({ value, onPossibleValueClick }) {
  if (value === 0) value = " ";
  return (
    <button className="square possible" onClick={onPossibleValueClick}>
      {value}
    </button>
  );
}

function PossibleValues(possibleValues, onPossibleValueClick) {
  return possibleValues.map((value, i) => (
    <PossibleValue
      key={i}
      value={value}
      onPossibleValueClick={() => onPossibleValueClick(value)}
    />
  ));
}

export { Square, PossibleValues };
