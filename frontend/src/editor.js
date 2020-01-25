import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/mode/markdown/markdown.js';
import {CHANGE_OBJECT_TYPE, ChangeObject} from "./model/changeObject";

const NIGHT_THEME = "3024-night";
const MARKDOWN_MODE = "markdown";
const LOG_OBJECT = "[editor] ";

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

                if (obj.origin === "+input" || obj.origin === "+delete") {
                    let changeObject = new ChangeObject(
                        obj.from.line,
                        obj.from.ch,
                        obj.text,
                        obj.origin === "+input" ? CHANGE_OBJECT_TYPE.INSERTION : CHANGE_OBJECT_TYPE.DELETION);

                    callback(changeObject); //TODO call async
                }
            });
        };

        /**
         * @param {ChangeObject} changeObject
         */
        this.insert = function (changeObject) {
            let from = {line: changeObject.getRow(), ch: changeObject.getColumn()};
            _editor.doc.replaceRange(changeObject.getValue(), from, null, "remoteInsert");
        };

        /**
         * @param {ChangeObject} changeObject
         */
        this.delete = function (changeObject) {
            let from = {line: changeObject.getRow(), ch: changeObject.getColumn()};
            let to = {line: changeObject.getRow(), ch: changeObject.getColumn() + 1};
            _editor.doc.replaceRange(changeObject.getValue(), from, to, "remoteDelete");
        };

        this.getValue = function () {
            return _editor.getValue("<br />"); //TODO replace line separator with "\n" when inserting into textarea
        };
    }


}

export {Editor};