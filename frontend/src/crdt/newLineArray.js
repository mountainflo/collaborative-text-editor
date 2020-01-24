class NewLineArray {

    constructor() {
        let _newLineTimestampsReferences = [];

        this.addNewLineReference = function(timestamp, row){

            if (row > _newLineTimestampsReferences.length) {
                throw new Error("row number is to high!");
            } else if (row === _newLineTimestampsReferences.length) {
                _newLineTimestampsReferences.push(timestamp);
            } else if (row === 0) {
                _newLineTimestampsReferences.unshift(timestamp);
            } else {
                let tail = _newLineTimestampsReferences.splice(row, _newLineTimestampsReferences.length - row);

                _newLineTimestampsReferences.push(timestamp);
                _newLineTimestampsReferences = _newLineTimestampsReferences.concat(tail);
            }
        };

        this.removeNewLineReference = function (row) {
            _newLineTimestampsReferences.splice(row,1);
        };

        this.removeNewLineByTimestamp = function (timestamp) {
            let i = _newLineTimestampsReferences.findIndex(elem => elem === timestamp);
            _newLineTimestampsReferences.removeNewLineReference(i);
        };

        this.getNewLineReference = function (row) {
            return _newLineTimestampsReferences[row];
        };



    }

}

export {NewLineArray};