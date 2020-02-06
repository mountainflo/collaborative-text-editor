const privateProps = new WeakMap();

class Position {
  constructor(row, column) {
    privateProps.set(this, {row: row, column: column});
  }

  getRow() {
    return privateProps.get(this).row;
  };

  getColumn() {
    return privateProps.get(this).column;
  };
}

export {Position};
