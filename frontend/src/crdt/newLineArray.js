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

        this.removeNewLineReferenceByTimestamp = function (timestamp) {
            let row = this.getNewLineReferenceByTimestamp(timestamp);
            this.removeNewLineReference(row);
        };

        this.getNewLineReference = function (row) {
            return _newLineTimestampsReferences[row];
        };

        this.getNewLineReferenceByTimestamp = function (timestamp) {
            return _newLineTimestampsReferences.findIndex(elem => elem === timestamp);
        };

        this.length = function(){
            return _newLineTimestampsReferences.length;
        };

    }

}

export {NewLineArray};