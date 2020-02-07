import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {CollabTexteditorClient} from './collabTexteditorClient';
import {Editor} from './editor';
import {addButtonListener, displaySessionInfosForTheUser} from './ui';

import './styles/styles.css';
import {Controller} from './controller';

const LOG_OBJECT = '[main] ';

window.onload=function() {
  addButtonListener(initializeController);
};

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

  displaySessionInfosForTheUser(sessionId, nickName);

  collabTexteditorClient.joinSession(sessionId, nickName).then((r) => {
    console.log(LOG_OBJECT + 'successfully requested replica id', r);
    const controller = new Controller(collabTexteditorClient, codeMirrorEditor);
    controller.startService();
  });
}
