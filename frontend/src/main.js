import { CollabTexteditorClient } from "./collabTexteditorClient";
import './styles/styles.css';

let CollabTexteditor = new CollabTexteditorClient('http://localhost:8080');

function addButtonListener(){

    // TODO refactor code by using $() from jquery
    document.getElementById("sendTextUpdate").addEventListener("click", function(){
        console.log("[INFO] button clicked, execute sendTextUpdate()");

        let textFromTextArea = document.getElementById("editorTextArea").value;

        CollabTexteditor.sendTextUpdate(textFromTextArea);
    });
}

window.onload=function() {
    addButtonListener();
};