const CHANGE_OBJECT_TYPE = Object.freeze({
  DELETION: 0,
  INSERTION: 1,
});

const privateProps = new WeakMap();

class ChangeObject {
  constructor(position, value, CHANGE_OBJECT_TYPE) {
    privateProps.set(this, {position: position, value: value, type: CHANGE_OBJECT_TYPE});
  }

  getRow() {
    return this.getPosition().getRow();
  };

  getColumn() {
    return this.getPosition().getColumn();
  };

  getPosition() {
    return privateProps.get(this).position;
  };

  getValue() {
    return privateProps.get(this).value;
  };

  getType() {
    return privateProps.get(this).type;
  }
}

export {ChangeObject, CHANGE_OBJECT_TYPE};
