import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/mode/markdown/markdown.js';
import {CHANGE_OBJECT_TYPE, ChangeObject} from "./model/changeObject";
import {Position} from "./model/position";

const NIGHT_THEME = "3024-night";
const MARKDOWN_MODE = "markdown";
const LOG_OBJECT = "[editor] ";
const LINE_SEPARATOR = "\n";
const ORIGIN_REMOTE_DELETE = "remoteDelete";
const ORIGIN_REMOTE_INSERT = "remoteInsert";

/**
 * Class for accessing CodeMirror Editor
 */
class Editor {

    constructor(textAreaObj) {
        let _editor = CodeMirror.fromTextArea(textAreaObj, {
            lineNumbers: true,
            theme: NIGHT_THEME,
            mode: MARKDOWN_MODE,
            value: textAreaObj.value
        });

        /**
         * Subscribe for updates. Callback will be executed if
         * user inputs or deletes text.
         *
         * @param callback
         */
        this.subscribeForUpdates = function (callback) {
            _editor.on("change", (_, obj) => {
                console.log(LOG_OBJECT + "\"change\" event fired: ", obj);

                if (obj.origin !== ORIGIN_REMOTE_DELETE && obj.origin !== ORIGIN_REMOTE_INSERT) {
                    callCallbackForEachChar(callback, obj.removed, obj.from.line, obj.from.ch, CHANGE_OBJECT_TYPE.DELETION);
                    callCallbackForEachChar(callback, obj.text, obj.from.line, obj.from.ch, CHANGE_OBJECT_TYPE.INSERTION);
                }
            });
        };

        /**
         * @param {ChangeObject} changeObject
         */
        this.insert = function (changeObject) {
            let from = {line: changeObject.getRow(), ch: changeObject.getColumn()};
            _editor.doc.replaceRange(changeObject.getValue(), from, null, ORIGIN_REMOTE_INSERT);
        };

        /**
         * @param {ChangeObject} changeObject
         */
        this.delete = function (changeObject) {

            if(isNewLineSignBetweenTwoLines(_editor, changeObject))  {
                mergeTwoLines(_editor, changeObject.getRow(), changeObject.getRow() + 1);
            } else {
                let from = {line: changeObject.getRow(), ch: changeObject.getColumn()};
                let to = {line: changeObject.getRow(), ch: changeObject.getColumn() + 1};
                _editor.doc.replaceRange("", from, to, ORIGIN_REMOTE_DELETE);
            }
        };

        this.getValue = function () {
            return _editor.getValue(LINE_SEPARATOR);
        };

        /**
         * @param {_editor} editorObject
         * @param {ChangeObject} changeObject
         * @return {boolean}
         */
        let isNewLineSignBetweenTwoLines = function(editorObject, changeObject){
            let lineContent = _editor.doc.getLine(changeObject.getRow());

            return changeObject.getColumn() === lineContent.length
                && _editor.doc.lineCount() - 1 !== changeObject.getRow;
        };

        /**
         * @param {_editor} obj
         * @param {number} firstRowNumber
         * @param {number} secondRowNumber
         */
        let mergeTwoLines = function (obj, firstRowNumber, secondRowNumber) {

            let firstRow = _editor.doc.getLine(firstRowNumber);
            let secondRow = _editor.doc.getLine(secondRowNumber);

            let from = {line: firstRowNumber, ch: firstRow.length};
            let to = {line: secondRowNumber, ch: secondRow.length};

            _editor.doc.replaceRange(secondRow,from,to,ORIGIN_REMOTE_DELETE);
        };

        /**
         * @param {number} line
         * @param {number} column
         * @param {string} text
         * @param {CHANGE_OBJECT_TYPE} type
         * @return {ChangeObject}
         */
        let createChangeObject = function (line, column, text, type) {
            return new ChangeObject(new Position(line,column), text, type);
        };

        /**
         * @param {function({ChangeObject})} callback callback action to be executed for each char
         * @param {[string]} array
         * @param {number} line
         * @param {number} column
         * @param {CHANGE_OBJECT_TYPE} type
         */
        let callCallbackForEachChar = function (callback, array, line, column, type) {
            let iterator = new Iterator(array);
            let result = iterator.next();
            let _line = line;
            let _column = column;

            let getNextColumn = () => {
                if (type === CHANGE_OBJECT_TYPE.DELETION) {
                    return _column;
                } else {
                    return _column++;
                }
            };

            let setVarsForNextIteration = () => {
                if (type !== CHANGE_OBJECT_TYPE.DELETION) {
                    ++_line;
                    _column = 0;
                }
            };

            while (!result.done) {

                let charArray = (result.value.toString()).split("");

                charArray.forEach(
                    char => callback(createChangeObject(_line, getNextColumn(), char, type))
                );

                if (iterator.hasNext()){
                    callback(createChangeObject(_line, getNextColumn(), "\n", type))
                }

                result = iterator.next();
                setVarsForNextIteration();
            }
        }
    }


}

class Iterator {
    constructor(someArray) {
        let _nextIndex = 0;
        let _array = someArray;
        this.next = function () {
            if (_nextIndex < _array.length) {
                return {
                    value: _array[_nextIndex++],
                    done: false
                };
            } else {
                return {
                    done: true
                };
            }
        };
        this.hasNext = function () {
            return _nextIndex < _array.length;
        };
    }
}

export {Editor};