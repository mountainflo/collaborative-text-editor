import {Crdt} from './crdt/crdt';
import {CHANGE_OBJECT_TYPE} from './model/changeObject';

const LOG_OBJECT = '[controller] ';

class Controller {
  /**
   * @param {CollabTexteditorClient} collabTexteditorClient
   * @param {Editor} codeMirrorEditor
   */
  constructor(collabTexteditorClient, codeMirrorEditor) {
    const _replicaId = collabTexteditorClient.getReplicaId();
    const _crdt = new Crdt(_replicaId);

    this.startService = function() {
      subscribeForRemoteUpdates(collabTexteditorClient);
      subscribeForLocalUpdates(codeMirrorEditor);
    };

    const subscribeForRemoteUpdates = function(collabTexteditorClient) {
      collabTexteditorClient.subscribeForUpdates(handleRemoteUpdateCallback);
    };

    /**
     * @param {TiTreeNode} node
     * @param {number} senderReplicaId
     * @param {string} nickName
     */
    const handleRemoteUpdateCallback = function(node, senderReplicaId, nickName) {
      if (node !== undefined) {
        console.debug(LOG_OBJECT + 'handleRemoteUpdateCallback()', node.toString(), nickName);
        _crdt.addRemoteNodeToBuffer(node, (changeObject) => {
          console.debug(LOG_OBJECT + 'execute CodeMirrorFunction');
          if (changeObject.getType() === CHANGE_OBJECT_TYPE.DELETION) {
            codeMirrorEditor.delete(changeObject);
          } else {
            codeMirrorEditor.insert(changeObject);
          }
          codeMirrorEditor.displayRemoteCursor(changeObject, senderReplicaId, nickName);
        });
      } else {
        console.debug(LOG_OBJECT + 'handleRemoteUpdateCallback(): replica left the session. Remove remote cursor', senderReplicaId, nickName);
        codeMirrorEditor.removeRemoteCursor(senderReplicaId);
      }
    };


    const subscribeForLocalUpdates = function(editor) {
      editor.subscribeForUpdates(handleLocalUpdateCallback);
    };

    /**
     * @param {ChangeObject} changeObject
     */
    const handleLocalUpdateCallback = async function(changeObject) {
      if (changeObject.getType() === CHANGE_OBJECT_TYPE.INSERTION) {
        const node = _crdt.localInsert(changeObject);
        console.debug(LOG_OBJECT + 'call sendLocalUpdate()', node.toString());
        collabTexteditorClient.sendLocalUpdate(node);
      } else {
        const node = _crdt.localDelete(changeObject);
        console.debug(LOG_OBJECT + 'call sendLocalUpdate()', node.toString());
        collabTexteditorClient.sendLocalUpdate(node);
      }
    };
  }
}

export {Controller};
