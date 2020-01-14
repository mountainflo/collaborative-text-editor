import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/mode/markdown/markdown.js';

const NIGHT_THEME = "3024-night";
const MARKDOWN_MODE = "markdown";
const LOG_OBJECT = "[editor] ";

/**
 * Class for accessing CodeMirror Editor
 */
class Editor {

    constructor(textAreaObj, cteService) {
        this.editor = CodeMirror.fromTextArea(textAreaObj, {
            lineNumbers: true,
            theme: NIGHT_THEME,
            mode: MARKDOWN_MODE,
            value: textAreaObj.value
        });

        console.log(LOG_OBJECT + "create codemirror object from text area", this.editor);

        this.cteService = cteService;

        this.listenToChanges()
    }

    listenToChanges(){
        this.editor.on("change", (_, changeObject) => {
            console.log(LOG_OBJECT + "\"change\" event fired: ", changeObject);

            if (changeObject.origin === "+input") {
                //changeObject.from;
                //changeObject.to;

                this.processChanges();
            }
        });
    }

    getValue(){
        return this.editor.getValue("<br />"); //TODO replace line separator with "\n" when inserting into textarea
    }

    processChanges(){
        this.cteService.sendTextUpdate(this.getValue());
    }

    /**
     * Transforms a 2-dimensional-position (line,column) into
     * a position of linear array/sequence.
     *
     * @param text a string, which lines are separated by the newline character
     * @param line the number of the line where the character is located
     * @param column the number of the column where the character is located
     * @returns {*|number} index of the char in a linear sequence
     */
    static transformMatrixPositionToSequencePosition(text, line, column){
        let matrix = text.split('\n');
        let separatorCharSize = 1;

        let previousChars = 0;
        for (let i = 0; i < line; i++) {
            previousChars = previousChars + matrix[i].length + separatorCharSize;
        }
        previousChars = previousChars + column;

        return previousChars;
    }


}

export { Editor };