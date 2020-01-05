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


}

export { Editor };