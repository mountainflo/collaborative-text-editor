class Position {
    constructor(row, column) {
        const _row = row;
        const _column = column;

        this.getRow = function () {
            return _row;
        };

        this.getColumn = function () {
            return _column;
        };
    }
}

export {Position};