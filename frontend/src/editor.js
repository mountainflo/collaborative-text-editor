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

                //TODO inserting newline is obj.text=["", ""]
                //TODO deleting newline is different to

                if (obj.origin === "+input" || obj.origin === "+delete") {

                    let text;
                    if ((obj.text).length === 2) {
                        text = "\n"; //inserting newline is obj.text=["", ""]
                    } else {
                        text = (obj.text).toString();
                    }

                    let changeObject = new ChangeObject(
                        new Position(obj.from.line,obj.from.ch),
                        text,
                        obj.origin === "+input" ? CHANGE_OBJECT_TYPE.INSERTION : CHANGE_OBJECT_TYPE.DELETION);

                    //TODO if string contains several chars. Create several changeObjects
                    callback(changeObject); //async call (remote updates can be delayed)
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
        }
    }


}

export {Editor};