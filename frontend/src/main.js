import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {CollabTexteditorClient} from './collabTexteditorClient';
import {Editor} from './editor';

import './styles/styles.css';
import {Controller} from './controller';

const LOG_OBJECT = '[main] ';

window.onload=function() {
  addButtonListener();
};

function addButtonListener() {
  const textAreaObj = document.getElementById('editorTextArea');

  document.getElementById('joinSession').addEventListener('click', function() {
    // TODO check that the input fields are not empty
    const nickName = document.getElementById('nickName').value;
    const sessionId = document.getElementById('sessionId').value;
    document.getElementById('sessionSelection').style.display = 'none';
    document.getElementById('collabEditor').style.display = 'block';

    initializeController(textAreaObj, nickName, sessionId);
  });

  document.getElementById('createSession').addEventListener('click', function() {
    const nickName = document.getElementById('nickName').value;
    document.getElementById('sessionSelection').style.display = 'none';
    document.getElementById('collabEditor').style.display = 'block';

    initializeController(textAreaObj, nickName);
  });
}


async function initializeController(textAreaObj, nickName, sessionId=undefined) {
  const collabTexteditorClient = new CollabTexteditorClient('http://localhost:8080');
  const codeMirrorEditor = new Editor(textAreaObj);

  if (sessionId === undefined) {
    await collabTexteditorClient.createSessionId().then(
        (s) => {
          console.log(LOG_OBJECT + 'created new session', s);
          sessionId=s;
        });
  }

  displaySessionForTheUser(sessionId);

  collabTexteditorClient.joinSession(sessionId, nickName).then((r) => {
    console.log(LOG_OBJECT + 'successfully requested replica id', r);
    const controller = new Controller(collabTexteditorClient, codeMirrorEditor);
    controller.startService();
  });
}

function displaySessionForTheUser(sessionId) {
  document.getElementById('sessionInfo').innerText = sessionId;
}
