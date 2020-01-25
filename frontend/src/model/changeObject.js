const CHANGE_OBJECT_TYPE = Object.freeze({
    DELETION: 0,
    INSERTION: 1
});

class ChangeObject {
    constructor(row, column, value, CHANGE_OBJECT_TYPE) {
        const _row = row;
        const _column = column;
        const _value = value;
        const _type = CHANGE_OBJECT_TYPE;

        this.getRow = function () {
            return _row;
        };

        this.getColumn = function () {
            return _column;
        };

        this.getValue = function () {
            return _value;
        };

        this.getType = function () {
            return _type;
        }
    }
}

export {ChangeObject,CHANGE_OBJECT_TYPE};