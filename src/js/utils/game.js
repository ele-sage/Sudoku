const SIZE = 9;
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

export default class Sudoku {
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
    this.emptySquares = numToRemove;
    this.removedSquareSet = [];
    this.generateGrid(numToRemove);
    this.changeableSquares = new Array(81).fill(false);
    this.setChangeableSquares();
  }

  isChangeableSquare(i) {
    return this.changeableSquares[i];
  }

  setChangeableSquares() {
    this.removedSquareSet.forEach((index) => {
      this.changeableSquares[index] = true;
    });
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

  solve(create) {
    const randoms = generateRandomSet(5);
    let pos = [0, 0];

    for (let k = 0; k < SIZE * SIZE; k++) {
      if (k < 5 && create === true) {
        pos[0] = randoms[k] % SIZE;
        pos[1] = Math.floor(randoms[k] / SIZE);
      } else pos = this.lessPossibleValues();
      if (pos === false) return false;
      const squareValue = this.squares[pos[0]][pos[1]].setRandomValue();
      if (squareValue === false) return false;
      this.removePossibleValues(pos[0], pos[1], squareValue);
    }
    return true;
  }

  generateGrid(numToRemove) {
    this.resetGrid();
    while (!this.solve(true)) {
      // this.printGrid();
      this.resetGrid();
    }
    // this.printGrid();
    this.removedSquareSet = generateRandomSet(numToRemove);
    this.removeSquares();
  }

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
}

class Square {
  constructor() {
    this.possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.value = 0;
    this.cell = 0;
    this.pos = [0, 0];
  }

  reset(cell, pos) {
    this.possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.value = 0;
    this.cell = cell;
    this.pos = pos;
  }

  removeValue() {
    this.value = 0;
  }

  setRandomValue() {
    if (this.possible.length === 0) return false;
    const randomIndex = Math.floor(Math.random() * this.possible.length);
    this.value = this.possible.splice(randomIndex, 1)[0];
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  getCell() {
    return this.cell;
  }

  resetPossibleValue() {
    this.possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  getPossibleValue() {
    return this.possible;
  }

  getSizePossibleValue() {
    let size = this.possible.length;
    if (this.value !== 0) size = 10;
    return size;
  }

  removePossibleValue(value) {
    if (this.value !== 0) return;
    const index = this.possible.indexOf(value);
    if (index !== -1) this.possible.splice(index, 1);
  }
}
