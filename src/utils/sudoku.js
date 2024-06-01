import Square from "./square";

const SIZE = 9;
const SEED_SQUARE = 3;
const CELL_COORD = new Map([
  [0, [0, 0]],
  [1, [0, 3]],
  [2, [0, 6]],
  [3, [3, 0]],
  [4, [3, 3]],
  [5, [3, 6]],
  [6, [6, 0]],
  [7, [6, 3]],
  [8, [6, 6]],
]);

function generateRandomSet(setSize) {
  let numbers = new Set();
  while (numbers.size < setSize) {
    let randomNumber = Math.floor(Math.random() * 81);
    while (numbers.has(randomNumber)) randomNumber = (randomNumber + 2) % 81;
    numbers.add(randomNumber);
  }
  return Array.from(numbers);
}

class Sudoku {
  constructor(numToRemove) {
    this.squares = Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => new Square())
    );
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const subgridIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        this.squares[i][j].reset(subgridIndex, [i, j]);
      }
    }
    this.squareUpdated = null;
    this.emptySquares = numToRemove;
    this.removedSquareSet = [];
    this.changeableSquares = new Array(81).fill(false);
    this.setChangeableSquares();
    this.generateGrid(numToRemove);
  }

  // Methods used by the Game component
  // ********************************************************************
  isChangeableSquare(i) {
    return this.changeableSquares[i];
  }

  getSquareValue(i, j) {
    return this.squares[i][j].getValue();
  }

  getPossibleValues(i, j) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let used = new Set();
    const cell = this.squares[i][j].getCell();
    const coord = CELL_COORD.get(cell);

    for (let k = 0; k < SIZE; k++) {
      used.add(this.squares[k][j].getValue());
      used.add(this.squares[i][k].getValue());
      used.add(
        this.squares[coord[0] + (k % 3)][
          coord[1] + Math.floor(k / 3)
        ].getValue()
      );
    }
    const notUsed = numbers.filter((num) => !used.has(num));
    notUsed.push(0);
    return notUsed;
  }

  getSquares(dimension) {
    if (dimension === 1) {
      const values = [];
      for (let i = 0; i < SIZE; i++)
        for (let j = 0; j < SIZE; j++)
          values.push(this.squares[i][j].getValue());
      return values;
    }
    return this.squares;
  }

  isGridCompleted() {
    return this.emptySquares === 0;
  }

  setValue(i, j, value) {
    const possibleValues = this.getPossibleValues(i, j);
    if (possibleValues.includes(value) === false && value !== 0) return false;
    else {
      if (value === 0 && this.squares[i][j].getValue() !== 0)
        this.emptySquares++;
      else if (value !== 0 && this.squares[i][j].getValue() === 0)
        this.emptySquares--;
      this.squares[i][j].setValue(value);
    }
    return true;
  }

  // Methods used to generate a playable Sudoku grid (a grid with at least one solution)
  // with a given number of squares to remove
  // ********************************************************************
  generateGrid(numToRemove) {
    this.squareUpdated = null;
    this.emptySquares = numToRemove;
    this.resetGrid();
    while (!this.solveGrid(true)) this.resetGrid();
    this.removedSquareSet = generateRandomSet(numToRemove);
    this.removeSquares();
    this.changeableSquares.fill(false)
    this.setChangeableSquares();
  }

  solveGrid(create) {
    if (create) this.setRandomSquares();

    for (let k = 0; k < SIZE * SIZE - SEED_SQUARE; k++) {
      const pos = this.lessPossibleValues();

      if (pos === false) return false;
      const squareValue = this.squares[pos[0]][pos[1]].setRandomValue();
      if (squareValue === false) return false;
      this.removePossibleValues(pos[0], pos[1], squareValue);
    }
    return true;
  }

  // Remove possible values from row, column and subgrid, when a value is set
  removePossibleValues(i, j, value) {
    const cell = this.squares[i][j].getCell();
    const coord = CELL_COORD.get(cell);

    for (let k = 0; k < SIZE; k++) {
      this.squares[k][j].removePossibleValue(value);
      this.squares[i][k].removePossibleValue(value);
      this.squares[coord[0] + (k % 3)][
        coord[1] + Math.floor(k / 3)
      ].removePossibleValue(value);
    }
  }

  // Find the square with the least possible values
  lessPossibleValues() {
    let pos = [0, 0];
    let lowest = 10;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const sizePossibleValues = this.squares[i][j].getSizePossibleValue();
        if (sizePossibleValues === 0) return false;
        if (sizePossibleValues < lowest) {
          lowest = sizePossibleValues;
          pos = [i, j];
        }
        if (sizePossibleValues == 1) break;
      }
    }
    return pos;
  }

  setRandomSquares() {
    const randoms = generateRandomSet(SEED_SQUARE);
    
    for (let k = 0; k < SEED_SQUARE; k++) {
      const i = randoms[k] % SIZE;
      const j = Math.floor(randoms[k] / SIZE);
      const squareValue = this.squares[i][j].setRandomValue();
      if (squareValue === false) return false;
      this.removePossibleValues(i, j, squareValue);
    }
  }

  resetGrid() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const subgridIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        this.squares[i][j].reset(subgridIndex, [i, j]);
      }
    }
  }

  removeSquares() {
    for (let k = 0; k < this.removedSquareSet.length; k++) {
      this.squares[Math.floor(this.removedSquareSet[k] / SIZE)][
        this.removedSquareSet[k] % SIZE
      ].removeValue();
    }
  }

  setChangeableSquares() {
    this.removedSquareSet.forEach((index) => {
      this.changeableSquares[index] = true;
    });
  }

  // Utils
  printGrid() {
    console.log();
    for (let i = 0; i < SIZE; i++) {
      let row = "";
      for (let j = 0; j < SIZE; j++) {
        row += this.squares[i][j].getValue() + " ";
        if ((j + 1) % 3 === 0 && j + 1 < SIZE) row += "| ";
      }
      console.log(row.trim());
      if ((i + 1) % 3 === 0 && i + 1 < SIZE)
        console.log("------+-------+------");
    }
    console.log();
  }
}

export default Sudoku;