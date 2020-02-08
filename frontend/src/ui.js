const SESSION_ID_INPUT = 'sessionId';
const EDITOR = 'collabEditor';

function addButtonListener(callback) {
  sessionSelectionButtonListener(callback);
}

function sessionSelectionButtonListener(callback) {
  document.getElementById('selectJoinSessionButton').addEventListener('click', function() {
    switchVisibilityOfElementsById('sessionSelection', 'joinSession');
    goBackButtonListener('goBackFromJoin', 'joinSession');
    joinSessionButtonListener(callback);
  });

  document.getElementById('selectCreateSessionButton').addEventListener('click', function() {
    switchVisibilityOfElementsById('sessionSelection', 'createSession');
    goBackButtonListener('goBackFromCreate', 'createSession');
    createSessionButtonListener(callback);
  });
}

function joinSessionButtonListener(callback) {
  const joinSessionButton = document.getElementById('joinSessionButton');
  joinSessionButton.addEventListener('click', function() {
    const nickName = document.getElementById('joinSessionNickName').value;
    const sessionId = document.getElementById(SESSION_ID_INPUT).value;
    callback(nickName, sessionId).then( (success) => {
      if (!success) {
        document.getElementById('sessionError').style.display = 'block';
      }
    });
  });
  const inputField = document.getElementById('joinSessionNickName');
  inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      joinSessionButton.click();
    }
  });
}

function createSessionButtonListener(callback) {
  const createSessionButton = document.getElementById('createSessionButton');
  createSessionButton.addEventListener('click', function() {
    const nickName = document.getElementById('createSessionNickName').value;
    switchVisibilityOfElementsById('createSession', EDITOR);
    callback(nickName);
  });
  const inputField = document.getElementById('createSessionNickName');
  inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      createSessionButton.click();
    }
  });
}

function goBackButtonListener(buttonId, hideIdElement) {
  document.getElementById(buttonId).addEventListener('click', function() {
    document.getElementById('sessionError').style.display = 'none';
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

export {addButtonListener, displaySessionInfosForTheUser, switchVisibilityOfElementsById};
