const LOG_OBJECT = '[NewLineArray] ';

class NewLineArray {
  constructor() {
    let _newLineTimestampsReferences = [];

    this.addNewLineReference = function(timestamp, row) {
      console.debug(LOG_OBJECT + 'addNewLineReference()', timestamp.toString(), row);

      if (row > _newLineTimestampsReferences.length) {
        throw new Error('row number is to high!');
      } else if (row === _newLineTimestampsReferences.length) {
        _newLineTimestampsReferences.push(timestamp);
      } else if (row === 0) {
        _newLineTimestampsReferences.unshift(timestamp);
      } else {
        const tail = _newLineTimestampsReferences.splice(row,
            _newLineTimestampsReferences.length - row);

        _newLineTimestampsReferences.push(timestamp);
        _newLineTimestampsReferences = _newLineTimestampsReferences.concat(tail);
      }

      console.debug(LOG_OBJECT + 'addNewLineReference(): array changed to: ',
          _newLineTimestampsReferences.toString());
    };

    this.removeNewLineReference = function(row) {
      _newLineTimestampsReferences.splice(row, 1);
    };

    this.removeNewLineReferenceByTimestamp = function(timestamp) {
      const row = this.getNewLineReferenceByTimestamp(timestamp);
      this.removeNewLineReference(row);
    };

    this.getNewLineReference = function(row) {
      return _newLineTimestampsReferences[row];
    };

    /**
     * @param {Timestamp} timestamp
     * @return {number} a node or "-1" if nothing found otherwise
     */
    this.getNewLineReferenceByTimestamp = function(timestamp) {
      return _newLineTimestampsReferences.findIndex((elem) => elem.equals(timestamp));
    };

    this.length = function() {
      return _newLineTimestampsReferences.length;
    };
  }
}

export {NewLineArray};
