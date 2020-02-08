import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {CollabTexteditorClient} from './collabTexteditorClient';
import {Editor} from './editor';
import {addButtonListener, displaySessionInfosForTheUser, switchVisibilityOfElementsById} from './ui';

import './styles/styles.scss';
import {Controller} from './controller';

const LOG_OBJECT = '[main] ';

window.onload=function() {
  addButtonListener(initializeController);
};

async function initializeController(nickName, sessionId=undefined) {
  const collabTexteditorClient = new CollabTexteditorClient('http://localhost:8080');

  if (sessionId === undefined) {
    await collabTexteditorClient.createSessionId().then(
        (s) => {
          console.log(LOG_OBJECT + 'created new session', s);
          sessionId=s;
        });
  }

  collabTexteditorClient.joinSession(sessionId, nickName).then((r) => {
    if (r !== -1 ) {
      console.log(LOG_OBJECT + 'successfully requested replica id', r);

      switchVisibilityOfElementsById('joinSession', 'collabEditor');
      displaySessionInfosForTheUser(sessionId, nickName);

      const textAreaObj = document.getElementById('editorTextArea');
      const codeMirrorEditor = new Editor(textAreaObj);
      const controller = new Controller(collabTexteditorClient, codeMirrorEditor);
      controller.startService();
      return true;
    } else {
      console.log(LOG_OBJECT + 'Error during joinSession(): sessionId is', r);
      return false;
    }
  });
}
