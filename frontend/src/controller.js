import {Editor} from "./editor";
import {Crdt} from "./crdt/crdt";
import {TiTreeNode} from "./model/tiTreeNode";
import {CHANGE_OBJECT_TYPE} from "./model/changeObject";

const LOG_OBJECT = "[controller] ";

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

            console.debug(LOG_OBJECT + "handleRemoteUpdateCallback()", node.toString());

            _crdt.addRemoteNodeToBuffer(node,(changeObject) => {

                console.debug(LOG_OBJECT + "execute CodeMirrorFunction");
                if (changeObject.getType() === CHANGE_OBJECT_TYPE.DELETION) {
                    codeMirrorEditor.delete(changeObject);
                } else {
                    codeMirrorEditor.insert(changeObject);
                }
            });
        };

        let subscribeForLocalUpdates = function (editor) {
            editor.subscribeForUpdates(handleLocalUpdateCallback);
        };

        /**
         * @param {ChangeObject} changeObject
         */
        let handleLocalUpdateCallback = async function (changeObject) {
            if (changeObject.getType() === CHANGE_OBJECT_TYPE.INSERTION) {
                let node = _crdt.localInsert(changeObject);
                console.debug(LOG_OBJECT + "call sendLocalUpdate()", node.toString());
                collabTexteditorClient.sendLocalUpdate(node);
            } else {
                let node = _crdt.localDelete(changeObject);
                console.debug(LOG_OBJECT + "call sendLocalUpdate()", node.toString());
                collabTexteditorClient.sendLocalUpdate(node);
            }
        };

    }
}

export {Controller};