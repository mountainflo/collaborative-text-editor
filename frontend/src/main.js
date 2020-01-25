import "core-js/stable";
import "regenerator-runtime/runtime";
import { CollabTexteditorClient } from "./collabTexteditorClient";
import { Editor } from "./editor";

import './styles/styles.css';
import {Controller} from "./controller";

const LOG_OBJECT = "[main] ";

window.onload=function() {
    let textAreaObj = document.getElementById("editorTextArea");
    initializeController(textAreaObj);
};

function initializeController(textAreaObj) {
    let collabTexteditorClient = new CollabTexteditorClient('http://localhost:8080');
    let codeMirrorEditor = new Editor(textAreaObj);

    let controller = new Controller(collabTexteditorClient, codeMirrorEditor);
    controller.startService();
}