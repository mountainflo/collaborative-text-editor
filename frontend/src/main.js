import "core-js/stable";
import "regenerator-runtime/runtime";
import { CollabTexteditorClient } from "./collabTexteditorClient";
import { Editor } from "./editor";

import './styles/styles.css';

const LOG_OBJECT = "[main] ";

let CollabTexteditor = new CollabTexteditorClient('http://localhost:8080');

function addButtonListener(codeMirrorEditor){

    // TODO refactor code by using $() from jquery
    document.getElementById("sendTextUpdate").addEventListener("click", function(){
        console.log(LOG_OBJECT + "button clicked, execute sendTextUpdate()");

        let textFromEditor = codeMirrorEditor.getValue();

        CollabTexteditor.sendTextUpdate(textFromEditor);
    });
}

window.onload=function() {
    CollabTexteditor.subscribeForUpdates('textFromServer');

    let textAreaObj = document.getElementById("editorTextArea");

    let codeMirrorEditor = new Editor(textAreaObj, CollabTexteditor);

    addButtonListener(codeMirrorEditor);

};