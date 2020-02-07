const SESSION_ID_INPUT = 'sessionId';
const EDITOR = 'collabEditor';

function addButtonListener(callback) {
  const textAreaObj = document.getElementById('editorTextArea');
  sessionSelectionButtonListener(callback, textAreaObj);
}

function sessionSelectionButtonListener(callback, textAreaObj) {
  document.getElementById('selectJoinSessionButton').addEventListener('click', function() {
    switchVisibilityOfElementsById('sessionSelection', 'joinSession');
    goBackButtonListener('goBackFromJoin', 'joinSession');
    joinSessionButtonListener(callback, textAreaObj);
  });

  document.getElementById('selectCreateSessionButton').addEventListener('click', function() {
    switchVisibilityOfElementsById('sessionSelection', 'createSession');
    goBackButtonListener('goBackFromCreate', 'createSession');
    createSessionButtonListener(callback, textAreaObj);
  });
}

function joinSessionButtonListener(callback, textAreaObj) {
  document.getElementById('joinSessionButton').addEventListener('click', function() {
    // TODO check that the input fields are not empty
    const nickName = document.getElementById('joinSessionNickName').value;
    const sessionId = document.getElementById(SESSION_ID_INPUT).value;
    switchVisibilityOfElementsById('joinSession', EDITOR);

    callback(textAreaObj, nickName, sessionId);
  });
}

function createSessionButtonListener(callback, textAreaObj) {
  document.getElementById('createSessionButton').addEventListener('click', function() {
    const nickName = document.getElementById('createSessionNickName').value;
    switchVisibilityOfElementsById('createSession', EDITOR);
    callback(textAreaObj, nickName);
  });
}

function goBackButtonListener(buttonId, hideIdElement) {
  document.getElementById(buttonId).addEventListener('click', function() {
    switchVisibilityOfElementsById(hideIdElement, 'sessionSelection');
  });
}

function switchVisibilityOfElementsById(hideElementId, displayElementId) {
  document.getElementById(hideElementId).style.display = 'none';
  document.getElementById(displayElementId).style.display = 'block';
}

function displaySessionInfosForTheUser(sessionId, nickName) {
  document.getElementById('userSessionInfo').style.display = 'block';
  document.getElementById('sessionIdForUser').innerText = sessionId;
  document.getElementById('nickNameForUser').innerText = nickName;
}

export {addButtonListener, displaySessionInfosForTheUser};
