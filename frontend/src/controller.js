import {Editor} from "./editor";
import {Crdt} from "./crdt/crdt";
import {CHANGE_OBJECT_TYPE} from "./model/changeObject";

const LOG_OBJECT = "[controller] ";

/*
Tasks of the controller:
 - get new ReplicaId from the server
 - subscribe for remote updates => transfered callback
   to collabTexteditorClient handles remote insertions/deletions
 - transfer callback to editor => handle local insertions/deletions => send insertions/deletions to the server

 */
class Controller {

    /**
     * @param {CollabTexteditorClient} collabTexteditorClient
     * @param {Editor} codeMirrorEditor
     */
    constructor(collabTexteditorClient, codeMirrorEditor) {

        let _replicaId = collabTexteditorClient.getReplicaId();
        let _crdt = new Crdt(_replicaId);

        this.startService = function () {
            subscribeForRemoteUpdates(collabTexteditorClient);
            subscribeForLocalUpdates(codeMirrorEditor);
        };

        let subscribeForRemoteUpdates = function (collabTexteditorClient) {
            collabTexteditorClient.subscribeForUpdates(handleRemoteUpdateCallback);
        };

        /**
         * @param {TiTreeNode} node
         */
        let handleRemoteUpdateCallback = function (node) {
            if (node.isTombstone()) {
                let changeObject =_crdt.remoteDeletion(node);
                codeMirrorEditor.delete(changeObject);
            } else {
                let changeObject = _crdt.remoteInsert(node);
                codeMirrorEditor.insert(changeObject);
            }
        };

        let subscribeForLocalUpdates = function (editor) {
            editor.subscribeForUpdates(handleLocalUpdateCallback);
        };

        /**
         * @param {ChangeObject} changeObject
         */
        let handleLocalUpdateCallback = function (changeObject) {
            if (changeObject.getType() === CHANGE_OBJECT_TYPE.DELETION) {
                let node = _crdt.localDeletion(changeObject);
                collabTexteditorClient.sendLocalUpdate(node);
            } else {
                let node = _crdt.localInsert(changeObject);
                collabTexteditorClient.sendLocalUpdate(node);
            }
        };

    }
}

export {Controller};