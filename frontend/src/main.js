import { CollabTexteditorClient } from "./collabTexteditorClient";
import './styles/styles.css';

import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/mode/markdown/markdown.js';

let CollabTexteditor = new CollabTexteditorClient('http://localhost:8080');

function addButtonListener(codeMirrorEditor){

    // TODO refactor code by using $() from jquery
    document.getElementById("sendTextUpdate").addEventListener("click", function(){
        console.log("[INFO] button clicked, execute sendTextUpdate()");

        let textFromEditor = codeMirrorEditor.getValue("<br />"); //TODO replace line separator with "\n" when inserting into textarea

        CollabTexteditor.sendTextUpdate(textFromEditor);
    });
}

window.onload=function() {
    CollabTexteditor.subscribeForUpdates('textFromServer');

    let textArea = document.getElementById("editorTextArea");

    let codeMirrorEditor = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true,
        theme: "3024-night",
        mode: "markdown",
        value: textArea.value
    });

    addButtonListener(codeMirrorEditor);

};