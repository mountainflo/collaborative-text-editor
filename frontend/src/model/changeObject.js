const CHANGE_OBJECT_TYPE = Object.freeze({
    DELETION: 0,
    INSERTION: 1
});

class ChangeObject {
    constructor(position, value, CHANGE_OBJECT_TYPE) {
        const _position = position;
        const _value = value; //TODO editor only deletes chars. Adjust value to chars
        const _type = CHANGE_OBJECT_TYPE;

        this.getRow = function () {
            return this.getPosition().getRow();
        };

        this.getColumn = function () {
            return this.getPosition().getColumn();
        };

        this.getPosition = function () {
            return _position;
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