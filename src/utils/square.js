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

  removePossibleValue(value) {
    if (this.value !== 0) return;
    const index = this.possible.indexOf(value);
    if (index !== -1) this.possible.splice(index, 1);
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

  getPossibleValue() {
    return this.possible;
  }

  getSizePossibleValue() {
    if (this.value !== 0) return 10;
    return this.possible.length;
  }
}

export default Square;